from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # Variables automatically read from the environment or .env file
    app_name: str = "FastAPI App"
    debug_mode: bool
    NODE_SERVER_URL_SUMMARY: str
    NODE_SERVER_URL_QUIZ:str
    
    GROK_API_KEY: str
    MODEL_NAME: str = "openai/gpt-oss-120b"
  

    # Configuration for Pydantic to locate the env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings():
    """Returns a cached instance of settings to avoid reading disk repeatedly."""
    return Settings()
