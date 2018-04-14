var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var ReceitaSchema = new Schema({
    nome: String,
    imageUrl: String,
    preparacao: [],
    dificuldade: String,
    dose: String,
    ingredientes: [
        {
            unidade: String,
            quantidade: String,
            desc: String,
        }
    ],
    descricao: String,
    restricoes: [],
    tempoPreparacao: String
}, { collection: 'pingo_doce' });

ReceitaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Receita', ReceitaSchema);