const express = require("express");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const imageModel = require("./models/images");
const connectDB = require("./db/conn");

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});
const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "upload",
    });

    const newImage = new imageModel({
      imageUrl: result.secure_url,
    });
    await newImage.save();
    res
      .status(200)
      .json({ data: newImage, msg: "Image uploaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
});

app.get("/api/images", async (req, res) => {
  try {
    const images = await imageModel.find();
    res.status(200).json(images);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
