const Pessoa = require('../models/pessoa');

module.exports.list = () => {
    return Pessoa
        .find()
        .exec();
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id: id})
        .exec();
}

module.exports.insert = pessoa => {
    return Pessoa.create(pessoa);
}

module.exports.update = (id, pessoa) => {
    return Pessoa
        .findOneAndUpdate({_id: id}, pessoa, {new: true})
        .exec();
}

module.exports.remove = id => {
    return Pessoa
        .deleteOne({_id: id})
        .exec();
}
