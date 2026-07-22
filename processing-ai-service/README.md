# Processing AI Service

This service handles learning-content processing and classification for the AI Learning Intelligence System.

It accepts learning activities from the Node.js backend, checks Redis for previously classified content, queues AI processing using Celery, processes learning content through LangGraph and Groq, and returns structured classification results to the Node.js backend.

## What This Service Does

Exposes FastAPI endpoints under `/api`.

Uses Redis to cache classification results.

Uses Celery for asynchronous background processing.

Fetches webpage content when learning content needs to be retrieved from a URL.

Cleans and normalizes learning content before classification.

Uses LangGraph to control the AI processing workflow.

Uses Groq as the LLM provider.

Classifies learning activities into:

- Track
- Topic
- Subtopics
- Resource type
- Problem difficulty

Returns a Celery task ID immediately when background processing starts.

Provides an endpoint for checking Celery task results.

Sends completed classification results back to the Node.js backend through a callback.

Runs FastAPI, Redis, and Celery using Docker Compose.


# Project Flow

The browser extension sends a learning activity to the Node.js backend.

The Node.js backend stores the Activity in MongoDB.

The backend sends the activity to:

`POST /api/process/`

The Processing AI Service checks Redis using the activity URL.

If a cached classification exists, the cached result is returned immediately.

If no cached classification exists, a Celery task is created.

FastAPI immediately returns the Celery task ID.

The Celery worker processes the activity in the background.

The LangGraph workflow fetches and processes the learning content.

Groq classifies the learning material.

The classification is stored in Redis.

The completed classification is returned to the Node.js backend.

The backend updates the Activity in MongoDB.

The backend then links the classified Activity to the appropriate Dashboard Track and Topic.


# Classification Structure

A classification result has the following structure:

```json
{
  "track": "Data Structures & Algorithms",
  "topic": "Graph Traversal",
  "subtopics": [
    "Breadth First Search",
    "Graph Representation"
  ],
  "resource_type": "Tutorial",
  "problem_difficulty": null
}
```


# API

Base URL during local development:

```text
http://localhost:8000
```


## Health Check

### GET `/health`

Purpose:

Checks whether the Processing AI Service is running.

Example response:

```json
{
  "success": true,
  "service": "Processing AI Service",
  "version": "1.0.0",
  "status": "healthy"
}
```


# Process Learning Activity

### POST `/api/process/`

Purpose:

Accepts learning content and starts classification.

Before starting AI processing, Redis is checked using the learning URL.

If the URL has already been classified, the cached result is returned.

Otherwise, a Celery task is created.


## Request Body

```json
{
  "url": "https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/",
  "title": "Breadth First Search",
  "content": "Breadth First Search is a graph traversal algorithm...",
  "platform": "GeeksForGeeks",
  "metadata": {
    "category": "Data Structures and Algorithms"
  }
}
```


## Processing Response

```json
{
  "success": true,
  "cached": false,
  "status": "PROCESSING",
  "task_id": "db5ab0ff-8fe5-4fdb-a28d-c0f77b4c2712"
}
```


## Cache Hit Response

```json
{
  "success": true,
  "cached": true,
  "status": "COMPLETED",
  "data": {
    "classification": {
      "track": "Data Structures & Algorithms",
      "topic": "Graph Traversal",
      "subtopics": [
        "Breadth First Search",
        "Graph Representation"
      ],
      "resource_type": "Tutorial",
      "problem_difficulty": null
    }
  }
}
```


# Get Processing Result

### GET `/api/process/{task_id}`

Purpose:

Checks the status of a Celery processing task and returns the classification when processing has completed.

Example:

```text
GET /api/process/db5ab0ff-8fe5-4fdb-a28d-c0f77b4c2712
```


## Possible Status Values

```text
PENDING
PROCESSING
RETRYING
COMPLETED
FAILED
```


## Completed Response

```json
{
  "success": true,
  "task_id": "db5ab0ff-8fe5-4fdb-a28d-c0f77b4c2712",
  "status": "COMPLETED",
  "data": {
    "classification": {
      "track": "Data Structures & Algorithms",
      "topic": "Graph Traversal",
      "subtopics": [
        "Breadth First Search",
        "Graph Representation"
      ],
      "resource_type": "Tutorial",
      "problem_difficulty": null
    }
  }
}
```


# Callback Contract With Node Backend

When background classification completes, the Processing AI Service sends the result back to the Node.js backend.

During Docker-based local development, the callback URL is:

```text
http://host.docker.internal:5000/api/activities/ai-callback
```


## Classification Callback

### POST `/api/activities/ai-callback`

The Node.js backend receives:

```json
{
  "activityId": "activity-mongodb-id",
  "taskId": "celery-task-id",
  "status": "COMPLETED",
  "classification": {
    "track": "Data Structures & Algorithms",
    "topic": "Graph Traversal",
    "subtopics": [
      "Breadth First Search",
      "Graph Representation"
    ],
    "resource_type": "Tutorial",
    "problem_difficulty": null
  }
}
```


# Backend Activity Update

When the callback is received, the Node.js backend updates the Activity.

Before processing:

```text
classificationStatus = PROCESSING
processed = false
```

After successful processing:

```text
classificationStatus = COMPLETED
processed = true
```

The classification is stored inside the Activity:

```json
{
  "classification": {
    "track": "Data Structures & Algorithms",
    "topic": "Graph Traversal",
    "subtopics": [
      "Breadth First Search",
      "Graph Representation"
    ],
    "resource_type": "Tutorial",
    "problem_difficulty": null
  }
}
```

The Celery task ID is also stored in `classificationTaskId` for tracing and debugging.


# Dashboard Integration

After classification completes, the backend uses the AI classification to organize Activities.

Example:

```text
Data Structures & Algorithms
        |
        └── Graph Traversal
                |
                ├── Breadth First Search Activity
                └── Depth First Search Activity
```

The AI classification therefore becomes the source for automatically creating and updating Dashboard Tracks and Topics.


# Redis

Redis is used for:

- Classification caching
- Celery broker
- Celery result backend

Inside Docker, Redis is available at:

```text
redis://redis:6379/0
```

The hostname is `redis` because Redis runs as a Docker Compose service.

Do not use `localhost` between Docker containers.


# Celery

Celery handles AI processing outside the FastAPI request lifecycle.

Current task:

```text
src.tasks.processing_task.process_learning_task
```

Processing flow:

```text
FastAPI
   |
   v
Redis
   |
   v
Celery Worker
   |
   v
LangGraph
   |
   v
Groq
   |
   v
Classification
```

This prevents the FastAPI request from waiting for the complete AI operation.


# Error Handling and Retries

The processing task contains error handling for failed AI processing.

Temporary failures can be retried automatically by Celery.

The Activity itself remains stored in MongoDB even when AI processing fails.

Possible Activity states are:

```text
NOT_STARTED
PROCESSING
COMPLETED
FAILED
```


# Docker

The service uses Docker Compose.

Current services:

```text
ai-processing-service
celery-worker
redis
```

`ai-processing-service` runs FastAPI.

`celery-worker` executes background AI tasks.

`redis` provides caching and Celery messaging.


# Local Setup

## Prerequisites

Install:

- Git
- Docker Desktop

For development outside Docker:

- Python 3.11+
- uv


# Environment Variables

Create:

```text
processing-ai-service/.env
```

Use `.env.example` as the template.

Example:

```env
APP_NAME=Processing AI Service
APP_VERSION=1.0.0

DEBUG=true

GROQ_API_KEY=your_groq_api_key

MODEL_NAME=llama-3.3-70b-versatile

TEMPERATURE=0.0

CHUNK_SIZE=1200
CHUNK_OVERLAP=200

REDIS_URL=redis://redis:6379/0
```

Never commit the real `.env` file.


# Install Dependencies

Using uv:

```bash
uv sync
```


# Run With Docker

Make sure Docker Desktop is running.

Move into the service:

```bash
cd processing-ai-service
```

For the first run or after dependency changes:

```bash
docker compose up --build
```

For normal startup:

```bash
docker compose up
```

Expected services:

```text
redis-server
ai-processing-service
celery-worker
```


# Run in Background

```bash
docker compose up -d
```


# Check Containers

```bash
docker compose ps
```


# View Logs

All services:

```bash
docker compose logs -f
```

Celery only:

```bash
docker compose logs -f celery-worker
```

FastAPI only:

```bash
docker compose logs -f ai-processing-service
```

Redis only:

```bash
docker compose logs -f redis
```


# Stop Services

```bash
docker compose down
```


# Rebuild Services

After dependency or Docker configuration changes:

```bash
docker compose up --build
```


# Run Without Docker

Install dependencies:

```bash
uv sync
```

Start FastAPI:

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Redis must also be running.

A Celery worker must also be started separately.

Docker Compose is recommended because it starts the required infrastructure together.


# Test Redis

Open Redis CLI:

```bash
docker exec -it redis-server redis-cli
```

Test the connection:

```text
PING
```

Expected:

```text
PONG
```

Check stored keys:

```text
KEYS *
```

Exit Redis:

```text
exit
```


# Test Classification

After starting Docker Compose, open:

```text
http://localhost:8000/docs
```

Use:

```text
POST /api/process/
```

Submit a new learning URL.

The response should initially contain:

```json
{
  "success": true,
  "cached": false,
  "status": "PROCESSING",
  "task_id": "celery-task-id"
}
```

Copy the `task_id`.

Then call:

```text
GET /api/process/{task_id}
```

After processing completes, the response should contain:

```text
status = COMPLETED
```

along with the classification.


# Example cURL Request

```bash
curl -X POST "http://localhost:8000/api/process/" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/",
    "title": "Breadth First Search",
    "content": "Breadth First Search is a graph traversal algorithm.",
    "platform": "GeeksForGeeks",
    "metadata": {}
  }'
```


# Relevant Files

```text
main.py

Dockerfile
docker-compose.yml
pyproject.toml
uv.lock

src/celery_app.py

src/api/classification.py
src/api/routes.py

src/config/redis.py
src/config/settings.py

src/graphs/learning_graph.py

src/tasks/processing_task.py
src/tasks/test_task.py

src/services/cache_service.py
src/services/classification_service.py
src/services/llm_service.py
src/services/url_fetch_service.py

src/nodes/fetch_node.py
src/nodes/processing_node.py
src/nodes/classification_node.py
src/nodes/router_node.py

src/processors/chunker.py
src/processors/cleaner.py
src/processors/metadata.py
src/processors/normalizer.py
src/processors/recovery.py
src/processors/validator.py

src/agents/classification/agent.py
src/agents/processing/agent.py
```


# Current Integration

The current working flow is:

```text
Browser Extension
        |
        v
Node.js Backend
        |
        v
MongoDB Activity
        |
        v
Processing AI Service
        |
        v
Redis + Celery
        |
        v
LangGraph
        |
        v
Groq
        |
        v
Classification
        |
        v
Node Callback
        |
        v
MongoDB Activity Update
        |
        v
Dashboard Track / Topic
```


# Summary and Quiz

Summary and Quiz use separate AI integration work.

The Node.js backend already contains the foundation for:

```text
LearningArtifact
Summary
Quiz
Quiz Attempts
```

The Summary and Quiz AI services will later connect to these backend modules.

They do not need to be merged into this Processing AI Service for the current architecture.


# Current Limitations

Classification caching currently uses the learning URL.

Therefore, repeated processing of the same cached URL may reuse the existing classification.

Classification depends on the quality of the content available from the learning resource.

Some websites may restrict automated content fetching.

Summary and Quiz AI integration is separate and is not yet part of this Processing AI Service.


# Security

Never commit:

```text
.env
Groq API keys
MongoDB credentials
JWT secrets
OAuth client secrets
```

Only `.env.example` should be committed.

If a credential is accidentally committed or exposed, rotate it immediately.