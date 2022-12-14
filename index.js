const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   res.send("Genius car server is running");
});

/* mongodb setup and connect */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.wqgorgk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

const run = async () => {
   try {
      /* services collection */
      const serviceCollection = client.db("geniusCar").collection("services");

      /* Orders Collection */
      const ordersCollection = client.db("geniusCar").collection("orders");

      app.get("/services", async (req, res) => {
         const query = {};
         const cursor = serviceCollection.find(query);
         const services = await cursor.toArray();
         res.send(services);
      });

      app.get("/service/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const service = await serviceCollection.findOne(query);
         res.send(service);
      });

      /* Orders API */
      app.post("/orders", async (req, res) => {
         const order = req.body;
         const result = await ordersCollection.insertOne(order);
         res.send(result);
      });

      /* get orders by query */
      app.get("/orders", async (req, res) => {
         let query = {};
         if (req.query.email) {
            query = { email: req.query.email };
         }
         const cursor = ordersCollection.find(query);
         const orders = await cursor.toArray();
         res.send(orders);
      });
   } finally {
   }
};
run().catch((e) => console.log(e));

app.listen(port, () => {
   console.log("server is running on port:", port);
});
