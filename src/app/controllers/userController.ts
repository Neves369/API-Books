import express from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middlewares/auth';

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
router.get('/:userId', async(req, res) =>{
    try {

        if(!req.params.userId){
            return res.status(400).send({erro: 'Informe o usuário'});
        }

        let  user= await User.findOne({"_id" : `${req.params.userId}`});

        return res.send(user);

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possível recuperar usuário'}) 
    }
})

// Altera um usuário pelo id
router.put('/:userId', async(req, res)=>{
    try {

        if(!req.params.userId){
            return res.status(400).send({erro: 'Informe o usuário'});
        }

        const id = req.params.userId
        const user = req.body
        user.senha = await bcrypt.hash(user.senha!, 10);
        
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

export default (app: { use: (arg0: string, arg1: any) => any; }) => app.use('/user', router);