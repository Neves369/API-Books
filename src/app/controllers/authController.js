const express = require('express');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

function gerarToken(params = {}){
    return jwt.sign( params, process.env.SECRET, {
        expiresIn: 86400,
    });
}

router.post('/register', async(req, res) => {
    try {
        const { email } = req.body;
       
        if(await User.findOne({email})){
            return res.status(400).send({Erro: "Usuário já existe!"})
        }
        else{
            const user = await User.create(req.body);
            user.senha = undefined;

            return res.send({user, token: gerarToken({id: user.id})});
        }
    } catch (error) {
      console.log(error)  
    }
    
        

})

router.post('/authenticate', async(req, res) => {
    const {email, senha} = req.body;

    const user = await User.findOne({ email }).select('+senha');

    if (!user){
        return res.status(400).send({Erro: 'Cheque os campos!'});
    }
    if (!await bcrypt.compare(senha, user.senha)){
        return res.status(400).send({Erro: 'Senha incorreta!'});
    }
    else{
        user.senha = undefined;
       return res.send({token: gerarToken({id: user.id})});
    }

   

})


module.exports = app => app.use('/auth', router);