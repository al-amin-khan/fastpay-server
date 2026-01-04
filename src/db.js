const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
});

let dbInstance = null;

const connectToDb = async () => {
    if (dbInstance) {
        return dbInstance;
    }

    await client.connect();
    dbInstance = client.db("fastPayDB");
    console.log("You successfully connected to MongoDB!");
    return dbInstance;
};

const getCollections = () => {
    if (!dbInstance) {
        throw new Error("Database not initialized. Call connectToDb first.");
    }

    return {
        billsCollection: dbInstance.collection("bills"),
        myBillsCollection: dbInstance.collection("myBills"),
    };
};

module.exports = { connectToDb, getCollections };
