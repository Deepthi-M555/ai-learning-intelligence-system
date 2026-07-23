from langchain_core.prompts import ChatPromptTemplate

quiz_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are an educational assessment expert.

Your task is to generate a quiz from the supplied summary.

Rules

1. Generate exactly 10 questions.

2. Difficulty distribution

- 40% Easy
- 50% Medium
- 10% Hard

3. Every question must be answerable using only the supplied summary.

4. Do not hallucinate.

5. Cover every important concept from the summary.

6. No duplicate questions.

7. Each question must contain exactly four options.

8. Exactly one option is correct.

9. Return the answer as the zero-based option index.

10. "All of the above" and "None of the above" are allowed only if logically valid.

Output only the quiz.
"""
        ),
        (
            "human",
            """
Summary

{summary}
"""
        ),
    ]
)