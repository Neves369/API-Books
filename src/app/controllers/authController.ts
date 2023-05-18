import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Router } from 'express-serve-static-core';

const router = express.Router();

function gerarToken(params = {}){
    const secret = process.env.SECRET || 'default_secret_key';
    return jwt.sign( params, secret);
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
        return res.status(400).send({Erro: 'Não foi possível criar novo usuário!'});
    }
    
        

})

router.get('/authenticate', async(req, res) => {
    const {email, senha} = req.headers;
    
    const user = await User.findOne({ email }).select('+senha');

    if (!user){
        return res.status(400).send({Erro: 'Email e/ou senha incorreto(s)'});
    }
    if(senha && user.senha){
        if (!await bcrypt.compare(String(senha), user.senha)){
            return res.status(400).send({Erro: 'Senha incorreta!'});
        }
        else{
            user.senha = undefined;
           return res.send({id: user._id, nome: user.nome, email: user.email, favoritos: user.favoritos, token: gerarToken({id: user.id})});
        }
    }
    
})


export default (app: { use: (arg0: string, arg1: Router) => any; }) => app.use('/auth', router);