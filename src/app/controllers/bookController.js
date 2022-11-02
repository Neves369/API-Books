const express = require('express');
const fs = require('fs');
const Book = require('../models/books');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async(req, res) =>{
    try {
        const books = await Book.find()

        books.forEach((book) => {
            
            let teste = fs.readFileSync(`../../api/books/${book.ref_capa}/capa.png`, {encoding: 'base64'})
           
            book.capa = teste;
        });

         return res.send(books);
        

    } catch (error) {
        console.log(error)
        return res.status(400).send({erro: 'Não foi possível recuperar os livros'}) 
    }
});

router.get('/:bookId', async(req, res)=>{
    try {
        const book = await Book.find({"_id" : `${req.params.bookId}`});


        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possível recuperar o livro'}) 
    }
})

router.post('/', async(req, res)=>{
    try {
        const book = await Book.create(req.body)
        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possível submeter o livro'})
    }
})

router.put('/:bookId', async(req, res)=>{
    try {
        const id = req.params.bookId
        const book = req.body
        
        const response = await Book.findByIdAndUpdate({"_id" : `${id}`}, book)
        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possivel atualizar o livro'}) 
    }
})

router.delete('/:bookId', async(req, res)=>{
   try {
       await Book.findByIdAndRemove(req.params.bookId);
       return res.send("livro deletado")

   } catch (error) {
       return res.status(400).send({erro: 'Não foi possível deletar o livro'})
    }
   
})

module.exports = app => app.use('/books', router);