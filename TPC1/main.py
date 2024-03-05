import os
import re
import xml.etree.ElementTree as ET
from enum import Enum
from typing import Dict, Final, List, Optional, Tuple, Union
from xmlschema import XMLSchema, XMLSchemaValidationError 

XML_SCHEMA: Final[str] = "material/MRB-rua.xsd"
XML_DIRECTORY: Final[str] = "material/texto"

MAIN_HTML_TEMPLATE: Final[str] = "html/templates/main.html"
STREET_HTML_TEMPLATE: Final[str] = "html/templates/street-page.html"
STREET_CARD_HTML_TEMPLATE: Final[str] = "html/templates/street-card.html"

class TEMPLATE(Enum):
    """Enum to represent the HTML templates."""
    MAIN = MAIN_HTML_TEMPLATE,
    STREET = STREET_HTML_TEMPLATE,
    STREET_CARD = STREET_CARD_HTML_TEMPLATE

def is_valid_xml(file: str, schema: XMLSchema) -> Union[bool, str]:
    """
    Check if the XML file is valid according to the schema.
    Returns True if the file is valid, otherwise returns the error message.
    """
    try:
        schema.validate(XML_DIRECTORY + "/" + file)
    except XMLSchemaValidationError as e:
        return e
    
    return True

def read_xml(file: str) -> Optional[ET.Element]:
    """
    Read the XML file and return its content if it's valid according to the schema.
    If the file is not valid, print an error message and return None.
    """
    schema = XMLSchema(XML_SCHEMA)
    result: Union[bool, str] = is_valid_xml(file, schema)
    if result == True:
        tree: ET.ElementTree = ET.parse(XML_DIRECTORY + "/" + file)
        return tree.getroot()
    else:
        print(f"{file} is not valid according to the schema. Error: {result}")

def generate_html(variables: Dict[str, str], template: TEMPLATE) -> str:
    """Generate the HTML file using the variables."""
    with open(template, "r") as file:
        content: str = file.read()
        for key, value in variables.items():
            content = content.replace("{" + key + "}", value)
    
    return content

def write_html(filename: str, content: str) -> None:
    """Write the content into a new HTML file."""
    with open("html/generated/" + filename.replace(".xml", ".html"), "w") as file:
        file.write(content)

def fix_path(path: str, prefix: str) -> str:
    """Fix a given path by adding a prefix and replacing JPG with jpg; PNG with png."""
    return prefix + path[3:].replace("JPG", "jpg").replace("PNG", "png")

def build_figure(content: ET.Element) -> str:
    return f"""
        <img src="{fix_path(content[0].attrib["path"], "../../material/")}" alt="{content[1].text}" />
    """

def build_paragraph(content: ET.Element) -> str:
    result: str = f"""
        <p>{ET.tostring(content, encoding="unicode", method="xml")}</p>
    """
    
    result = result.replace("<desc>", "").replace("</desc>", "")
    result = result.replace("<para>", "").replace("</para>", "")
    result = result.replace("<data>", "<i>").replace("</data>", "</i>")
    result = result.replace("<lugar>", "<b>").replace("</lugar>", "</b>")
    result = re.sub(r"<entidade tipo=\"(.*?)\">(.*?)</entidade>", r"\2", result)

    return result

def build_houses_list(content: ET.Element) -> str:
    def build_house(
        number: ET.Element,
        enfiteuta: ET.Element,
        foro: ET.Element, 
        description: ET.Element,
        vista: ET.Element
    ) -> str:
        result: str = "<ul>"
        result += f"<li>Número: {number.text}</li>"
        if enfiteuta is not None and enfiteuta.text:
            result += f"<li>Enfiteuta: {enfiteuta.text}</li>"
        if foro is not None and foro.text:
            result += f"<li>Foro: {foro.text}</li>"
        if description is not None and description.text:
            result += f"<li>{build_paragraph(description)}</li>"
        if vista is not None and vista.text:
            result += f"<li>Vista: {vista.text}</li>"
        result += "</ul>"
        return result

    result: str = ""
    for child in content:
        result += build_house(*[child.find(tag) for tag in ["número", "enfiteuta", "foro", "desc", "vista"]])
    
    return result

def build_street_page_variables(content: ET.Element) -> Dict[str, str]:
    """Build a variables dictionary in order to generate the HTML file for a street."""
    variables: Dict[str, str] = {
        "identifier": content[0][0].text,
        "name": content[0][1].text,
    }
    
    paragraphs: str = ""
    images: str = ""
    houses: str = ""

    for child in content[1]:
        match child.tag:
            case "figura":
                images += build_figure(child)
            case "para":
                paragraphs += build_paragraph(child)
            case "lista-casas":
                houses += build_houses_list(child)
            case "nome":
                f"<h2>{child.text}</h2>"
            case _:
                print(f"Unknown main tag: {child.tag}")

    variables["paragraphs"] = paragraphs
    variables["images"] = images
    variables["houses"] = houses
    
    return variables

def generate_each_street_html() -> None:
    """Generate the HTML file for each street, based on a given template."""
    for file in os.listdir(XML_DIRECTORY):
        if file.endswith(".xml"):
            content: Optional[ET.Element] = read_xml(file)
            if content:
                variables: Dict[str, str] = build_street_page_variables(content)
                print(f"Generating {file.replace('.xml', '.html')}...")
                html: str = generate_html(variables, STREET_HTML_TEMPLATE)
                write_html(file, html)

def build_street_card_variables(content: ET.Element) -> Dict[str, str]:
    """Build a variables dictionary in order to generate the HTML file for a street card."""
    name: str = content[0].find("nome").text
    image: str = content[1].find("figura")[0].attrib["path"]

    return {
        "image": fix_path(image, "../../material/"),
        "alt": name,
        "name": name,
    }

def generate_main_html() -> None:
    """Generate the main HTML file using a given template and the list of streets."""
    streets: List[Tuple[str, ET.Element]] = []
    for file in os.listdir(XML_DIRECTORY):
        if file.endswith(".xml"):
            content: Optional[ET.Element] = read_xml(file)
            if content:
                streets.append((file, content))

    # Sort streets by name
    streets.sort(key=lambda x: x[1][0][1].text.strip().lower())

    html: str = ""
    for file, content in streets: 
        variables: Dict[str, str] = build_street_card_variables(content)
        variables.update({"url": file.replace(".xml", ".html")})
        print(f"Adding card for {file.replace('.xml', '.html')}...")
        html += generate_html(variables, STREET_CARD_HTML_TEMPLATE)

    write_html("index.html", generate_html({"streets": html}, MAIN_HTML_TEMPLATE))

def main() -> None:
    generate_each_street_html()
    generate_main_html()

if __name__ == "__main__":
    main()
