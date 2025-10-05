"""
Advanced Analysis for Mobility Data

This module provides higher-level analysis functions built on top of the
MobilityOptimizer. It includes features like comparing work schedules,
analyzing weekly earnings patterns, and identifying cluster popularity.
"""
import pandas as pd
from datetime import timedelta
from typing import List, Tuple
import json

class AdvancedAnalyzer:
    """
    Performs advanced analysis using the MobilityOptimizer.
    """
    
    def __init__(self, optimizer):
        self.optimizer = optimizer
        
    def compare_work_schedules(self, 
                               city_id: int, 
                               start_cluster: str, 
                               start_date: pd.Timestamp,
                               schedules: List[Tuple[int, int]]) -> pd.DataFrame:
        """
        Compare expected earnings for different work schedules.
        
        Args:
            city_id: City identifier
            start_cluster: Starting cluster
            start_date: Start date for the analysis
            schedules: List of (start_hour, duration) tuples
            
        Returns:
            DataFrame with schedule comparison results.
        """
        results = []
        for start_hour, duration in schedules:
            earnings, path = self.optimizer.solve_dp(
                city_id, start_cluster, start_hour, duration, start_date
            )
            results.append({
                'start_hour': f"{start_hour:02d}:00",
                'duration': duration,
                'total_earnings': earnings,
                'hourly_rate': earnings / duration if duration > 0 else 0,
                'path_preview': ' -> '.join(path[:3]) + ('...' if len(path) > 3 else '')
            })
        
        return pd.DataFrame(results).sort_values('hourly_rate', ascending=False)
        
    def weekly_analysis(self, 
                        city_id: int, 
                        start_cluster: str, 
                        start_hour: int, 
                        duration: int, 
                        week_start_date: pd.Timestamp) -> pd.DataFrame:
        """
        Analyze daily earnings potential over a full week.
        
        Args:
            city_id: City ID
            start_cluster: Starting cluster
            start_hour: Daily start hour
            duration: Daily work duration
            week_start_date: The starting date of the week
            
        Returns:
            DataFrame with daily earnings for the week.
        """
        results = []
        for i in range(7):
            current_date = week_start_date + timedelta(days=i)
            day_name = current_date.strftime('%A')
            
            earnings, path = self.optimizer.solve_dp(
                city_id, start_cluster, start_hour, duration, current_date
            )
            
            results.append({
                'date': current_date.date(),
                'day_of_week': day_name,
                'total_earnings': earnings,
                'hourly_rate': earnings / duration if duration > 0 else 0
            })
            
        return pd.DataFrame(results)

    def cluster_popularity_analysis(self, city_id: int, hour: int) -> pd.DataFrame:
        """
        Analyze cluster popularity based on incoming and outgoing trips.
        
        Args:
            city_id: City ID
            hour: Hour of the day to analyze
        
        Returns:
            DataFrame with cluster popularity metrics.
        """
        graph = self.optimizer.graphs[city_id]
        results = []
        
        for node in graph.nodes():
            incoming = sum(
                d.get('hourly_trips', {}).get(hour, 0)
                for _, _, d in graph.in_edges(node, data=True)
            )
            outgoing = sum(
                d.get('hourly_trips', {}).get(hour, 0)
                for _, _, d in graph.out_edges(node, data=True)
            )
            
            earning_rate = self.optimizer.compute_earning_rate(
                graph, node, hour, city_id, pd.Timestamp.now()
            )
            
            results.append({
                'cluster': node,
                'incoming_trips': incoming,
                'outgoing_trips': outgoing,
                'net_flow': outgoing - incoming,
                'earning_rate_per_hour': earning_rate
            })
        
        return pd.DataFrame(results).sort_values('outgoing_trips', ascending=False)
        
    def export_results_to_json(self, city_id: int, results: dict, filename: str):
        """
        Export analysis results to a JSON file.
        
        Args:
            city_id: City ID
            results: Dictionary containing analysis results
            filename: Output JSON filename
        """
        output = {
            'city_id': city_id,
            'timestamp': pd.Timestamp.now().isoformat(),
            'analysis': results
        }
        
        with open(filename, 'w') as f:
            json.dump(output, f, indent=4)
            
        print(f"✓ Results exported to {filename}")


    