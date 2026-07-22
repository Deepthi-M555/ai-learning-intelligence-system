from src.processors.recovery import RecoveryProcessor
from src.processors.cleaner import CleanerProcessor
from src.processors.normalizer import NormalizerProcessor
from src.processors.validator import ValidationProcessor
from src.processors.metadata import MetadataProcessor
from src.processors.chunker import ChunkProcessor

from src.models.processed_context import ProcessedContext


class ProcessingAgent:

    def __init__(self):

        self.recovery = RecoveryProcessor()

        self.cleaner = CleanerProcessor()

        self.normalizer = NormalizerProcessor()

        self.validator = ValidationProcessor()

        self.metadata = MetadataProcessor()

        self.chunker = ChunkProcessor()

    def process(
        self,
        session
    ) -> ProcessedContext:

        recovered = self.recovery.recover(session)

        cleaned = self.cleaner.clean(recovered)

        normalized = self.normalizer.normalize(cleaned)

        validated = self.validator.validate(normalized)

        metadata = self.metadata.generate(
            validated,
            session
        )

        chunks = self.chunker.chunk(validated)

        return ProcessedContext(

            content=validated,

            chunks=chunks,

            metadata=metadata
        )