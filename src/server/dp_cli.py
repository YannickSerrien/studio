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
import json
from dynamic_programming_optimizer import MobilityOptimizer
from advanced_analysis import AdvancedAnalyzer


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
        epilog="""
Examples:
  # Optimize 8-hour shift starting at 8 AM from cluster c_3_2
  python3 dp_cli.py --city 3 --cluster c_3_2 --hour 8 --duration 8 --date 2023-01-15

  # Find best starting positions for a 6-hour shift at 10 AM
  python3 dp_cli.py --city 1 --best-positions --hour 10 --duration 6 --date 2023-02-01

  # Compare different work schedules for cluster c_3_2
  python3 dp_cli.py --city 3 --compare-schedules --cluster c_3_2 --date 2023-01-15

  # Analyze weekly earnings pattern
  python3 dp_cli.py --city 3 --weekly --cluster c_3_2 --hour 8 --duration 8 --date 2023-01-15
        """
    )

    # Required arguments
    parser.add_argument('--city', type=int, required=True,
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
    analysis_group.add_argument('--weekly', action='store_true',
                               help='Weekly earnings analysis')
    analysis_group.add_argument('--cluster-popularity', action='store_true',
                               help='Analyze cluster popularity')

    # Optional parameters
    parser.add_argument('--hour', type=int,
                       help='Starting hour (0-23, default: current hour)')
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
    parser.add_argument('--json-output', action='store_true',
                       help='Export results to JSON format to stdout')
    parser.add_argument('--verbose', action='store_true',
                       help='Verbose output')

    args = parser.parse_args()

    now = datetime.now()
    if args.date is None:
        args.date = now
    if args.hour is None:
        args.hour = now.hour


    # Validate arguments
    if args.hour < 0 or args.hour > 23:
        print("Error: Hour must be between 0 and 23", file=sys.stderr)
        sys.exit(1)

    if args.duration < 1 or args.duration > 24:
        print("Error: Duration must be between 1 and 24 hours", file=sys.stderr)
        sys.exit(1)

    # Initialize optimizer
    if not args.json_output:
        print(f"Initializing optimizer (ε={args.epsilon}, γ={args.gamma}, λ_floor={args.lambda_floor})...", file=sys.stderr)

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
        # Execute analysis based on selected type
        if args.cluster:
            if not args.json_output:
              print(f"\n=== CLUSTER ANALYSIS: {args.cluster} ===")
              print(f"City: {args.city}, Date: {args.date.date()}")
              print(f"Schedule: {args.hour:02d}:00 for {args.duration} hours")
              print("-" * 50)

            earnings, path = optimizer.solve_dp(
                args.city, args.cluster, args.hour, args.duration, args.date
            )
            results['cluster_analysis'] = {
                'cluster': args.cluster,
                'total_earnings': earnings,
                'hourly_rate': earnings/args.duration,
                'optimal_path': path
            }
            if not args.json_output:
              print(f"Expected total earnings: €{earnings:.2f}")
              print(f"Expected hourly rate: €{earnings/args.duration:.2f}/hour")
              print(f"Optimal path: {' -> '.join(path)}")

        elif args.best_positions:
            if not args.json_output:
              print(f"\n=== BEST STARTING POSITIONS ===")
              print(f"City: {args.city}, Date: {args.date.date()}")
              print(f"Schedule: {args.hour:02d}:00 for {args.duration} hours")
              print("-" * 50)

            best_positions = optimizer.analyze_best_starting_positions(
                args.city, args.hour, args.duration, args.date, args.top_k
            )

            results['best_positions'] = [
                {'rank': i, 'cluster': cluster, 'earnings': earnings, 'path': path}
                for i, (cluster, earnings, path) in enumerate(best_positions, 1)
            ]
            if not args.json_output:
              for i, (cluster, earnings, path) in enumerate(best_positions, 1):
                  print(f"{i:2d}. {cluster}: €{earnings:.2f} (€{earnings/args.duration:.2f}/h)")
                  if args.verbose:
                      print(f"    Path: {' -> '.join(path)}")

        elif args.compare_schedules:
            # ... (rest of the analysis types can be filled in similarly)
            pass

        # Export to JSON if requested
        if args.json_output:
            print(json.dumps(results, indent=2))

    except Exception as e:
        print(f"Error during analysis: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
