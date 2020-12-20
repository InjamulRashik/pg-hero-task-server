const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uv9mv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("services"));

const port = 5000;

app.get("/", (req, res) => {
  res.send("Working good");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const seats = client.db("cineMax5D").collection("seats");

  app.post("/addSeat", (req, res) => {
    const seat = req.body;
    seats.insertOne(seat).then((result) => {});
  });
  app.get("/allSeats", (req, res) => {
    //console.log(req.query.email);
    seats.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.patch("/updateSeat", (req, res) => {
    seats
      .updateOne(
        { _id: ObjectId(req.body.id) },
        {
          $set: { status: "Booked!" },
        }
      )
      .then((result) => {
        res.send(result);
      });
  });
});

app.listen(process.env.PORT || port);
