from passlib.context import CryptContext
from models.user import UserInDB, User, TokenData
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, APIRouter
from jose import jwt, JWTError
from dotenv import load_dotenv, dotenv_values
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database.users import get_user, get_users, get_user_by_username, add_user


load_dotenv()

SECRET_KEY = dotenv_values(".env")["SECRET_KEY"]
ALGORITHM = dotenv_values(".env")["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    dotenv_values(".env")["TOKEN_EXPIRE_MINUTES"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str):
    user = get_user_by_username(username)
    if not user:
        return False
    if not verify_password(password, user[0].password):
        return False
    return user


def create_user(username: str, email: str, password: str):
    hashed_password = get_password_hash(password)
    add_user(username=username, email=email,
             password=hashed_password, settings="{}")
    return "User created successfully"


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    users = get_users()
    user = get_user_by_username(token_data.username)
    if user is None:
        raise credentials_exception
    return user[0]
