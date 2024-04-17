const router = require("express").Router();
const Organization = require("../schemas/organization");
let User = require("../schemas/user");
const { auth } = require("./auth");
const mongoose = require("mongoose");

/* add delete
 let media = ticket[0].branding.files || [];
    console.log(media);
    for (let i = 0; i < media.length; i += 1) {
      deleteFile(media[i].split("/")[media[i].split("/").length - 1]);
    }
    media = ticket[0].branding.designDocument || [];
    for (let i = 0; i < media.length; i += 1) {
      deleteFile(media[i].split("/")[media[i].split("/").length - 1]);
    }
*/

router.route("/add").post(async (req, res) => {
  /*if ((await auth(req, ["admin", "staff"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }*/
  const newOrganization = new Organization({
    contactName: req.body.contactName,
    companyName: req.body.companyName,
    companyWebsite: req.body.companyWebsite,
    contactEmail: req.body.contactEmail,
    socials: req.body.socials,
    legalDocuments: req.body.legalDocuments,
    description: req.body.description,
    categories: req.body.categories,
    branding: req.body.branding,
    hosting: req.body.hosting,
    FTP: req.body.FTP,
    deadline: req.body.deadline,
    controlPanel: req.body.controlPanel,
    domain: req.body.domain,
    SEOKeywords: req.body.SEOKeywords,
  });

  newOrganization
    .save()
    .then((savedOrg) =>
      res.json({ message: "Organization added!", id: savedOrg._id })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").get(async function (req, res) {
  if ((await auth(req, ["admin"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  Organization.find()
    .then((orgs) => res.json(orgs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/userorgs/:userid").get(async function (req, res) {
  const userId = req.params.userid;
  if ((await auth(req, ["admin"])) == 1) {
    Organization.find({})
      .then((orgs) => res.json(orgs))
      .catch((err) => res.status(400).json("Error: " + err));
    return;
  }
  Organization.find({ users: mongoose.Types.ObjectId(userId) })
    .then((orgs) => res.json(orgs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/addUser").post(async (req, res) => {
  if ((await auth(req, ["admin", "staff"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  const organizationId = req.body.organizationId;
  const userId = req.body.userId;
  if (!organizationId || !userId) {
    res.status(400).json("Both organizationId and userId are required");
    return;
  }
  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(
      organizationId,
      { $addToSet: { users: userId } },
      { new: true }
    ).populate("users");
    if (!updatedOrganization) {
      res.status(404).json("Organization not found");
      return;
    }
    res.json({
      message: "User added to organization",
      organization: updatedOrganization,
    });
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/withusers").get(async (req, res) => {
  try {
    const orgsWithUsers = await Organization.find()
      .populate({
        path: "users",
        select: "-password",
      })
      .exec();

    res.json(
      orgsWithUsers.map((org) => ({
        ...org.toObject(),
        users: org.users,
      }))
    );
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/withusers/:id").get(async (req, res) => {
  try {
    const org = await Organization.findOne({ _id: req.params.id })
      .populate({
        path: "users",
        select: "username firstName lastName -_id", // Select only the username, firstName, lastName fields and exclude _id
      })
      .exec();

    res.json({
      _id: org._id,
      companyName: org.companyName,
      users: org.users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      })),
    });
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
