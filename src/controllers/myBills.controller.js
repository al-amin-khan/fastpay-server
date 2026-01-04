const { ObjectId } = require("mongodb");
const { getCollections } = require("../db");

const getMyBills = async (req, res) => {
    const { myBillsCollection } = getCollections();
    const { email } = req.query;
    const query = { email };
    const result = await myBillsCollection.find(query).toArray();
    return res.send(result);
};

const createMyBill = async (req, res) => {
    const { myBillsCollection } = getCollections();
    const bill = req.body;
    const result = await myBillsCollection.insertOne(bill);
    return res.send(result);
};

const updateMyBill = async (req, res) => {
    const { myBillsCollection } = getCollections();
    const { id } = req.params;
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
    return res.send(result);
};

const deleteMyBill = async (req, res) => {
    const { myBillsCollection } = getCollections();
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await myBillsCollection.deleteOne(query);
    return res.send(result);
};

module.exports = {
    getMyBills,
    createMyBill,
    updateMyBill,
    deleteMyBill,
};
