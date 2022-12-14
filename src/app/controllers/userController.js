const fs = require('fs');
const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

// Retorna as informações de todos livros e suas respectivas capas 
router.get('/', async(req, res) =>{
    try {
        const users = await User.find()

        return res.send(users);
        

    } catch (error) {
        console.log(error)
        return res.status(400).send({erro: 'Não foi possível recuperar os usuários'}) 
    }
});

// Retorna as informações de um usuário por id 
router.get('/:userId', async(req, res)=>{
    try {
        const  user= await User.find({"_id" : `${req.params.userId}`});
        user = user.shift();

        return res.send(user);

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possível recuperar usuário'}) 
    }
})


router.put('/:userId', async(req, res)=>{
    try {
        const id = req.params.userId
        const user = req.body
        
        const response = await User.findByIdAndUpdate({"_id" : `${id}`}, user)
        return res.send(user);

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possível atualizar o usuário'}) 
    }
})

// Essa rota por hora não vai ser usada (Futuramente haverá permissões especiais para podermos utilizá-la)
router.delete('/:userId', async(req, res)=>{
   try {
       await User.findByIdAndRemove(req.params.userId);
       return res.send("Usuário deletado com sucesso!")

   } catch (error) {
       return res.status(400).send({erro: 'Não foi possível deletar o usuário'})
    }
   
})

module.exports = app => app.use('/user', router);