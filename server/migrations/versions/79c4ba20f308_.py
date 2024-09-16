"""empty message

Revision ID: 79c4ba20f308
Revises: 7307319a0b91
Create Date: 2024-09-15 10:53:37.911502

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '79c4ba20f308'
down_revision = '7307319a0b91'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(length=20),
               type_=sa.String(length=50),
               existing_nullable=False)
        batch_op.alter_column('is_primary',
               existing_type=sa.BOOLEAN(),
               nullable=True)

    with op.batch_alter_table('work_schedule', schema=None) as batch_op:
        batch_op.alter_column('working_days',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=50),
               existing_nullable=False)
        batch_op.alter_column('off_days',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=50),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('work_schedule', schema=None) as batch_op:
        batch_op.alter_column('off_days',
               existing_type=sa.String(length=50),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)
        batch_op.alter_column('working_days',
               existing_type=sa.String(length=50),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)

    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.alter_column('is_primary',
               existing_type=sa.BOOLEAN(),
               nullable=False)
        batch_op.alter_column('status',
               existing_type=sa.String(length=50),
               type_=sa.VARCHAR(length=20),
               existing_nullable=False)

    # ### end Alembic commands ###
