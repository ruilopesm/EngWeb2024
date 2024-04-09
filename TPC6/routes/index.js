var express = require("express");
var router = express.Router();

const compositorController = require("../controllers/compositor");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Compositores" });
});

router.get("/compositores", function (req, res, next) {
  compositorController
    .list()
    .then((compositores) => {
      res.render("compositores", {
        title: "Lista de compositores",
        compositores: compositores,
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
  compositorController
    .insert(req.body)
    .then(() => {
      res.redirect("/compositores/" + req.body._id);
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao criar o compositor",
      });
    });
});

router.get("/compositores/apagar/:id", function (req, res, next) {
  compositorController
    .removeById(req.params.id)
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
  compositorController
    .findById(req.params.id)
    .then((compositor) => {
      res.render("compositor-form", {
        compositor: compositor,
        title: "Editar compositor",
        id_changeable: false,
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
  compositorController
    .update(req.params.id, req.body)
    .then(() => {
      res.redirect("/compositores/" + req.params.id);
    })
    .catch((erro) => {
      res.render("error", {
        error: erro,
        message: "Erro ao editar o compositor",
      });
    });
});

router.get("/compositores/:id", function (req, res, next) {
  compositorController
    .findById(req.params.id)
    .then((compositor) => {
      res.render("compositor", {
        title: "Compositor",
        compositor: compositor,
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
  const periodosDict = {};
  compositores.forEach((compositor) => {
    if (!periodosDict[compositor.periodo]) {
      periodosDict[compositor.periodo] = [];
    }
    periodosDict[compositor.periodo].push(compositor);
  });
  return periodosDict;
}

router.get("/periodos", function (req, res, next) {
  compositorController
    .list()
    .then((compositoresResponse) => {
      const periodosDict = getPeriodos(compositoresResponse);

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
  compositorController
    .findByPeriodo(periodo)
    .then((compositoresResponse) => {
      const periodosDict = getPeriodos(compositoresResponse);

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
