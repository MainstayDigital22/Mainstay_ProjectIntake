const router = require("express").Router();
let Ticket = require("../schemas/ticket");
const { auth } = require("./auth");
const { deleteFile } = require("./upload");

router.route("/").post(async (req, res) => {
  if ((await auth(req, ["admin", "staff", "client"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  let query = {};
  if ((await auth(req, ["admin", "staff"])) === 1) {
    if (req.body.status) {
      query = { status: req.body.status };
    }
  } else {
    query.organization = req.body.orgs;
    if (req.body.status) {
      query.status = req.body.status;
    }
  }
  Ticket.find(query)
    .populate("organization")
    .then((tickets) => res.json(tickets))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/add").post(async (req, res) => {
  if ((await auth(req, ["admin", "staff", "client"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  const newTicket = new Ticket({
    username: req.body.username,
    category: req.body.category,
    title: req.body.title,
    priority: req.body.priority,
    domainURL: req.body.domainURL,
    deadline: req.body.deadline,
    status: req.body.status,
    comments: req.body.comments,
    organization: req.body.organization,
  });

  newTicket
    .save()
    .then(() => res.json({ id: newTicket._id, message: "Ticket Created!" }))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/:_id").delete(async (req, res) => {
  if ((await auth(req, ["admin"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  Ticket.find({ _id: req.params._id }).then((ticket) => {
    if (!ticket[0]) {
      res.json("ticket Not Found.");
      return;
    }

    Ticket.findOneAndDelete({ _id: req.params._id })
      .then(() => res.json("Ticket deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});
router.route("/:_id").get(async (req, res) => {
  Ticket.find({ _id: req.params._id })
    .populate("organization")
    .then((tickets) => res.json(tickets))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post(async (req, res) => {
  if ((await auth(req, ["admin", "staff", "client"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }

  const updateData = {};
  const fieldsToUpdate = [
    "username",
    "category",
    "title",
    "priority",
    "domainURL",
    "comments",
    "status",
    "chat",
    "organization",
  ];

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  Ticket.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
    .then((updatedTicket) => {
      if (!updatedTicket) {
        return res.status(404).json("Ticket not found.");
      }
      res.json({ id: updatedTicket._id, message: "Ticket Updated!" });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
