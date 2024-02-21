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
    query.username = req.body.user;
    if (req.body.status) {
      query.status = req.body.status;
    }
  }
  Ticket.find(query)
    .then(tickets => res.json(tickets))
    .catch(err => res.status(400).json("Error: " + err));
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
    branding: req.body.branding,
    hosting: req.body.hosting,
    FTP: req.body.FTP,
    controlPanel: req.body.controlPanel,
    domain: req.body.domain,
    SEOKeywords: req.body.SEOKeywords,
    comments: req.body.comments,
  });

  newTicket
    .save()
    .then(() => res.json({ id: newTicket._id, message: "Ticket Created!" }))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/:_id").delete(async (req, res) => {
  if ((await auth(req, ['admin'])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  Ticket.find({ _id: req.params._id }).then((ticket) => {
    if (!ticket[0]) {
      res.json("ticket Not Found.");
      return;
    }
    let media = ticket[0].branding.files || [];
    console.log(media)
    for (let i = 0; i < media.length; i += 1) {
      deleteFile(media[i].split("/")[media[i].split("/").length - 1]);
    }
    media = ticket[0].branding.designDocument || [];
    for (let i = 0; i < media.length; i += 1) {
      deleteFile(media[i].split("/")[media[i].split("/").length - 1]);
    }
    Ticket.findOneAndDelete({ _id: req.params._id })
      .then(() => res.json("Ticket deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});
router.route("/:_id").get(async (req, res) => {
  Ticket.find({ _id: req.params._id })
    .then((tickets) => res.json(tickets))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route('/update/:id').post(async (req, res) => {
  if ((await auth(req, ['admin', 'staff', 'client'])) !== 1) {
    res.status(403).json('Auth Error');
    return;
  }

  const updateData = {};
  const fieldsToUpdate = ['username', 'category', 'title', 'priority', 'domainURL', 'branding', 'hosting', 'FTP', 'controlPanel', 'domain', 'SEOKeywords', 'comments', 'status'];

  fieldsToUpdate.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  Ticket.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })
    .then(updatedTicket => {
      if (!updatedTicket) {
        return res.status(404).json('Ticket not found.');
      }
      res.json({ id: updatedTicket._id, message: 'Ticket Updated!' });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;
