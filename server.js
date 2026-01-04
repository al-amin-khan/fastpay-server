const app = require("./src/app");
const { connectToDb } = require("./src/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

startServer();
