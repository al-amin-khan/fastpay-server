const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const username = process.env.mongodb_user;
const password = process.env.mongodb_password;
const appName = process.env.appName;

const uri = `mongodb+srv://${username}:${password}@fastpay-aws-mumbai-clus.ktdeaau.mongodb.net/?appName=${appName}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
});

const run = async () => {
    try {
        await client.connect();
        const db = client.db("fastPayDB");
        const billsCollection = db.collection("bills");
        const myBillsCollection = db.collection("myBills");

        // await client.db("admin").command({ ping: 1 });
        console.log(
            "You successfully connected to MongoDB!"
        );

        //all bills api
        app.get("/bills", async (req, res) => {
            const query = req.query.category;
            if (query) {
                const cursor = billsCollection.find({ category: query });
                const result = await cursor.toArray();
                return res.send(result);
            }
            const cursor = billsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/bills/category", async (req, res) => {
            const data = await billsCollection.distinct("category");
            const categories = [
                ...new Set(data.map((c) => String(c).trim().toLowerCase())),
            ].sort();

            return res.json({ categories });
        });

        app.get("/latest-bills", async (req, res) => {
            const projectFields = {
                title: 1,
                category: 1,
                location: 1,
                date: 1,
            };
            const cursor = billsCollection
                .find()
                .sort({ date: -1 })
                .project(projectFields)
                .limit(6);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/bills/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await billsCollection.findOne(query);
            res.send(result);
        });

        app.patch("/bills/:id", async (req, res) => {
            const id = req.params.id;
            const bill = req.body;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: bill.title,
                    date: bill.date,
                },
            };
            const result = await billsCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        // my bills api
        app.get("/my-bills", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await myBillsCollection.find(query).toArray();
            res.send(result);
        });


        app.post("/my-bills", async (req, res) => {
            const bill = req.body;
            const result = await myBillsCollection.insertOne(bill);
            res.send(result);
        })
        
        app.patch("/my-bills/:id", async (req, res) => {
            const id = req.params.id;
            const bill = req.body;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    billId: bill.billId,
                    accountNumber: bill.accountNumber,
                    amount: bill.amount,
                    billingMonth: bill.billingMonth,
                    username: bill.username,
                    phone: bill.phone,
                    email: bill.email,
                    address: bill.address,
                    updatedAt: bill.date,
                },
            };
            const result = await myBillsCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        app.delete("/my-bills/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await myBillsCollection.deleteOne(query);
            res.send(result);
        })

    } catch (err) {
        console.error("MongoDB connection error:", err);
        // process.exit(1);
    }
};

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("FastPay server is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
