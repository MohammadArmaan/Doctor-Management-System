const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log("DB Connection Successfull!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});

