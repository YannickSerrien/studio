"""Graph building utilities for city-based ride data.

This module reads the ride trips CSV and constructs per-city directed graphs.
Nodes represent clusters from the ride data, and edges carry average duration and fare
between nodes (including self-edges). Utilities are provided to convert graphs
to Cytoscape elements for interactive UI rendering.
"""

import networkx as nx
import numpy as np
import pandas as pd
import os

# Correct the path to be relative to this file's location
base_dir = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(base_dir, 'data', 'ride_trips_with_clusters.csv')

# Read CSV
rides = pd.read_csv(CSV_PATH)

# Build graphs per city
def build_city_graphs(rides: pd.DataFrame) -> dict[int, nx.DiGraph]:
  """Build a directed graph per city where nodes are clusters and edges carry averages."""
  city_graphs: dict[int, nx.DiGraph] = {}
  for city_id in rides["city_id"].unique():
    city_df = rides[rides["city_id"] == city_id].copy()
    city_df["pickup_node"] = city_df["pickup_cluster"]
    city_df["dropoff_node"] = city_df["dropoff_cluster"]
    
    g: nx.DiGraph = nx.DiGraph()
    # Add nodes
    nodes = set(city_df["pickup_node"]).union(set(city_df["dropoff_node"]))

    # Store node positions (average lat/lon of all rides in this cluster) for UI positioning
    for node_id in nodes:
      # Get average coordinates for pickup clusters
      pickup_coords = city_df[city_df["pickup_cluster"] == node_id][["pickup_lat", "pickup_lon"]]
      dropoff_coords = city_df[city_df["dropoff_cluster"] == node_id][["drop_lat", "drop_lon"]]
      
      # Combine coordinates from both pickup and dropoff instances
      all_lats = []
      all_lons = []
      
      if not pickup_coords.empty:
        all_lats.extend(pickup_coords["pickup_lat"].tolist())
        all_lons.extend(pickup_coords["pickup_lon"].tolist())
      
      if not dropoff_coords.empty:
        all_lats.extend(dropoff_coords["drop_lat"].tolist())
        all_lons.extend(dropoff_coords["drop_lon"].tolist())
      
      # Calculate average position
      if all_lats and all_lons:
        avg_lat = np.mean(all_lats)
        avg_lon = np.mean(all_lons)
      else:
        avg_lat = avg_lon = 0.0
      
      g.add_node(node_id, lat=avg_lat, lon=avg_lon)

    # Add edges with average time and price, plus hourly statistics
    # First convert start_time to datetime and extract hour
    city_df["start_time"] = pd.to_datetime(city_df["start_time"])
    city_df["hour"] = city_df["start_time"].dt.hour
    
    # Group by pickup/dropoff nodes and calculate overall averages
    edge_stats = (
      city_df.groupby(["pickup_node", "dropoff_node"])
      .agg({
        "duration_mins": "mean", 
        "fare_amount": "mean",
        "ride_id": "count"  # total trips
      })
      .reset_index()
    )
    
    # Calculate hourly statistics for each edge
    hourly_stats = (
      city_df.groupby(["pickup_node", "dropoff_node", "hour"])
      .agg({
        "ride_id": "count",
        "duration_mins": "mean",
        "fare_amount": "mean"
      })
      .reset_index()
    )
    
    for _, row in edge_stats.iterrows():
      pickup_node = row["pickup_node"]
      dropoff_node = row["dropoff_node"]
      
      # Get hourly data for this edge
      edge_hourly = hourly_stats[
        (hourly_stats["pickup_node"] == pickup_node) & 
        (hourly_stats["dropoff_node"] == dropoff_node)
      ]
      
      # Create hourly maps
      hourly_trips = {}
      hourly_avg_time = {}
      hourly_avg_price = {}
      
      for _, hourly_row in edge_hourly.iterrows():
        hour = int(hourly_row["hour"])
        hourly_trips[hour] = int(hourly_row["ride_id"])
        hourly_avg_time[hour] = float(hourly_row["duration_mins"])
        hourly_avg_price[hour] = float(hourly_row["fare_amount"])
      
      g.add_edge(
        pickup_node,
        dropoff_node,
        avg_time=float(row["duration_mins"]),
        avg_price=float(row["fare_amount"]),
        total_trips=int(row["ride_id"]),
        hourly_trips=hourly_trips,
        hourly_avg_time=hourly_avg_time,
        hourly_avg_price=hourly_avg_price,
      )
    city_graphs[int(city_id)] = g
  return city_graphs
