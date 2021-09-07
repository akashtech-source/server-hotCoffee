const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;
const ObjectId = require("mongodb").ObjectId;

app.use(bodyParser.json());
app.use(cors());

const uri =
  "mongodb+srv://newsAdmin:Blockchai9@cluster0.apc6x.mongodb.net/newsportal?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const newsCollection = client.db("newsportal").collection("news");

  // perform actions on the collection object
  console.log("databese connected");

  app.get(`/fullNews/:id`, (req, res) => {
    newsCollection
      .find({
        _id: ObjectId(req.params.id),
      })
      .toArray((err, items) => {
        res.send(items);
        console.log("from database by id", items);
      });
  });

  app.get("/news", (req, res) => {
    newsCollection.find().toArray((err, items) => {
      res.send(items);
      console.log("from db", items);
    });
  });

  app.post("/addNews", (req, res) => {
    const news = req.body;
    console.log("adding new news", news);
    newsCollection.insertOne(news).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  //   client.close();
});

app.get("/", (req, res) => {
  res.send("This is News Portal Server");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
