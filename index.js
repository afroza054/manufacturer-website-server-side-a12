const express = require('express')

const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Manufacturing Website')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.50o6t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    //const userCollection = client.db("foodExpress").collection("user");
    const itemCollection = client.db("gorgeousFruits").collection("service");
    
    
    //auth
app.post('/login', async(req,res)=>{
  const user =req.body;
  const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:'1d'
  });
  res.send({accessToken});
  })
  //get item
  app.get("/item", async (req, res) => {
    const query = {};
    const cursor = itemCollection.find(query);
    const items = await cursor.toArray();
    res.send(items);
  });
  }
}
app.listen(port, () => {
  console.log(`Manufacture app listening on port ${port}`)
})