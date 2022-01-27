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
      const size = parseInt(req.query.size);
      const cursor = blogsCollection.find({});
      let result;
      if (size) {
        result = await cursor.limit(size).toArray();
      } else {
        result = await cursor.toArray();
      }
      res.json(result);
    });
    //   blogs post from client to the api
    app.post("/blogs", async (req, res) => {
      const blogContent = req.body;
      const cursor = await blogsCollection.insertOne(blogContent);
      res.json(cursor);
    });

    //   get data by single user
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await blogsCollection.findOne(query);
      res.json(cursor);
    });
    //   delete data by single user
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await blogsCollection.deleteOne(query);
      res.json(cursor);
    });

    // single api for order manage
    app.get("/blogs/manageOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await blogsCollection.findOne(query);
      res.json(cursor);
    });
    // single api for order manage
    app.put("/blogs/manageOrders/:id", async (req, res) => {
      const id = req.params.id;
      const content = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const data = {
        title: content.title,
        blog_cover: content.blog_cover,
        writer_img: content.writer_img,
        sub_desc: content.sub_desc,
        writer_name: content.writer_name,
        writer_about_title: content.writer_about_title,
        writer_about_img: content.writer_about_img,
        releted_title1: content.releted_title1,
        releted_title2: content.releted_title2,
        releted_desc1: content.releted_desc1,
        releted_desc2: content.releted_desc2,
        releted_img1: content.releted_img1,
        releted_img2: content.releted_img2,
        releted_img3: content.releted_img3,
        releted_img4: content.releted_img4,
      };
      const updatedContent = { $set: data };
      const result = await blogsCollection.updateOne(
        query,
        updatedContent,
        options
      );
      res.json(result);
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
