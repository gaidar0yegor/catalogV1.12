"""Create catalog tables

Revision ID: 001
Revises: 
Create Date: 2023-11-22 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create catalogs table
    op.create_table(
        'catalogs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('source_type', sa.String(), nullable=False),
        sa.Column('schema', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_catalogs_id'), 'catalogs', ['id'], unique=False)

    # Create catalog_data table
    op.create_table(
        'catalog_data',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('catalog_id', sa.Integer(), nullable=False),
        sa.Column('data', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['catalog_id'], ['catalogs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_catalog_data_id'), 'catalog_data', ['id'], unique=False)

    # Create column_mappings table
    op.create_table(
        'column_mappings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('catalog_id', sa.Integer(), nullable=False),
        sa.Column('source_column', sa.String(), nullable=False),
        sa.Column('target_column', sa.String(), nullable=False),
        sa.Column('transformation_rule', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['catalog_id'], ['catalogs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_column_mappings_id'), 'column_mappings', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_column_mappings_id'), table_name='column_mappings')
    op.drop_table('column_mappings')
    op.drop_index(op.f('ix_catalog_data_id'), table_name='catalog_data')
    op.drop_table('catalog_data')
    op.drop_index(op.f('ix_catalogs_id'), table_name='catalogs')
    op.drop_table('catalogs')
