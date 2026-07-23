from .chain import quiz_chain
from ..models import Quiz, QuizOutput


def generate_quiz(quiz: Quiz) -> Quiz:
    """
    Generate a quiz from the supplied summary.
    """
    print("Entered generate_quiz")
    print(quiz.model_dump())
    print("activityId:", quiz.activityId)
    print("url:", quiz.url)
    print("summary:", quiz.summary)
    print("keyPoints:", quiz.summary.keyPoints)
    print("type:", type(quiz.summary.keyPoints))


    quiz_output: QuizOutput = quiz_chain.invoke(
        {
            "summary": quiz.summary.keyPoints
        }
    )
    quiz.quiz = quiz_output

    return quiz