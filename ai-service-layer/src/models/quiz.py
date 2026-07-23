from typing import List, Optional
from pydantic import BaseModel


class Classification(BaseModel):
    track: str
    topic: str
    subtopics: List[str]


class Summary(BaseModel):
    keyPoints: List[str]
    subtopic: Optional[str] = None


class Question(BaseModel):
    question: str
    options: List[str]
    correctAnswer: str
    explanation: str


class QuizOutput(BaseModel):
    questions: List[Question]


class Quiz(BaseModel):
    activityId: str
    url: str
    title: str
    content: str
    classification: Classification
    summary: Summary
    callbackUrl: str

    # Initially None. Populate this after generating the quiz.
    quiz: Optional[QuizOutput] = None