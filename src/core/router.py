from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from core.schemas import ItemCreate
from database import get_async_session
from core.models import Item
from auth.models import User
from auth.user_manager import get_user_manager, BaseUserManager

router = APIRouter(
    prefix="/todo",
    tags=["ToDoList"]
)

from main import fastapi_users

current_user = fastapi_users.current_user()

@router.post("/add_item")
async def add_item_to_list(item: ItemCreate, 
                           session: AsyncSession = Depends(get_async_session),
                           user: User = Depends(current_user)):
    item_db = Item(**item.model_dump(), user_id=user.id)
    session.add(item_db)
    await session.commit()

@router.get("/get_items")
async def get_items(user: User = Depends(current_user),
                    session: AsyncSession = Depends(get_async_session)):
    query = select(User).options(joinedload(User.to_do_items)).filter(user.id == User.id)
    user_with_items = await session.execute(query)
    user_with_items = user_with_items.unique().scalars().first()
    
    return user_with_items.to_do_items
    