import os

class Settings:
    PROJECT_NAME: str = "Cyra Sentinel"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cyra_sentinel.db")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]

settings = Settings()
