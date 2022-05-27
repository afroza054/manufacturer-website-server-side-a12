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
      // Post item Data
      app.post("/item", async (req, res) => {
        const newUser = req.body;
        console.log("adding new user", newUser);
        const result = await itemCollection.insertOne(newUser);
        res.send(result);
      });
  
      //Delete a item data
      app.delete("/item/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        console.log(id, query);
        const result = await itemCollection.deleteOne(query);
        res.send(result);
      });
  
      //Get Item by id
      app.get("/item/:id", async (req, res) => {
        const id = req.params.id;
        // console.log(id);
        const query = { _id: ObjectId(id) };
        const product = await itemCollection.findOne(query);
        res.send(product);
      });

      //Update item Quantity
      app.put("/item/:id", async (req, res) => {
        const id = req.params.id;
        // console.log(id);
        const updatedItem = req.body;
        console.log(updatedItem);
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            quantity: updatedItem.quantity,
          },
        };
        const result = await itemCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });
  
      //Get api data by email 
      app.get("/useritem", verifyJWT, async (req, res) => {
        const decodedEmail = req.decoded.email;
        const email = req.query.email;
        // console.log(email);
  if(email===decodedEmail){
    const query = { email: email };
    const cursor = itemCollection.find(query);
    const useritems = await cursor.toArray();
    res.send(useritems);
  }
  else{
    res.status(403).send({message : 'forbidden access'})
  }
  
      });
  
    } finally {
      // await client.close();
    }
  }
  //Exicute funtion
  run().catch(console.dir);
  //Server Running ok
  app.get("/", (req, res) => {
    res.send("Srever is running......!");
  });

app.listen(port, () => {
  console.log(`Manufacture app listening on port ${port}`)
})