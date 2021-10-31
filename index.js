const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors')
require('dotenv').config();

const app = express()
const port =process.env.PORT || 5000;

//midlewear
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbah7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try{
        await client.connect();
        // console.log('connected to databased');
        const database = client.db('onlineTour');
        const productsCollection = database.collection('products');
        const spotCollection = database.collection('tourist');
        const addserviceCollection = database.collection('service');
        const clientCollection = database.collection('client');

        app.get('/products', async(req, res) => {
          const cursor = productsCollection.find({});
          const products = await cursor.toArray();
          res.send(products)
        })


        //client get api
        app.get('/client', async(req, res) => {
          const cursor = clientCollection.find({});
          const products = await cursor.toArray();
          res.send(products)
        })

         //get single service
        app.get('/products/:id', async(req, res) => {
          const id = req.params.id;
          console.log('gettins specific id',id)
          const query = {_id: ObjectId(id)};
          const service = await productsCollection.findOne(query);
          res.json(service);
        })


        app.post('/tourist', async(req, res) => {
          const buy = req.body;
          const item = await spotCollection.insertOne(buy);
          res.json(item);
        })


        app.get('/tourist', async(req, res) => {
          const cursor = spotCollection.find({});
          const products = await cursor.toArray();
          res.send(products)
        })


        //delete Api
        app.delete('/tourist/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await spotCollection.deleteOne(query)
        res.json(result);
      })


      //Add new service
      app.post('/service', async(req, res) => {
        const buy = req.body;
        const item = await addserviceCollection.insertOne(buy);
        res.json(item);
      });


      app.get('/service', async(req, res) => {
        const cursor = addserviceCollection.find({});
        const products = await cursor.toArray();
        res.send(products)
      })


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World tourist!')
})


app.listen(port, () => {
  console.log('runing Genius Server on port')
})