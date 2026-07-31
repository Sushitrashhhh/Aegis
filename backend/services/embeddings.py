from typing import List
from ai.titan_embeddings import TitanEmbeddings

titan = TitanEmbeddings()

def generate_embeddings_for_text(text: str) -> List[float]:
    return titan.get_embedding(text)
