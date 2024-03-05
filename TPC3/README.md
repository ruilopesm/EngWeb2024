# TPC3: Website de filmes

## 2024-03-05

## Autor:

- a100643
- Rui Lopes Martins

## Resumo

Neste trabalho, utilizou-se o JSON [filmes.json](filmes.json) fornecido pelo docente com informação sobre filmes, para produzir um website onde se pode consultar e navegar nesta estrutura.

O objetivo foi criar um serviço web que disponibiliza a informação sobre os filmes. Os filmes são servidos por um `json-server` ao servidor `node`.

## Resultados

Preparar o dataset para o `json-server`:

```bash
$ python3 main.py
```

Instalar as dependências:
```bash
$ npm install
```

Correr o `json-server`:
```bash
$ json-server --watch final.json
```

Correr o servidor `node`:
```bash
$ npm start
```

## Páginas

- `/`, lista das entidades disponíveis no dataset

- `/filmes`, lista de todos os filmes
- `/filmes/1`, detalhes de um filme

- `/atores`, lista de todos os atores
- `/atores/1`, detalhes de um ator

- `/generos`, lista de todos os géneros
- `/generos/1`, detalhes de um género
