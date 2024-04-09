const http = require("http");
const axios = require("axios");

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
            <title>Filmes</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
        <div class="w3-container w3-teal">
            <h2><a href="/" style="text-decoration: none">Filmes</a></h2>
        </div>
        <div class="w3-container">
            <p>
                <a href="/filmes">Filmes</a>
            </p>
            <p>
                <a href="/generos">Generos</a>
            </p>
            <p>
                <a href="/atores">Atores</a>
            </p>
        </div>
        </body>
        </html>
    `
  );
}

function renderMovies(res) {
  axios
    .get("http://localhost:3000/movies")
    .then((response) => {
      const movies = response.data;
      const moviesHTML = movies.map(
        (movie) =>
          `
                <li>
                    <a href="/filmes/${movie.id}">${movie.title}</a>
                </li>
                `
      );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<!DOCTYPE html>
                <html lang="pt">
                <head>
                    <meta charset="UTF-8">
                    <title>Filmes</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                </head>
                <body>
                <div class="w3-container w3-teal">
                    <h2><a href="/" style="text-decoration: none">Filmes</a></h2>
                </div>
                <div class="w3-container">
                    <h2>Filmes</h2>
                    <ul>
                        ${moviesHTML.join("")}
                    </ul>
                </div>
                
                </body>
                </html>
            `
      );
    })
    .catch((_error) => {
      render404(res);
    });
}

function renderMovie(res, id) {
  axios
    .get(`http://localhost:3000/movies/${id}`)
    .then((response) => {
      const movie = response.data;

      res.writeHead(200, { "Content-Type": "text/html" });

      const genres = movie.genres.map((genreId) =>
        axios
          .get(`http://localhost:3000/genres/${genreId}`)
          .then(
            (response) =>
              `<li><a href="/generos/${genreId}">${response.data.name}</a></li>`
          )
          .catch((_error) => `<li>Erro</li>`)
      );

      const actors = movie.cast.map((actorId) =>
        axios
          .get(`http://localhost:3000/actors/${actorId}`)
          .then(
            (response) =>
              `<li><a href="/atores/${actorId}">${response.data.name}</a></li>`
          )
          .catch((_error) => `<li>Erro</li>`)
      );

      Promise.all(genres).then((genres) => {
        Promise.all(actors).then((actors) => {
          res.end(
            `<!DOCTYPE html>
                        <html lang="pt">
                        <head>
                            <meta charset="UTF-8">
                            <title>${movie.title}</title>
                            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                        </head>
                        <body>
                        <div class="w3-container w3-teal">
                            <h2><a href="/" style="text-decoration: none">Plataforma de filmes</a></h2>
                        </div>
                        <div class="w3-container">
                            <h2>${movie.title}</h2>
                            <p><b>Ano de lançamento:</b> ${movie.year}</p>
                            <h3>Géneros</h3>
                            <ul>
                                ${genres.join("")}
                            </ul>
                            <h3>Atores</h3>
                            <ul>
                                ${actors.join("")}
                            </ul>
                        </div>
                        </body>   
                        </html> 
                    `
          );
        });
      });
    })
    .catch((_error) => {
      render404(res);
    });
}

function renderGenres(res) {
  axios
    .get("http://localhost:3000/genres")
    .then((response) => {
      const genres = response.data;
      const genresHTML = genres.map(
        (genre) =>
          `
                <li>
                    <a href="/generos/${genre.id}">${genre.name}</a>
                </li>
                `
      );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<!DOCTYPE html>
                <html lang="pt">
                <head>
                    <meta charset="UTF-8">
                    <title>Géneros</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                </head>
                <body>
                <div class="w3-container w3-teal">
                    <h2><a href="/" style="text-decoration: none">Filmes</a></h2>
                </div>
                <div class="w3-container">
                    <h2>Géneros</h2>
                    <ul>
                        ${genresHTML.join("")}
                    </ul>
                </div>
                </body>
                </html>
            `
      );
    })
    .catch((error) => {
      console.log(error);
      render404(res);
    });
}

function renderGenre(res, id) {
  axios
    .get(`http://localhost:3000/genres/${id}`)
    .then((response) => {
      const genre = response.data;
      const movies = genre.movies.map((movieId) =>
        axios
          .get(`http://localhost:3000/movies/${movieId}`)
          .then(
            (response) =>
              `<li><a href="/filmes/${movieId}">${response.data.title}</a></li>`
          )
          .catch((_error) => `<li>Erro</li>`)
      );

      Promise.all(movies).then((movies) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
                    <!DOCTYPE html>
                    <html lang="pt">
                    <head>
                        <meta charset="UTF-8">
                        <title>${genre.name}</title>
                        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                    </head>
                    <body>
                    <div class="w3-container w3-teal">
                        <h2><a href="/" style="text-decoration: none">Plataforma de filmes</a></h2>
                    </div>
                    <div class="w3-container">
                        <h2>${genre.name}</h2>
                        <h3>Filmes de ${genre.name}</h3>
                        <ul>
                            ${movies.join("")}
                        </ul>
                    </div>
                    </body>
                    </html>
                `);
      });
    })
    .catch((error) => {
      console.log(error);
      render404(res);
    });
}

function renderActors(res) {
  axios
    .get("http://localhost:3000/actors")
    .then((response) => {
      const actors = response.data;
      const actorsHTML = actors.map(
        (actor) =>
          `
                <li>
                    <a href="/atores/${actor.id}">${actor.name}</a>
                </li>
                `
      );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
                <!DOCTYPE html>
                <html lang="pt">
                <head>
                    <meta charset="UTF-8">
                    <title>Atores</title>
                    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                </head>
                <body>
                <div class="w3-container w3-teal">
                    <h2><a href="/" style="text-decoration: none">Plataforma de filmes</a></h2>
                </div>
                <div class="w3-container">
                    <h2>Atores</h2>
                    <ul>
                        ${actorsHTML.join("")}
                    </ul>
                </div>
                </body>
                </html>
            `);
    })
    .catch((error) => {
      console.log(error);
      render404(res);
    });
}

function renderActor(res, id) {
  axios
    .get(`http://localhost:3000/actors/${id}`)
    .then((response) => {
      const actor = response.data;
      const movies = actor.present_in.map((movieId) =>
        axios
          .get(`http://localhost:3000/movies/${movieId}`)
          .then(
            (response) =>
              `<li><a href="/filmes/${movieId}">${response.data.title}</a></li>`
          )
          .catch((_error) => `<li>Erro</li>`)
      );

      Promise.all(movies).then((movies) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
                    <!DOCTYPE html>
                    <html lang="pt">
                    <head>
                        <meta charset="UTF-8">
                        <title>${actor.name}</title>
                        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                    </head>
                    <body>
                    <div class="w3-container w3-teal">
                        <h2><a href="/" style="text-decoration: none">Plataforma de filmes</a></h2>
                    </div>
                    <div class="w3-container">
                        <h2>${actor.name}</h2>
                        <h3>Filmes em que ${actor.name} aparece</h3>
                        <ul>
                            ${movies.join("")}
                        </ul>
                    </div>
                    </body>
                    </html>
                `);
      });
    })
    .catch((error) => {
      console.log(error);
      render404(res);
    });
}

const routes = {
  "": renderMain,
  "/filmes": renderMovies,
  "/generos": renderGenres,
  "/atores": renderActors,
};

http
  .createServer((req, res) => {
    let url = req.url.replace(/\/$/, "");
    const id = url.split("/")[2];

    if (routes[url]) {
      routes[url](res);
      return;
    }

    if (url.startsWith("/filmes/") && id) {
      renderMovie(res, id);
      return;
    }

    if (url.startsWith("/generos/") && id) {
      renderGenre(res, id);
      return;
    }

    if (url.startsWith("/atores/") && id) {
      renderActor(res, id);
      return;
    }

    render404(res);
  })
  .listen(7777);

console.log("Server running at http://localhost:7777");
