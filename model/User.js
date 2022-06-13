const mongoose = require('mongoose');

const telefone = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        min: 8,
        max: 10
    },
    ddd: {
        type: String,
        required: true,
        min: 2,
        max: 3
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    }, 
    email: {
        type: String,
        require: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    telefones:{
        type:[telefone],
        default: undefined
    },
    data_cadastro: {
        type: Date,
        default: Date.now
    },
    data_atualizacao: {
        type: Date,
        default: Date.now
    },
    ultimo_login: {
        type: Date,
        default: Date.now
    },
    Token: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);