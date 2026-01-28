// 1️⃣ Import modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { seedData } = require("./controllers/seedController"); // path correct karo

// 2️⃣ Load .env
dotenv.config();

// 3️⃣ Dummy req, res objects for standalone run
const req = {};
const res = {
  status: () => ({
    json: (data) => console.log("Seed Result:", data),
  }),
};

// 4️⃣ Connect to MongoDB and run seed
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected, running seed...");
    await seedData(req, res); // Seed function run
    console.log("Seed finished");
    process.exit(0); // Script close kar do
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
