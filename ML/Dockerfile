# Use official Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install OS dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
