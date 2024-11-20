const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const {connectToDb, getDb} = require("./db")
const {ObjectId} = require("mongodb")
app.use(express.json())


let db
//Connect to the database before listening
connectToDb((error)=>{
   if (!error) {
       app.listen(port, () => {
           console.log(`Server is listening on port ${port}`)
       })
       db = getDb()
   } else {
       console.log(error)
   }
})

//request handlers
app.get("/",(req,res)=>{
    let books = []
    const page = req.query.p || 0
    const booksPerPage = 3
    db.collection("books").find()
    .sort({author:1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(() => res.status(200).json(books))
    .catch(() => {
        res.status(500).json({message:"Error retrieving data from the database"})
    });
})

//Get book by id
app.get("/book/:id", (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection("books").findOne({_id: new ObjectId(req.params.id)})
        .then(book => res.status(200).json(book))
        .catch(() => {
            res.status(500).json({message:"Error retrieving data from the database"})
        });
    } else {
        res.status(400).json({message:"Invalid book id"})
    }

})

//Send book to database
app.post("/books/add",(req, res) =>{
    const book = req.body
    db.collection("books").insertOne(book)
    .then(result => res.status(201).json(result))
    .catch(() => {
        res.status(500).json({message:"Internal server error"})
    });
})

//delete a book by using its id
app.delete("/books/delete/:id", (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection("books").deleteOne({_id: new ObjectId(req.params.id)})
        .then(book => res.status(200).json(book))
        .catch(() => {
            res.status(500).json({message:"Could not delete the book from the database"})
        });
    } else {
        res.status(301).json({message:"No book with such id in the database"})
    }
})

//Update a document
app.patch("/books/update/:id", (req, res)  => {
    const updates = req.body
    if (ObjectId.isValid(req.params.id)) {
        db.collection("books").updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(book => res.status(200).json(book))
        .catch(() => {
            res.status(500).json({message:"Could not update the document"})
        });
    } else {
        res.status(301).json({message:"No book with such id in the database"})
    }
})