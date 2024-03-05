# TPC2: Mapa virtual num servidor de ficheiros

## 2024-03-05

## Autor:

- a100643
- Rui Lopes Martins

## Resumo

Neste trabalho, utilizou-se o JSON [mapa-virtual.json](mapa-virtual.json) fornecido pelo docente com informação sobre cidades e suas ligações, para produzir um website onde se pode consultar e navegar nesta estrutura.

O site apresenta uma página principal com a lista de todas as cidades. Clicando numa cidade, acede-se à página individual da cidade onde se pode consultar a informação sobre ela (população, distrito e descrição) e as cidades vizinhas. As cidades vizinhas são apresentadas numa lista, que mostra o nome da cidade e a distância a ela.

Os HTMLs gerados devem ser colocados num servidor de ficheiros para serem acedidos. Ou seja, o servidor deve disponibilizar a página principal no endpoint `/` e as páginas individuais das cidades no endpoint `/cidade/{id}`.

## Resultados

Geração das páginas HTML:

```bash
$ python3 main.py
```

Correr o servidor de ficheiros:

```bash
$ node server.js
```

Nota: o servidor é iniciado, por omissão, na porta `7777`.
