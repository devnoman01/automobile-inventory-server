const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5xcel.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const vehicleCollection = client
      .db("automobileInventory")
      .collection("vehicle");

    // LOAD all item
    app.get("/vehicle", async (req, res) => {
      const query = {};
      const cursor = vehicleCollection.find(query);
      const vehicles = await cursor.toArray();
      res.send(vehicles);
    });

    // LOAD specific item
    app.get("/vehicle/:vehicleId", async (req, res) => {
      const id = req.params.vehicleId;
      const query = { _id: ObjectId(id) };
      const vehicle = await vehicleCollection.findOne(query);
      res.send(vehicle);
    });

    // POST - ADD a new item
    app.post("/vehicle", async (req, res) => {
      const newVehicle = req.body;
      console.log("adding new vehicle", newVehicle);
      const result = await vehicleCollection.insertOne(newVehicle);
      res.send({ result: "success" });
    });

    // DELETE an item
    app.delete("/vehicle/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await vehicleCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Automobile Inventory CRUD Server");
});

app.listen(port, () => {
  console.log("Automobile Inventory server is running");
});
