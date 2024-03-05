const http = require("http");
const fs = require("fs");
const url = require("url");

http
  .createServer(function (req, res) {
    const q = url.parse(req.url, true);

    if (q.pathname === "/") {
      fs.readFile("html/generated/index.html", function (_err, data) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write(data);
        res.end();
      });
    } else if (/\/c\d+/.test(q.pathname)) {
      const file = q.pathname.substring(1);
      fs.readFile("html/generated/" + file + ".html", function (_err, data) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write(data);
        res.end();
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write(`<h1 class="text-red">404 Not Found</h1>`);
      res.end();
    }
  })
  .listen(7777);

console.log("Server running at http://localhost:7777");
