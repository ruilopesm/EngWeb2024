const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoradaSchema = new Schema({
    cidade: String,
    distrito: String
});

const PartidoPoliticoSchema = new Schema({
    party_abbr: String,
    party_name: String
});

const AtributosSchema = new Schema({
    fumador: Boolean,
    gosta_cinema: Boolean,
    gosta_viajar: Boolean,
    acorda_cedo: Boolean,
    gosta_ler: Boolean,
    gosta_musica: Boolean,
    gosta_comer: Boolean,
    gosta_animais_estimacao: Boolean,
    gosta_dancar: Boolean,
    comida_favorita: String
});

const PessoaSchema = new Schema({
    nome: String,
    idade: Number,
    sexo: String,
    morada: MoradaSchema,
    _id: String,
    profissao: String,
    partido_politico: PartidoPoliticoSchema,
    religiao: String,
    desportos: [String],
    animais: [String],
    figura_publica_pt: [String],
    marca_carro: String,
    destinos_favoritos: [String],
    atributos: AtributosSchema
});


module.exports = mongoose.model('Pessoa', PessoaSchema);
