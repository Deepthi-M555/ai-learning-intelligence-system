# AI Service Layer

This service layer accepts learning-session and quiz-generation requests, checks Redis for cached results, queues background work with Celery, and sends completed summaries and quizzes back to the Node backend.

# to start
uv run uvicorn main:app --reload --port 5000 --log-level debug (in a different terminal)
uv run celery -A src.queueData.tasks:app worker -P solo --loglevel=INFO (in a different terminal)
install docker desktop if not installed
in the  git bash run
docker run -d --name my-redis -p 6379:6379 redis:latest
run the docker container before sending the request





## What This Service Does

- Exposes FastAPI endpoints under `/api`.
- Uses Redis-backed cache checks before doing expensive summarization or quiz generation.
- Queues background jobs with Celery.
- Fetches webpage content from the submitted URL for summaries.
- Enriches the fetched webpage content with session `content` when available.
- Chunks large combined inputs before sending them to the summarizer model.
- Sends final summary data to `NODE_SERVER_URL/api/store-summary`.
- Sends final quiz data to `NODE_SERVER_URL/api/store-quiz`.

## Project Flow

1. The extension or upstream backend sends a learning session to `POST /api/learning-session`.
2. The API hashes the URL and checks Redis for a cached summary.
3. If a cached summary exists, it is sent directly to the Node backend.
4. If no cached summary exists, the request is queued with Celery.
5. The Celery worker always fetches content from the URL.
6. If session `content` is present, it is added as supplemental context.
7. If the combined text is too large, it is chunked and reduced into one final summary.
8. The summary is cached in Redis and posted back to the backend.
9. The backend can later call `POST /api/quiz-generate` with the summary.
10. The quiz flow follows the same cache-first, queue-second pattern.

## API

Base URL during local development:

```text
http://127.0.0.1:5000
```

### Health Check

`GET /`

Response:

```json
{
  "message": "ai-service-layer-running"
}
```

### Create Learning Summary

`POST /api/learning-session`

Purpose:
- Accepts a learning session.
- Checks Redis cache using the URL.
- On cache miss, queues a summary generation task.

Request body:

```json
{
  "sessionId": "session-123",
  "platform": "youtube",
  "url": "https://example.com/lesson",
  "title": "Lesson Title",
  "content": "Optional session transcript, notes, or captured text.",
  "activeStudyTime": 420,
  "startedAt": "2026-07-17T09:00:00.000Z",
  "completedAt": "2026-07-17T09:07:00.000Z",
  "device": "chrome-extension"
}
```

Success response:

```json
{
  "success": true,
  "message": "Request queued successfully",
  "task_id": "celery-task-id",
  "sessionId": "session-123"
}
```

Cache-hit response:

```json
{
  "success": true,
  "message": "Cache hit"
}
```

Summary generation behavior:
- URL content is always fetched and treated as the primary source.
- `content` from the learning session is treated as supplemental context.
- If the combined input is too large, the worker chunks it and reduces partial summaries into one final output.

### Generate Quiz

`POST /api/quiz-generate`

Purpose:
- Accepts a summary and creates quiz questions from it.
- Checks Redis cache using the URL before queueing work.

Request body:

```json
{
  "sessionId": "session-123",
  "url": "https://example.com/lesson",
  "summary": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ]
}
```

Success response:

```json
{
  "success": true,
  "message": "Request queued successfully",
  "task_id": "celery-task-id",
  "sessionId": "session-123"
}
```

Cache-hit response:

```json
{
  "success": true,
  "message": "Cache hit"
}
```

## Callback Contract With Node Backend

The service sends results back to the Node backend defined by `NODE_SERVER_URL`.

### Summary Callback

`POST {NODE_SERVER_URL}/api/store-summary`

Payload shape:

```json
{
  "sessionId": "session-123",
  "platform": "youtube",
  "url": "https://example.com/lesson",
  "title": "Lesson Title",
  "content": [
    "Key point 1",
    "Key point 2"
  ],
  "activeStudyTime": 420,
  "startedAt": "2026-07-17T09:00:00.000Z",
  "completedAt": "2026-07-17T09:07:00.000Z",
  "device": "chrome-extension"
}
```

### Quiz Callback

`POST {NODE_SERVER_URL}/api/store-quiz`

Payload shape:

```json
{
  "sessionId": "session-123",
  "url": "https://example.com/lesson",
  "questions": [
    [
      "Question text",
      ["Option A", "Option B", "Option C", "Option D"],
      1
    ]
  ]
}
```

## Cache Behavior

- Summary cache namespace: `study`
- Quiz cache namespace: `quiz`
- Cache key format:
  - `study:{sha256(url)}`
  - `quiz:{sha256(url)}`
- Current TTL:
  - `3600` seconds for summaries
  - `3600` seconds for quizzes

Important note:
- The cache is URL-based, not `sessionId`-based. Different sessions with the same URL reuse the same cached summary or quiz.

## Local Setup

### Prerequisites

- Python 3.12+
- Docker Desktop
- A valid Groq API key
- A reachable Node backend for callback storage

### Environment Variables

Create a `.env` file in `ai-service-layer/`:

```env
debug_mode=true
NODE_SERVER_URL=http://127.0.0.1:3000
GROK_API_KEY=your_groq_api_key
MODEL_NAME=openai/gpt-oss-120b
```

Notes:
- `MODEL_NAME` exists in config, but the current summarizer code is hardcoded to `llama-3.3-70b-versatile`.
- `NODE_SERVER_URL` must point to the backend that exposes `/api/store-summary` and `/api/store-quiz`.

## Install Dependencies

Using `uv`:

```powershell
uv sync
```

Or with `pip`:

```powershell
pip install -r requirements.txt
```

## Run Redis Locally

Start Redis in Docker Desktop with:

```powershell
docker run -d --name my-redis -p 6379:6379 redis:latest
```

This service expects Redis at:

```text
localhost:6379
```

## Run The Service

Start the FastAPI server:

```powershell
uv run uvicorn main:app --reload --port 5000 --log-level debug
```

The API will run on:

```text
http://127.0.0.1:5000
```

## Run The Celery Worker

Start the background worker in a separate terminal:

```powershell
uv run celery -A src.queueData.tasks:app worker -P solo --loglevel=INFO
```

Recommended local startup order:

1. Start Redis with Docker.
2. Start the FastAPI server.
3. Start the Celery worker.
4. Send requests to `/api/learning-session` or `/api/quiz-generate`.

## Example cURL Requests

### Learning Session

```bash
curl -X POST "http://127.0.0.1:5000/api/learning-session" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "platform": "youtube",
    "url": "https://example.com/lesson",
    "title": "Lesson Title",
    "content": "Transcript or notes captured by the client.",
    "activeStudyTime": 420,
    "startedAt": "2026-07-17T09:00:00.000Z",
    "completedAt": "2026-07-17T09:07:00.000Z",
    "device": "chrome-extension"
  }'
```

### Quiz Generate

```bash
curl -X POST "http://127.0.0.1:5000/api/quiz-generate" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "url": "https://example.com/lesson",
    "summary": [
      "Key point 1",
      "Key point 2",
      "Key point 3"
    ]
  }'
```

## Relevant Files

- [main.py](/abs/path/C:/Users/User/AI-Learning%20Copilot/ai-learning-intelligence-system/ai-service-layer/main.py)
- [src/queueData/tasks.py](/abs/path/C:/Users/User/AI-Learning%20Copilot/ai-learning-intelligence-system/ai-service-layer/src/queueData/tasks.py)
- [src/queueData/cache.py](/abs/path/C:/Users/User/AI-Learning%20Copilot/ai-learning-intelligence-system/ai-service-layer/src/queueData/cache.py)
- [src/workerSummarizer/agent.py](/abs/path/C:/Users/User/AI-Learning%20Copilot/ai-learning-intelligence-system/ai-service-layer/src/workerSummarizer/agent.py)
- [src/backendCalls/backendStore.py](/abs/path/C:/Users/User/AI-Learning%20Copilot/ai-learning-intelligence-system/ai-service-layer/src/backendCalls/backendStore.py)

## Current Limitations

- The summary cache is keyed only by URL, so enriched session `content` does not change the cache key.
- The summarizer fetches live webpage content, so pages with aggressive bot protection or dynamic client-side rendering may produce weak results.
- The configured `MODEL_NAME` environment variable is not currently used by the summarizer implementation.
