const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactName: { type: String },
  email: { type: String, required: true },
  phone: String,
  created: { type: Date, default: Date.now, required: true },
  updated: { type: Date, default: Date.now, required: true },
  permission: {
    type: String,
    required: true,
    enum: ["admin", "staff", "client"],
    default: "client",
  },
  companyName: { type: String },
  companyWebsite: { type: String },
  contactEmail: { type: String },
  socials: [String],
  onboard: { type: Boolean, default: false },
  legalDocuments: [String], //urls
  comments: String,
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
