const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  created: { type: Date, default: Date.now, required: true },
  updated: { type: Date, default: Date.now, required: true },
  permission: {
    type: String,
    required: true,
    enum: ["admin", "staff", "user"],
    default: "user",
  },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
