var express = require("express");
var router = express.Router();

const axios = require("axios");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Compositores" });
});

router.get("/compositores", function (req, res, next) {
  axios
    .get("http://localhost:3000/compositores")
    .then((compositores) => {
      res.render("compositores", {
        title: "Lista de compositores",
        compositores: compositores.data,
      });
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao obter a lista de compositores",
      });
    });
});

router.get("/compositores/novo", function (req, res, next) {
  res.render("compositor-form", { compositor: {}, title: "Novo compositor" });
});

router.post("/compositores/novo", function (req, res, next) {
  axios
    .post("http://localhost:3000/compositores", req.body)
    .then((compositor) => {
      res.redirect("/compositores/" + compositor.data.id);
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao criar o compositor",
      });
    });
});

router.get("/compositores/apagar/:id", function (req, res, next) {
  axios
    .delete(`http://localhost:3000/compositores/${req.params.id}`)
    .then(() => {
      res.redirect("/compositores");
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao apagar o compositor",
      });
    });
});

router.get("/compositores/editar/:id", function (req, res, next) {
  axios
    .get(`http://localhost:3000/compositores/${req.params.id}`)
    .then((compositor) => {
      res.render("compositor-form", {
        compositor: compositor.data,
        title: "Editar compositor",
      });
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao obter o compositor",
      });
    });
});

router.post("/compositores/editar/:id", function (req, res, next) {
  axios
    .put(`http://localhost:3000/compositores/${req.params.id}`, req.body)
    .then((compositor) => {
      res.redirect("/compositores/" + compositor.data.id);
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao editar o compositor",
      });
    });
});

router.get("/compositores/:id", function (req, res, next) {
  axios
    .get(`http://localhost:3000/compositores/${req.params.id}`)
    .then((compositor) => {
      res.render("compositor", {
        title: "Compositor",
        compositor: compositor.data,
      });
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao obter o compositor",
      });
    });
});

function getPeriodos(compositores) {
  const periodos = {};

  compositores.forEach((compositor) => {
    if (!periodos[compositor.periodo]) {
      periodos[compositor.periodo] = [];
    }

    periodos[compositor.periodo].push(compositor);
  });

  return periodos;
}

router.get("/periodos", function (req, res, next) {
  axios
    .get("http://localhost:3000/compositores")
    .then((compositoresResponse) => {
      const periodosDict = getPeriodos(compositoresResponse.data);

      res.render("periodos", {
        title: "Lista de periodos",
        periodos: periodosDict,
      });
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao obter a lista de periodos",
      });
    });
});

router.get("/periodos/:periodo", function (req, res, next) {
  const periodo = req.params.periodo;
  axios
    .get("http://localhost:3000/compositores?periodo=" + periodo)
    .then((compositoresResponse) => {
      const periodosDict = getPeriodos(compositoresResponse.data);

      res.render("periodos", {
        title: "Lista de periodos",
        periodos: periodosDict,
      });
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao obter a lista de compositores",
      });
    });
});

module.exports = router;
