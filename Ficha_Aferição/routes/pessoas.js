var express = require('express');
var router = express.Router();

var Pessoa = require('../controllers/pessoa');

router.get('/', function(req, res) {
  Pessoa.list()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/:id', function(req, res) {
  Pessoa.findById(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', function(req, res) {
  Pessoa.insert(req.body)
    .then(dados => res.status(201).jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.put('/:id', function(req, res) {
  Pessoa.update(req.params.id, req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/:id', function(req, res) {
  Pessoa.remove(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

module.exports = router;
