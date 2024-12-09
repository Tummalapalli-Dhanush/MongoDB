const { MongoClient } = require('mongodb');

let dbconnection;
let uri='mongodb+srv://vamsitonangi9:test9121@cluster0.ujzn6z5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const connectToDb = (cb) => {
  MongoClient.connect(uri)
  //MongoClient.connect('mongodb://localhost:27017/bookshop') for local database
    .then((client) => {
      dbconnection = client.db();
      return cb();
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
};

const getDb = () => dbconnection;

module.exports = { connectToDb, getDb };
