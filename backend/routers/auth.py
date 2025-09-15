from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from core.database import get_database
from models.database_models import User, UserRole
from core.config import settings

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.CITIZEN
    phone_number: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Here you would fetch user from database
    # For now, return user data from token
    return {"id": user_id, "email": payload.get("email"), "role": payload.get("role")}

@router.post("/register", response_model=Token)
async def register_user(user: UserCreate):
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user (simplified - in real app, save to database)
    user_data = {
        "id": "user_123",  # Generate proper UUID
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "phone_number": user.phone_number
    }
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data["id"], "email": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    # Simplified authentication - in real app, verify against database
    if user_credentials.email == "admin@atlas-alert.com" and user_credentials.password == "admin123":
        user_data = {
            "id": "admin_123",
            "email": user_credentials.email,
            "full_name": "Admin User",
            "role": "admin"
        }
    elif user_credentials.email == "analyst@atlas-alert.com" and user_credentials.password == "analyst123":
        user_data = {
            "id": "analyst_123", 
            "email": user_credentials.email,
            "full_name": "Analyst User",
            "role": "analyst"
        }
    else:
        user_data = {
            "id": "citizen_123",
            "email": user_credentials.email,
            "full_name": "Citizen User", 
            "role": "citizen"
        }
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data["id"], "email": user_data["email"], "role": user_data["role"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data
    }

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return current_user
