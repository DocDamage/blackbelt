"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2026-02-15 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create analysis_results table
    op.create_table(
        'analysis_results',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('analysis_type', sa.String(), nullable=False),
        sa.Column('results', sa.Text(), nullable=False),
        sa.Column('metadata', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create index on analysis_type
    op.create_index(
        'idx_analysis_type',
        'analysis_results',
        ['analysis_type']
    )
    
    # Create index on created_at
    op.create_index(
        'idx_created_at',
        'analysis_results',
        ['created_at']
    )
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False, server_default='user'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    
    # Create index on email
    op.create_index(
        'idx_user_email',
        'users',
        ['email']
    )
    
    # Create api_keys table
    op.create_table(
        'api_keys',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('key_hash', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('last_used_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )
    
    # Create index on user_id
    op.create_index(
        'idx_api_key_user',
        'api_keys',
        ['user_id']
    )


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_index('idx_api_key_user', table_name='api_keys')
    op.drop_table('api_keys')
    
    op.drop_index('idx_user_email', table_name='users')
    op.drop_table('users')
    
    op.drop_index('idx_created_at', table_name='analysis_results')
    op.drop_index('idx_analysis_type', table_name='analysis_results')
    op.drop_table('analysis_results')
