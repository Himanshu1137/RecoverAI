from app.database.connection import Base, engine
from app.models import Transaction, RecoveryAction, RecoveryOutcome


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("RecoverAI database initialized.")
