import json
from dataclasses import dataclass
from typing import Any as Object
from typing import Dict, List

@dataclass
class Movie:
    id: str
    title: str
    year: int
    cast: List[str]
    genres: List[str]

@dataclass
class Actor:
    id: str
    name: str
    present_in: List[str]

@dataclass
class Genre:
    id: str
    name: str
    movies: List[str]

def prepare_dataset() -> None:
    movies: List[Movie] = []
    
    actors: Dict[str, Actor] = {}
    current_actor_id: int = 0

    genres: Dict[str, Genre] = {}
    current_genre_id: int = 0
    
    with open("material/filmes.json", "r", encoding="utf-8") as file:
        for line in file.readlines():
            data: Object = json.loads(line)

            movie_id = data["_id"]["$oid"]
            movie_actors: List[str] = []
            movie_genres: List[str] = []

            for actor in data["cast"]:
                if actor not in actors:
                    actors[actor] = Actor(str(current_actor_id), actor, [movie_id])
                    current_actor_id += 1
                else:
                    actors[actor].present_in.append(movie_id)
                
                movie_actors.append(actors[actor].id)

            for genre in data.get("genres", []): # Can be None
                if genre not in genres:
                    genres[genre] = Genre(str(current_genre_id), genre, [movie_id])
                    current_genre_id += 1
                else:
                    genres[genre].movies.append(movie_id)
                
                movie_genres.append(genres[genre].id)

            movie = Movie(
                movie_id,
                data["title"],
                data["year"],
                movie_actors,
                movie_genres
            )
            movies.append(movie)

    with open("final.json", "w", encoding="utf-8") as file:
        json.dump({
            "movies": [movie.__dict__ for movie in movies],
            "actors": [actor.__dict__ for actor in actors.values()],
            "genres": [genre.__dict__ for genre in genres.values()]
        }, file, indent=4)

def main() -> None:
    prepare_dataset()

if __name__ == "__main__":
    main()
