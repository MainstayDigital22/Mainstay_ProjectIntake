const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { GridFsStorage } = require("multer-gridfs-storage");
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost"
const MONGODB_URI = process.env.MONGODB_URI
const connection = mongoose.createConnection(MONGODB_URI);

let gfs;

connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "photos",
  });
});

const storage = new GridFsStorage({
  url: MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "video/mp4"];

    if (match.indexOf(file.mimetype) === -1) {
      throw new Error("file type error");
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });
const express = require("express");
const router = express.Router();

router.post("/upload", async (req, res) => {
  // Wrap multer middleware in a promise
  const multerUpload = (req, res) =>
    new Promise((resolve, reject) => {
      upload.array("files")(req, res, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

  try {
    await multerUpload(req, res); // Wait for files to be uploaded
    if (req.files.length === 0) return res.send("You must select at least one file.");

    const urls = req.files.map((file, index) => {
      return {
        link: `http://${HOST}:${PORT}/file/${file.filename}`,
        extension: file.filename.split(".").pop(),
        order: index,
      };
    });

    return res.send(urls);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error uploading files");
  }
});

router.delete("/file/:filename", async (req, res) => {
  const { filename } = req.params;

  try {
    const files = await gfs.find({ filename }).toArray();

    if (files.length === 0) {
      return res.status(404).send("File not found.");
    }

    await Promise.all(files.map((file) => gfs.delete(file._id)));
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while removing the file.");
  }
});

exports.deleteFile = async function (filename) {
  try {
    console.log(filename)
    const files = await gfs.find({ filename }).toArray().catch(error => console.error(error));

    if (files.length === 0) {
      throw new Error("File not found.");
    }

    await Promise.all(files.map((file) => gfs.delete(file._id)));
    console.log(`${filename} File removed successfully.`);
  } catch (error) {
    console.error(error);
  }
};

exports.uploadRouter = router;