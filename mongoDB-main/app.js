const express = require('express');
const { connectToDb, getDb } = require('./db');
const {ObjectId}=require('mongodb')

const app = express();
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log('App listening on port 3001');
    });
    db = getDb();
  } else {
    console.log('Failed to connect to database');
  }
});

app.use(express.json())

//write all documents of collection
app.get('/books', (req, res) => {
  const page=req.query.p || 0
  const booksperpage=3
  let books=[]
  db.collection('books')
    .find()
    .sort({ author: 1 })
    .skip(page * booksperpage)
    .limit(3)
    .forEach( book => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Could not fetch the documents' });
    });
});

//find single documnet from collection
app.get('/books/:id',(req,res)=>{

  if(ObjectId.isValid(req.params.id)){
    db.collection('books')
    .findOne({_id:new ObjectId(req.params.id)})
    .then(doc=>res.status(200).json(doc))
    .catch(()=>{
      res.status(500).json({error:"could'nt fetch data"})
    })
  }
  else{
    res.status(500).json({error:'given id is not valid'})
  }
})

app.post('/books',(req,res)=>{
  db.collection('books')
    .insertOne(req.body)
    .then(result=> res.status(200).json(result))
    .catch((err)=>{
      res.status(500).json({error:`${err}`})
    })
})

app.delete('/books/:id',(req,res)=>{
  if(ObjectId.isValid(req.params)){
    db.collection('books')
    .deleteOne({_id:new ObjectId(req.params)})
    .then(result=>res.status(200).json(result))
    .catch(err=>res.status(500).json({error:'could not delete the document'}))
  }
  else{
    res.status(500).json({error:'given id is not valid'})
  }
})

app.patch('/books/:id', (req, res) => {
  const update = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
      .then(result => res.status(200).json(result))
      .catch(err => {
        res.status(500).json({ error: 'Could not update the document' });
      });
  } else {
    res.status(500).json({ error: 'Given ID is not valid' });
  }
});


