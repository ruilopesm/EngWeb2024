# TPC4: Website de compositores

## 2024-04-09

## Autor:

- a100643
- Rui Lopes Martins

## Resumo

Neste trabalho, utilizou-se o JSON `compositores.json` fornecido pelo docente com informação sobre compositores, para produzir um website onde se pode consultar e navegar nesta estrutura.

O objetivo passou por criar um serviço web com operações CRUD sobre os compositores.

## Resultados

Instalar as dependências:
```bash
$ npm install
```

Correr o `json-server`:
```bash
$ json-server --watch compositores.json # ou caminho para o ficheiro
```

Correr o servidor `node`:
```bash
$ npm start
```

## Páginas

- `/`, lista das entidades disponíveis no dataset

- `/compositores`, lista de todos os compositores
- `/compositores/1`, detalhes de um compositor
- `/compositores/novo`, formulário para adicionar um compositor
- `/compositores/1/editar`, formulário para editar um compositor
- `/compositores/1/apagar`, ação para apagar um compositor

- `/periodos`, lista de todos os períodos
- `/periodos/1`, detalhes de um período, com a lista de compositores desse período
