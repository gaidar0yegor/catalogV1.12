from sqlalchemy.orm import Session
from ..core.config import settings
from ..models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db(db: Session) -> None:
    # Create initial superuser if it doesn't exist
    user = db.query(User).filter(User.email == "admin@example.com").first()
    if not user:
        user = User(
            email="admin@example.com",
            hashed_password=pwd_context.hash("admin123"),  # Change in production
            full_name="Initial Admin",
            is_superuser=True,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
