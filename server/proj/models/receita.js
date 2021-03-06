var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var ReceitaSchema = new Schema({
    _id:String,
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
}, { collection: 'pingo_doce_correto' });

ReceitaSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Receita', ReceitaSchema);