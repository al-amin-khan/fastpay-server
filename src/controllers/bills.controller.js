const { ObjectId } = require("mongodb");
const { getCollections } = require("../db");

const getBills = async (req, res) => {
    const { billsCollection } = getCollections();
    const queryParam = req.query.category;

    if (queryParam && queryParam.toLowerCase() !== "all") {
        const normalizedCategory = String(queryParam).trim();
        const result = await billsCollection
            .find({
                category: {
                    $regex: `^${normalizedCategory}$`,
                    $options: "i",
                },
            })
            .toArray();
        return res.send(result);
    }

    const result = await billsCollection.find().toArray();
    return res.send(result);
};

const getBillCategories = async (req, res) => {
    try {
        const { billsCollection } = getCollections();
        const data = await billsCollection.distinct("category");
        const normalized = data.reduce((acc, raw) => {
            if (raw === null || raw === undefined) {
                return acc;
            }
            const trimmed = String(raw).trim();
            if (!trimmed) {
                return acc;
            }
            const key = trimmed.toLowerCase();
            if (!acc.has(key)) {
                acc.set(key, trimmed);
            }
            return acc;
        }, new Map());

        const categories = Array.from(normalized.values()).sort((a, b) =>
            a.localeCompare(b)
        );

        return res.json({ categories });
    } catch (error) {
        console.error("Failed to load categories:", error);
        return res.status(500).json({ message: "Unable to load categories" });
    }
};

const getLatestBills = async (req, res) => {
    const { billsCollection } = getCollections();
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
    return res.send(result);
};

const getBillById = async (req, res) => {
    const { billsCollection } = getCollections();
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await billsCollection.findOne(query);
    return res.send(result);
};

const updateBillStatus = async (req, res) => {
    const { billsCollection } = getCollections();
    const { id } = req.params;
    const bill = req.body;
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            status: bill.status,
            date: bill.date,
        },
    };
    const result = await billsCollection.updateOne(query, updateDoc);
    return res.send(result);
};

module.exports = {
    getBills,
    getBillCategories,
    getLatestBills,
    getBillById,
    updateBillStatus,
};
