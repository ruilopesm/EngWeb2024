const Pessoa = require('../models/pessoa')

module.exports.distinct = () => {
    return Pessoa
        .distinct('desportos')
        .sort()
        .exec()
}

module.exports.getAthletes = (modalidade) => {
    return Pessoa
        .find({desportos: modalidade})
        .sort({nome: 1})
        .exec()
}
