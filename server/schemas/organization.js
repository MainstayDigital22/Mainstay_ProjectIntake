const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  contactName: { type: String, required: true },
  companyName: { type: String, required: true },
  companyWebsite: { type: String, required: true },
  contactEmail: { type: String, required: true },
  socials: [String],
  legalDocuments: [String], //urls
  description: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
});

const Organization = mongoose.model("Organizations", organizationSchema);

module.exports = Organization;
