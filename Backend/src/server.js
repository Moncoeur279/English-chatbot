const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const corsConfig = require("./middleware/corsConfig");
const { sequelize } = require("./config/dbConfig");
const { connectDB } = require("./config/dbConfig");

require("./models");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;

// MIDDLEWARE
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

/*sequelize.sync({ force: false }).then(() => {
   console.log("Database & tables created!");
});
*/

// ROUTE


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Backend server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();