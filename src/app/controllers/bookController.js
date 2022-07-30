const express = require('express');
const Book = require('../models/books');
const router = express.Router();

router.get('/', async(req, res) =>{
    try {
        const books = await Book.find()
        return res.send({ books });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possivel recuperar os livros'}) 
    }
});

router.get('/:bookId', async(req, res)=>{
    try {
        const book = await Book.find({"_id" : `${req.params.bookId}`});
        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possivel recuperar o livro'}) 
    }
})

router.post('/', async(req, res)=>{
    try {
        const book = await Book.create(req.body)
        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possivel submeter o livro'})
    }
})

router.put('/:bookId', async(req, res)=>{
    try {
        const id = req.params.bookId
        const book = req.body
        
        const response = await Book.findByIdAndUpdate({"_id" : `${id}`}, )

        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possivel recuperar o livro'}) 
    }
})

router.delete('/:bookId', async(req, res)=>{
   try {
       await Book.findByIdAndRemove(req.params.bookId);
       return res.send("livro deletado")

   } catch (error) {
       return res.status(400).send({erro: 'Não foi possivel deletar o livro'})
    }
   
})

module.exports = app => app.use('/books', router);