const http = require("http");
const axios = require("axios");

const { parse } = require("querystring");

function render404(res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.write("Error 404: Resource not found.");
  res.end();
}

function renderMain(res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(
    `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>Compositores</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
        <div class="w3-container w3-orange">
            <h2><a href="/" style="text-decoration: none">Compositores</a></h2>
        </div>
        <div class="w3-container">
            <p>
                <a href="/compositores">Compositores</a>
            </p>
            <p>
                <a href="/periodos">Períodos</a>
            </p>
        </div>
        </body>
        </html>
    `
  );
}

function renderComposers(res) {
  axios
    .get("http://localhost:3000/compositores")
    .then((response) => {
      const compositores = response.data;
      const compositoresHTML = compositores.map(
        (compositor) =>
          `
            <li>
              <a href="/compositores/${compositor.id}">${compositor.nome}</a>
            </li>
            `
      );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<!DOCTYPE html>
            <html lang="pt">
            <head>
                <meta charset="UTF-8">
                <title>Compositores</title>
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            </head>
            <body>
            <div class="w3-container w3-orange">
                <h2><a href="/" style="text-decoration: none">Compositores</a></h2>
            </div>
            <div class="w3-container">
              <button onclick="window.location.href='/compositores/novo'">Novo Compositor</button>
              <ul>
                ${compositoresHTML.join("")}
              </ul>
            </div>
            </body>
            </html>
        `
      );
    })
    .catch((error) => {
      console.error(error);
      render404(res);
    });
}

function renderComposer(res, id) {
  axios
    .get(`http://localhost:3000/compositores/${id}`)
    .then((response) => {
      const composer = response.data;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>${composer.nome}</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
        <div class="w3-container w3-orange">
            <h2><a href="/" style="text-decoration: none">Compositores</a></h2>
        </div>
        <div class="w3-container">
            <h2>${composer.nome}</h2>
            <p>
                <b>Nome:</b> ${composer.nome}
            </p>
            <p>
                <b>Período:</b> <a href="/periodos/${composer.periodo}">${composer.periodo}</a>
            </p>
            <p>
                <b>Data de Nascimento:</b> ${composer.dataNasc}
            </p>
            <p>
                <b>Data de Óbito:</b> ${composer.dataObito}
            </p>
            <p>
                <b>Biografia:</b> ${composer.bio}
            </p>
        </div>
        <div class="w3-container">
            <a href="/compositores/editar/${composer.id}">Editar</a>
            <a href="/compositores/apagar/${composer.id}">Apagar</a>
        </div>
        </body>
        `
      );
    })
    .catch((error) => {
      console.error(error);
      render404(res);
    });
}

function renderComposerCreate(res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(
    `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>Novo Compositor</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
        <div class="w3-container w3-orange">
            <h2><a href="/" style="text-decoration: none">Compositores</a></h2>
        </div>
        <div class="w3-container">
            <h2>Novo Compositor</h2>
            <form action="/compositores/novo" method="POST">
                <label for="nome">Nome:</label>
                <input type="text" id="nome" name="nome">
                <br>
                <label for="periodo">Período:</label>
                <input type="text" id="periodo" name="periodo">
                <br>
                <label for="dataNasc">Data de Nascimento:</label>
                <input type="text" id="dataNasc" name="dataNasc">
                <br>
                <label for="dataObito">Data de Óbito:</label>
                <input type="text" id="dataObito" name="dataObito">
                <br>
                <label for="bio">Biografia:</label>
                <textarea id="bio" name="bio"></textarea>
                <br>
                <button type="submit">Criar</button>
            </form>
        </div>
        </body>
        </html>
    `
  );
}

function renderComposerEdit(res, id) {
  axios
    .get(`http://localhost:3000/compositores/${id}`)
    .then((response) => {
      const composer = response.data;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>Editar ${composer.nome}</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
        <div class="w3-container w3-orange">
            <h2><a href="/" style="text-decoration: none">Compositores</a></h2>
        </div>
        <div class="w3-container">
            <h2>Editar ${composer.nome}</h2>
            <form action="/compositores/editar/${composer.id}" method="POST">
                <label for="nome">Nome:</label>
                <input type="text" id="nome" name="nome" value="${composer.nome}">
                <br>
                <label for="periodo">Período:</label>
                <input type="text" id="periodo" name="periodo" value="${composer.periodo}">
                <br>
                <label for="dataNasc">Data de Nascimento:</label>
                <input type="text" id="dataNasc" name="dataNasc" value="${composer.dataNasc}">
                <br>
                <label for="dataObito">Data de Óbito:</label>
                <input type="text" id="dataObito" name="dataObito" value="${composer.dataObito}">
                <br>
                <label for="bio">Biografia:</label>
                <textarea id="bio" name="bio">${composer.bio}</textarea>
                <br>
                <button type="submit">Editar</button>
            </form>
        </div>
        </body>
        </html>
    `
      );
    })
    .catch((error) => {
      console.error(error);
      render404(res);
    });
}

function renderPeriods(res) {
  axios.get("http://localhost:3000/compositores").then((response) => {
    const periods = response.data
      .map((composer) => composer.periodo)
      .filter((value, index, self) => self.indexOf(value) === index);

    const periodsHTML = periods.map(
      (period) =>
        `
            <li>
                <a href="/periodos/${period}">${period}</a>
            </li>
            `
    );

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>Períodos</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
        <div class="w3-container w3-orange">
            <h2><a href="/" style="text-decoration: none">Períodos</a></h2>
        </div>
        <div class="w3-container">
            <ul>
                ${periodsHTML.join("")}
            </ul>
        </div>
        </body>
        </html>
    `
    );
  });
}

function renderPeriod(res, id) {
  axios.get("http://localhost:3000/compositores").then((response) => {
    const composers = response.data.filter(
      (composer) => composer.periodo === id
    );

    const composersHTML = composers.map(
      (composer) =>
        `
            <li>
                <a href="/compositores/${composer.id}">${composer.nome}</a>
            </li>
            `
    );

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>${id}</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
        <div class="w3-container w3-orange">
            <h2><a href="/" style="text-decoration: none">Períodos</a></h2>
        </div>
        <div class="w3-container">
            <h2>${id}</h2>
            <ul>
                ${composersHTML.join("")}
            </ul>
        </div>
        </body>
        </html>
    `
    );
  });
}

http
  .createServer((req, res) => {
    let url = req.url;

    if (url == "/") {
      renderMain(res);
      return;
    }

    if (url == "/compositores") {
      renderComposers(res);
      return;
    }

    if (url.startsWith("/compositores/novo")) {
      if (req.method == "GET") {
        renderComposerCreate(res);
        return;
      }

      if (req.method == "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          const data = parse(body);

          axios
            .post("http://localhost:3000/compositores", data)
            .then((_response) => {
              res.writeHead(302, { Location: "/compositores" });
              res.end();
            })
            .catch((_error) => {
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("Error creating composer");
            });
        });
        return;
      }
    }

    if (url.startsWith("/compositores/editar/")) {
      if (req.method == "GET") {
        const id = url.split("/")[3];
        renderComposerEdit(res, id);
        return;
      }

      if (req.method == "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          const data = parse(body);
          const id = req.url.split("/")[3];

          axios
            .put("http://localhost:3000/compositores/" + id, data)
            .then((_response) => {
              res.writeHead(302, { Location: "/compositores/" + id });
              res.end();
            })
            .catch((_error) => {
              res.writeHead(500, { "Content-Type": "text/html" });
              res.end("Error updating composer");
            });
        });
        return;
      }
    }

    if (url.startsWith("/compositores/apagar/")) {
      const id = url.split("/")[3];

      axios
        .delete("http://localhost:3000/compositores/" + id)
        .then((_response) => {
          res.writeHead(302, { Location: "/compositores" });
          res.end();
        })
        .catch((_error) => {
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("Error deleting composer");
        });
      return;
    }

    if (url.startsWith("/compositores/")) {
      const id = url.split("/")[2];
      renderComposer(res, id);
      return;
    }

    if (url == "/periodos") {
      renderPeriods(res);
      return;
    }

    if (url.startsWith("/periodos/")) {
      const id = url.split("/")[2];
      renderPeriod(res, id);
      return;
    }

    render404(res);
  })
  .listen(7777);

console.log("Server running at http://localhost:7777/");
