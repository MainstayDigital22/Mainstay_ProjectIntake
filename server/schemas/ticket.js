const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  username: { type: String, required: true }, //username for accessing our portal
  companyName: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  primaryContactName: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true },
  socials: [String],
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
  budget: { type: Number, required: true },
  SEOKeywords: String,
  legalDocuments: [String], //urls
  comments: String, //anything additional
});

const Ticket = mongoose.model("Tickets", ticketSchema);

module.exports = Ticket;
