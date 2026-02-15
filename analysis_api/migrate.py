#!/usr/bin/env python3
"""
Database Migration Utility

Simple wrapper around Alembic commands for the Six Sigma Analysis API.
"""

import argparse
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def run_upgrade():
    """Run all pending migrations."""
    from alembic import command
    from alembic.config import Config
    
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("✅ Database upgraded to latest version")


def run_downgrade():
    """Downgrade one revision."""
    from alembic import command
    from alembic.config import Config
    
    alembic_cfg = Config("alembic.ini")
    command.downgrade(alembic_cfg, "-1")
    print("✅ Database downgraded one version")


def create_migration(name):
    """Create a new migration."""
    from alembic import command
    from alembic.config import Config
    
    alembic_cfg = Config("alembic.ini")
    command.revision(alembic_cfg, autogenerate=True, message=name)
    print(f"✅ Created new migration: {name}")


def show_current():
    """Show current migration version."""
    from alembic import command
    from alembic.config import Config
    
    alembic_cfg = Config("alembic.ini")
    command.current(alembic_cfg)


def show_history():
    """Show migration history."""
    from alembic import command
    from alembic.config import Config
    
    alembic_cfg = Config("alembic.ini")
    command.history(alembic_cfg)


def init_db():
    """Initialize database with all migrations."""
    from alembic import command
    from alembic.config import Config
    
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("✅ Database initialized")


def main():
    parser = argparse.ArgumentParser(
        description="Database migration utility for Six Sigma Analysis API"
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Upgrade command
    subparsers.add_parser("upgrade", help="Run all pending migrations")
    
    # Downgrade command
    subparsers.add_parser("downgrade", help="Downgrade one revision")
    
    # Create migration command
    create_parser = subparsers.add_parser("create", help="Create a new migration")
    create_parser.add_argument("name", help="Migration name/description")
    
    # Current version command
    subparsers.add_parser("current", help="Show current migration version")
    
    # History command
    subparsers.add_parser("history", help="Show migration history")
    
    # Init command
    subparsers.add_parser("init", help="Initialize database")
    
    args = parser.parse_args()
    
    if args.command == "upgrade":
        run_upgrade()
    elif args.command == "downgrade":
        run_downgrade()
    elif args.command == "create":
        create_migration(args.name)
    elif args.command == "current":
        show_current()
    elif args.command == "history":
        show_history()
    elif args.command == "init":
        init_db()
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
