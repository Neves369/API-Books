const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    senha: {
        type: String,
        require: true,
        select: false
        
    },

    createdAt:{
        type: Date,
        default: Date.now,
    }

});

UserSchema.pre("save", async function(next){
    hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;