const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { ServerApiVersion, MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("Shop-co");
    const allProductsCollection = db.collection("Products");

    app.get("/all-products", async (req, res) => {
      const result = await allProductsCollection.find().toArray();
      res.json(result);
    });

    
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Wellcome to the Shop-Co Server!");
});

app.listen(port, () => {
  console.log(`Shop-Co listening on port ${port}`);
});
