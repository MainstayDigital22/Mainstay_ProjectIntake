const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  username: { type: String, required: true, ref: "Users" }, //username for accessing our portal
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organizations" },
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
    enum: ["new", "completed", "closed", "pending review", "pending response"],
    default: "new",
  },
  chat: {
    type: [
      {
        isClient: { type: Boolean, required: true },
        messageType: { type: String, required: true, enum: ["text", "file"] },
        content: { type: String, required: true },
        username: { type: String, required: true },
        time: { type: Date, default: Date.now },
      },
    ],
  },
  deadline: { type: Date, required: true },
  created: { type: Date, default: Date.now, required: true },
  updated: { type: Date, default: Date.now, required: true },
  comments: String, //anything additional
});

const Ticket = mongoose.model("Tickets", ticketSchema);

module.exports = Ticket;
