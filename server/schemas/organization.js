const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  contactName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyWebsite: [{ type: String, required: true }],
  contactEmail: { type: String, required: true },
  socials: [String],
  legalDocuments: [String], //urls
  description: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  categories: [String], //range 1 2 3 4 5, each stands for pbc, seo, web maintainace and governace, new website build, and new app build
  SEOKeywords: String,
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
});

const Organization = mongoose.model("Organizations", organizationSchema);

module.exports = Organization;
