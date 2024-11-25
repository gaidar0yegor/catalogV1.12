FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set PATH to include /usr/local/bin
ENV PATH="/usr/local/bin:${PATH}"

# Copy application code
COPY app/ app/
COPY alembic/ alembic/
COPY alembic.ini .

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "$PORT"]
