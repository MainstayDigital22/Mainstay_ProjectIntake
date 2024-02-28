const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  username: { type: String, required: true }, //username for accessing our portal
  title: { type: String, required: true },
  domainURL: { type: String, required: true },
  category: { type: String, required: true }, //range 1 2 3 4 5, each stands for pbc, seo, web maintainace and governace, new website build, and new app build
  priority: {
    type: String,
    required: true,
    enum: ["ASAP", "high", "medium", "low"],
    default: "medium",
  },
  status: {
    type: String,
    required: true,
    enum: [
      "new",
      "completed",
      "archived",
      "pending review",
      "pending response",
    ],
    default: "new",
  },
  branding: {
    files: [String], //array of media urls
    colorCodes: {
      type: String,
    },
    fonts: String,
    designDocument: [String], //array of media urls
  },
  hosting: {
    type: {
      provider: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
    },
    required: false,
  },
  FTP: {
    type: {
      provider: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      liveDirectory: { type: String, required: true },
    },
    required: false,
  },
  controlPanel: {
    type: {
      url: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
    },
    required: false,
  },
  domain: {
    type: {
      provider: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
    },
    required: false,
  },
  chat: {
    type: [
      {
        isClient: { type: Boolean, required: true },
        message: { type: String, required: true },
        username: { type: String, required: true },
      },
    ],
  },
  SEOKeywords: String,
  comments: String, //anything additional
});

const Ticket = mongoose.model("Tickets", ticketSchema);

module.exports = Ticket;
