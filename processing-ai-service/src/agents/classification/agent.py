from src.services.classification_service import (
    ClassificationService
)


class ClassificationAgent:
    """
    Coordinates the classification
    workflow for processed learning
    content.
    """

    def __init__(self):

        self.service = (
            ClassificationService()
        )

    def run(self, processed_context):

        return self.service.classify(
            processed_context
        )