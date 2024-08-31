from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import String

from database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    username: Mapped[str] = mapped_column(String, nullable=False)
    redis_token_key: Mapped[str] = mapped_column(String, default=None, nullable=True)