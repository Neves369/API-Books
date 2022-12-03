const fs = require('fs');
const express = require('express');
const Book = require('../models/books');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

// Retorna uma lista de livros com suas respectivas capas 
router.get('/', async(req, res) =>{
    try {

        let books = [];
        // console.log(req)

        // Busca todos os livros de uma determinada categoria
        if(req.query.categoria){
            console.log("Por categoria: ", req.query)
            books = await Book.find()
        }
        // Busca 3 livros de cada categoria informada
        if(req.query.categorias){
            console.log("Por categorias: ", req.query)
            books = await Book.find()
        }
        // Busca os livros listados no array de favoritos, caso a quantidade não seja informada busca todos
        if(req.query.favoritos){
            console.log("favoritos: ", req.query)
            if(req.query.favoritos == ''){
                books = []
            }
            else{
                books = await Book.find({"_id" : { $in: req.query.favoritos}})
            }
        }


        books.forEach((book) => {
            
            let teste = fs.readFileSync(`./books/${book.ref}/capa.png`, {encoding: 'base64'})
           
            book.capa = teste;
        });

         return res.send(books);
        

    } catch (error) {
        console.log(error)
        return res.status(400).send({erro: 'Não foi possível recuperar os livros'}) 
    }
});

// Retorna as informações de um livro por id 
router.get('/:bookId', async(req, res)=>{
    try {
        const book = await Book.find({"_id" : `${req.params.bookId}`});
        book = book.shift();

        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possível recuperar o livro'}) 
    }
})

// Retorna o epub do livro por id (A referencia é o nome da pasta onde estão os arquivos) 
router.get('/data/:bookId', async(req, res)=>{
    try {
        let book = await Book.find({"_id" : `${req.params.bookId}`});
        book = book.shift();

        let data = fs.readFileSync(`./books/${book.ref}/data.epub`, {encoding: 'base64'})

        return res.send(data);

    } catch (error) {
        console.log(error)
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
        return res.status(400).send({erro: 'Não foi possível atualizar o livro'}) 
    }
})

// Essa rota por hora não vai ser usada (Futuramente haverá permissões especiais para podermos utilizá-la)
router.delete('/:bookId', async(req, res)=>{
   try {
       await Book.findByIdAndRemove(req.params.bookId);
       return res.send("livro deletado")

   } catch (error) {
       return res.status(400).send({erro: 'Não foi possível deletar o livro'})
    }
   
})

module.exports = app => app.use('/books', router);