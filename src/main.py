import uvicorn
import uuid

from fastapi import FastAPI
from fastapi_users import FastAPIUsers

from auth.auth_backend import auth_backend
from auth.models import User
from auth.schemas import UserRead, UserCreate
from auth.user_manager import get_user_manager


app = FastAPI(title="YourToDoList")

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix='/auth',
    tags=['auth']
)

app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags = ["auth"]
)

if __name__ == "__main__":
    uvicorn.run(
        __name__ + ":app",
        host='127.0.0.1',
        port=7000,
        reload=True
    )