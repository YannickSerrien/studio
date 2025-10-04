
#!/usr/bin/env python3
"""
Command-line interface for the Dynamic Programming Optimizer

This script provides a simple command-line interface to the DP optimizer,
allowing users to quickly analyze different scenarios without writing code.

Usage examples:
    python3 dp_cli.py --city 3 --cluster c_3_2 --hour 8 --duration 8 --date 2023-01-15
    python3 dp_cli.py --city 1 --best-positions --hour 10 --duration 6 --date 2023-02-01
    python3 dp_cli.py --city 3 --compare-schedules --cluster c_3_2 --date 2023-01-15
"""

import argparse
from datetime import datetime, timedelta
import sys
import os
from .dynamic_programming_optimizer import MobilityOptimizer
from .advanced_analysis import AdvancedAnalyzer


def parse_date(date_str: str) -> datetime:
    """Parse date string in YYYY-MM-DD format."""
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        raise argparse.ArgumentTypeError(f"Invalid date format: {date_str}. Use YYYY-MM-DD")


def main():
    parser = argparse.ArgumentParser(
        description="Dynamic Programming Optimizer for Ride-sharing Driver Earnings",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    
    # Required arguments
    parser.add_argument('--city', type=str, required=True,
                       help='City ID (1-5)')
    parser.add_argument('--date', type=parse_date,
                       help='Start date in YYYY-MM-DD format')
    
    # Analysis type (mutually exclusive)
    analysis_group = parser.add_mutually_exclusive_group(required=True)
    analysis_group.add_argument('--cluster', type=str,
                               help='Analyze specific starting cluster (e.g., c_3_2)')
    analysis_group.add_argument('--best-positions', action='store_true',
                               help='Find best starting positions')
    analysis_group.add_argument('--compare-schedules', action='store_true',
                               help='Compare different work schedules')
    
    # Optional parameters
    parser.add_argument('--hour', type=int, default=8,
                       help='Starting hour (0-23, default: 8)')
    parser.add_argument('--duration', type=int, default=8,
                       help='Work duration in hours (default: 8)')
    parser.add_argument('--top-k', type=int, default=5,
                       help='Number of top results to show (default: 5)')
    
    # Optimizer parameters
    parser.add_argument('--epsilon', type=float, default=0.1,
                       help='Laplace smoothing parameter (default: 0.1)')
    parser.add_argument('--gamma', type=float, default=0.95,
                       help='Discount factor (default: 0.95)')
    parser.add_argument('--lambda-floor', type=float, default=0.5,
                       help='Minimum demand rate (default: 0.5)')
    
    # Output options
    parser.add_argument('--json', type=str,
                       help='Export results to JSON file')
    
    args = parser.parse_args()
    
    if not args.date:
        args.date = datetime.now()

    # Validate arguments
    if args.hour < 0 or args.hour > 23:
        print("Error: Hour must be between 0 and 23", file=sys.stderr)
        sys.exit(1)
    
    if args.duration < 1 or args.duration > 24:
        print("Error: Duration must be between 1 and 24 hours", file=sys.stderr)
        sys.exit(1)
    
    # Convert city to int
    args.city = int(args.city)

    # Initialize optimizer
    optimizer = MobilityOptimizer(
        epsilon=args.epsilon,
        gamma=args.gamma,
        lambda_floor=args.lambda_floor
    )
    
    analyzer = AdvancedAnalyzer(optimizer)
    
    # Check if city exists
    if args.city not in optimizer.graphs:
        print(f"Error: City {args.city} not found. Available cities: {list(optimizer.graphs.keys())}", file=sys.stderr)
        sys.exit(1)
    
    results = {}
    
    try:
        if args.best-positions:
            best_positions = analyzer.optimizer.analyze_best_starting_positions(
                args.city, args.hour, args.duration, args.date, args.top_k
            )
            
            # Find the coordinates for the best cluster
            best_cluster_id = best_positions[0][0]
            graph = optimizer.graphs[args.city]
            lat = graph.nodes[best_cluster_id].get('lat', 0.0)
            lon = graph.nodes[best_cluster_id].get('lon', 0.0)

            results['best_positions'] = [
                {'rank': i, 'cluster': cluster, 'earnings': earnings, 'path': path}
                for i, (cluster, earnings, path) in enumerate(best_positions, 1)
            ]
            results['best_positions'][0]['lat'] = lat
            results['best_positions'][0]['lon'] = lon
        
        elif args.compare_schedules:
            # We need a representative cluster to run this analysis.
            # We will pick the one with the most outgoing trips on average.
            graph = optimizer.graphs[args.city]
            
            cluster_outgoing_trips = {}
            for node in graph.nodes():
                total_trips = sum(
                    d.get('total_trips', 0)
                    for _, _, d in graph.out_edges(node, data=True)
                )
                cluster_outgoing_trips[node] = total_trips
            
            # Get cluster with max outgoing trips
            start_cluster = max(cluster_outgoing_trips, key=cluster_outgoing_trips.get)
            
            schedules = [
                (6, 8), (8, 8), (10, 8), (14, 8), (18, 8), (22, 8),
                (8, 4), (8, 6), (8, 10), (8, 12)
            ]
            
            schedule_results_df = analyzer.compare_work_schedules(
                args.city, start_cluster, args.date, schedules
            )
            
            results['schedule_comparison'] = schedule_results_df.to_dict('records')
        
        # Export to JSON if requested
        if args.json:
            analyzer.export_results_to_json(args.city, results, args.json)
        else:
            # If not exporting to JSON, print to stdout for direct consumption by API
            import json
            print(json.dumps(results))

    except Exception as e:
        print(f"Error during analysis: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
