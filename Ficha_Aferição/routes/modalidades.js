var express = require('express');
var router = express.Router();

var Modalidade = require('../controllers/modalidade');

router.get('/', function(req, res) {
    Modalidade.distinct()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:modalidade', function(req, res) {
    Modalidade.getAthletes(req.params.modalidade)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
