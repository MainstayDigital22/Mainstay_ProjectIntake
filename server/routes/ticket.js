const router = require("express").Router();
let Ticket = require("../schemas/ticket");
const { auth } = require("./auth");
const { deleteFile } = require("./upload");

router.route("/").post(async (req, res) => {
  if ((await auth(req, ["admin", "staff", "user"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  if ((await auth(req, ["admin", "staff"])) !== 1) {
    Ticket.find({ user: req.body.user })
      .then((posts) => res.json(posts))
      .catch((err) => res.status(400).json("Error: " + err));
    return;
  }
  Ticket.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/add").post(async (req, res) => {
  if ((await auth(req, ["admin", "staff", "user"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  const newTicket = new Ticket({
    username: req.body.username,
    companyName: req.body.companyName,
    websiteUrl: req.body.websiteUrl,
    primaryContactName: req.body.primaryContactName,
    name: req.body.name,
    email: req.body.email,
    socials: req.body.socials,
    branding: req.body.branding,
    hosting: req.body.hosting,
    FTP: req.body.FTP,
    controlPanel: req.body.controlPanel,
    domain: req.body.domain,
    budget: req.body.budget,
    SEOKeywords: req.body.SEOKeywords,
    legalDocuments: req.body.legalDocuments,
    comments: req.body.comments,
  });

  newTicket
    .save()
    .then(() => res.json({ id: newTicket._id, message: "Ticket Created!" }))
    .catch((err) => res.status(400).json("Error: " + err));
});

//---------------------

router.route("/author/:author").get(async (req, res) => {
  if ((await auth(req, 1)) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  Post.find({ author: req.params.author })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/category").post(async (req, res) => {
  if ((await auth(req, 2)) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  if ((await auth(req, 1)) !== 1) {
    if (req.body.category && req.body.status) {
      Post.find({
        user: req.body.user,
        category: { $in: req.body.category },
        status: req.body.status || { $in: [0, 1, 2, 3] },
      })
        .then((posts) => res.json(posts))
        .catch((err) => res.status(400).json("Error: " + err));
    } else if (req.body.category) {
      Post.find({ user: req.body.user, category: { $in: req.body.category } })
        .then((posts) => res.json(posts))
        .catch((err) => res.status(400).json("Error: " + err));
    } else {
      Post.find({
        user: req.body.user,
        status: req.body.status || { $in: [0, 1, 2, 3] },
      })
        .then((posts) => res.json(posts))
        .catch((err) => res.status(400).json("Error: " + err));
    }
    return;
  }
  if (req.body.category && req.body.status) {
    Post.find({
      category: { $in: req.body.category },
      status: req.body.status || { $in: [0, 1, 2, 3] },
    })
      .then((posts) => res.json(posts))
      .catch((err) => res.status(400).json("Error: " + err));
  } else if (req.body.category) {
    Post.find({ category: { $in: req.body.category } })
      .then((posts) => res.json(posts))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    Post.find({ status: req.body.status || { $in: [0, 1, 2, 3] } })
      .then((posts) => res.json(posts))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

router.route("/:_id").get(async (req, res) => {
  if ((await auth(req, 2)) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  Post.find({ _id: req.params._id })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/:_id").delete(async (req, res) => {
  if ((await auth(req, 0)) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  Post.find({ _id: req.params._id }).then((post) => {
    if (!post[0]) {
      res.json("Post Not Found.");
      return;
    }
    const media = post[0].media;
    for (let i = 0; i < media.length; i += 1) {
      deleteFile(media[i].link.split("/")[media[i].link.split("/").length - 1]);
    }
    Post.findOneAndDelete({ _id: req.params._id })
      .then(() => res.json("Post deleted."))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

router.route("/update/:_id").post((req, res) => {
  Post.findOne({ _id: req.params._id })
    .then((post) => {
      Post.replaceOne(
        { _id: req.params._id },
        {
          user: req.body.user || post.user,
          name: req.body.name || post.name,
          title: req.body.title || post.title,
          subtitle: req.body.subtitle || post.subtitle,
          englishName: req.body.englishName || post.englishName,
          description: req.body.description || post.description,
          year: req.body.year || post.year,
          media: req.body.media || post.media,
          category: req.body.category || post.category,
          contentType: req.body.contentType || post.contentType,
          layout: req.body.layout || post.layout,
          created: post.created,
          updated: req.body.updated,
          status: req.body.status != undefined ? req.body.status : post.status,
        }
      )
        .then(() => res.json("Post updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
