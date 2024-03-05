import json
from dataclasses import dataclass
from enum import Enum
from typing import Any as Object
from typing import Dict, Final, List, Optional

MAIN_HTML_TEMPLATE: Final[str] = "html/templates/main.html"
CITY_HTML_TEMPLATE: Final[str] = "html/templates/city-page.html"
CONNECTION_HTML_TEMPLATE: Final[str] = "html/templates/connection-item.html"

class TEMPLATE(Enum):
    """Enum to represent the HTML templates."""
    MAIN = MAIN_HTML_TEMPLATE,
    CITY = CITY_HTML_TEMPLATE,
    CONNECTION = CONNECTION_HTML_TEMPLATE

def generate_html(variables: Dict[str, str], template: TEMPLATE) -> str:
    """Generate the HTML file using the variables."""
    with open(template, "r", encoding="utf-8") as file:
        content: str = file.read()
        for key, value in variables.items():
            content = content.replace("{" + key + "}", value)
    
    return content

def write_html(filename: str, content: str) -> None:
    """Write the content into a new HTML file."""
    with open(f"html/generated/{filename}", "w", encoding="utf-8") as file:
        file.write(content)

@dataclass
class City:
    city_id: str
    name: str
    population: int
    description: str
    district: str

@dataclass
class Connection:
    from_id: str
    to_id: str
    distance: int

CITIES_KEY: Final[str] = "cidades"
CONNECTIONS_KEY: Final[str] = "ligações"

def parse_map_json(data):
    """
    Parse the JSON data into a list of cities and a list of connections.
    
    A city is represented by a class with the following attributes:
    - city_id: str
    - name: str
    - population: int
    - description: str
    - district: str

    A connection is represented by a class with the following attributes:
    - from_id: str, the id of the city where the connection starts
    - to_id: str, the id of the city where the connection ends
    - distance: int
    """
    cities: City = []
    connections: Connection = []

    for city in data[CITIES_KEY]:
        cities.append(City(
            city["id"],
            city["nome"],
            int(city["população"]),
            city["descrição"],
            city["distrito"]
        ))

    for connection in data[CONNECTIONS_KEY]:
        connections.append(Connection(
            connection["origem"],
            connection["destino"],
            int(connection["distância"])
        ))
    
    return cities, connections

def get_city_by_id(cities: List[City], city_id: str) -> Optional[City]:
    """Get a city by its id. Return None if the city is not found."""
    return next((city for city in cities if city.city_id == city_id), None)

def generate_each_city_html(cities: List[City], connections: List[Connection]) -> None:
    """Generate the HTML file for each city, based on a given template."""
    def generate_connection_html(connection: Connection, cities: List[City]) -> str:
        from_name: str = get_city_by_id(cities, connection.from_id).name
        to_name: str = get_city_by_id(cities, connection.to_id).name

        return generate_html({
            "from_name": from_name,
            "from_id": connection.from_id,
            "to_name": to_name,
            "to_id": connection.to_id,
            "distance": str(connection.distance)
        }, CONNECTION_HTML_TEMPLATE)

    for city in cities:
        attrs: Dict[str, str] = {
            "name": city.name,
            "population": str(city.population),
            "description": city.description,
            "district": city.district
        }
        
        connections_html: str = ""
        for connection in connections:
            if connection.from_id == city.city_id:
                connections_html += generate_connection_html(connection, cities)

        attrs["connections"] = connections_html

        write_html(f"{city.city_id}.html", generate_html(attrs, CITY_HTML_TEMPLATE))

def generate_main_html(cities: List[City]) -> None:
    """Generate the main HTML file using a given template and the list of cities."""
    def generate_city_card(id: str, name: str) -> str:
        return f"""
        <div class="flex flex-col py-2">
            <a href="/{id}" class="text-lg font-semibold hover:underline">{name}</a>
        </div>
        """
    
    cities_html: str = ""
    for city in cities:
        cities_html += generate_city_card(city.city_id, city.name)

    write_html("index.html", generate_html({"cities": cities_html}, MAIN_HTML_TEMPLATE))

def main() -> None:
    with open("mapa-virtual.json", "r", encoding="utf-8") as file:
        data: Object = json.loads(file.read())

    cities, connections = parse_map_json(data)

    generate_main_html(cities)
    generate_each_city_html(cities, connections)

if __name__ == "__main__":
    main()
