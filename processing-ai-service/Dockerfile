FROM python:3.11-slim

# Install uv
RUN pip install uv

# Keep uv virtual environment OUTSIDE the mounted project
ENV UV_PROJECT_ENVIRONMENT=/opt/venv

WORKDIR /app

# Copy dependency files first (better Docker caching)
COPY pyproject.toml uv.lock ./

# Copy source code
COPY . .

# Install dependencies
RUN uv sync --frozen

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]