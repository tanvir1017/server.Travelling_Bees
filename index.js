const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.14uaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();

    const database = client.db("traveling_bees");
    const blogsCollection = database.collection("blogs");

    //   blogs get from api
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    //   blogs post from client to the api
    app.get("/blogs", async (req, res) => {
      const blogContent = req.body;
      const cursor = blogsCollection.insertOne(blogContent);
      const result = await cursor.toArray();
      res.json(result);
    });

    //   get data by single user
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await blogsCollection.findOne(query);
      res.json(cursor);
    });
    //   get data by single user
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await blogsCollection.deleteOne(query);
      res.json(cursor);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Hello from the travelling bees");
});

app.listen(port, () => {
  console.log("Listening from the", port);
});