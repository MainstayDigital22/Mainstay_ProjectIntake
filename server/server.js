const express = require("express");
const fs = require("fs");
const Grid = require("gridfs-stream");
const https = require("https");
const server = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";
const mongoose = require("mongoose");
require("dotenv/config");

server.use(cors());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs;
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("mongo connected!");
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection("files");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });
/*server.use(function (req, res, next) {
  if (!req.client.authorized) {
      return res.status(401).send('User is not authorized');
  }
  var cert = req.socket.getPeerCertificate();
  if (cert.subject) {
      console.log(cert.subject.CN);
  }
  next();
});*/

const userRouter = require("./routes/user");
server.use("/user", userRouter);
const ticketRouter = require("./routes/ticket");
server.use("/ticket", ticketRouter);
const { uploadRouter } = require("./routes/upload");
server.use("/file", uploadRouter);
const { authRouter } = require("./routes/auth");
server.use("", authRouter);

// media routes
server.get("/file/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.send(error);
  }
});

server.delete("/file/:filename", async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send("An error occured.");
  }
});

server.get("/medialist", async (req, res) => {
  try {
    connection.db.collection("photos.files", function (err, collection) {
      collection.find().toArray(function (err, files) {
        let urls = [];
        for (i in files) {
          urls.push(`http://${HOST}:${PORT}/file/` + files[i].filename);
        }
        res.send(urls);
      });
    });
  } catch (error) {
    console.log(error);
    res.send("An error occured.");
  }
});
// Start the API server
server.listen(PORT, () => console.log("Local app listening"));
//https.createServer(options, server).listen(PORT, () => console.log('Local app listening'));
