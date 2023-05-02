import fs from 'fs';
import express from 'express';
import Book from '../models/books';
import authMiddleware from '../middlewares/auth';
import { Router } from 'express-serve-static-core';
import  converter  from '../../util/convertArrayToString';

const router = express.Router();

router.use(authMiddleware);

// Retorna uma lista de livros com suas respectivas capas 
router.get('/', async(req, res) =>{
    try {

        let books: any[] = [];
        console.log(req)

        // Busca todos os livros de uma determinada categoria
        if(req.headers.categoria){
            
            books = await Book.find({ genero: { $in: req.headers.categoria } })
        }

        // Busca 3 livros de cada categoria informada
        if(req.headers.categorias){
            
            let categorias = converter(String(req.headers.categorias));

            books = await Book.aggregate([
                { $match: { genero: { $in: categorias } } },
                { $unwind: "$genero" },
                { $match: { genero: { $in: categorias } } },
                { $group: { _id: "$genero", books: { $push: "$$ROOT" } } },
                { $project: { _id: 0, genero: "$_id", books: { $slice: ["$books", 3] } } },
                { $limit: 3 * categorias.length }
            ])
        }

        // Busca os livros listados no array de favoritos
        if(req.headers.favoritos){
            
            let favoritos = converter(String(req.headers.favoritos));

            books = await Book.find({"_id" : { $in: favoritos}})
            
        }


        // books.forEach((book) => {
            
        //     let teste = fs.readFileSync(`./books/${book.ref}/capa.png`, {encoding: 'base64'})
           
        //     book.capa = teste;
        // });

         return res.send(books);
        

    } catch (error) {
        console.log(error)
        return res.status(400).send({erro: 'Não foi possível recuperar os livros'}) 
    }
});

// Retorna as informações de um livro por id 
router.get('/:bookId', async(req, res)=>{
    try {
        let book = await Book.findOne({"_id" : `${req.params.bookId}`});

        return res.send({ book });

    } catch (error) {
        return res.status(400).send({erro: 'Não foi possível recuperar o livro'}) 
    }
})

// Retorna o epub do livro por id (A referencia é o nome da pasta onde estão os arquivos) 
router.get('/data/:bookId', async(req, res)=>{
    try {
        let book = await Book.findOne({"_id" : `${req.params.bookId}`});

        if (!book) {
            return res.status(404).send('Livro não encontrado'); 
        }

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

export default (app: { use: (arg0: string, arg1: Router) => any; }) => app.use('/books', router);