const router = require("express").Router();
const Organization = require("../schemas/organization");
let User = require("../schemas/user");
const { auth } = require("./auth");

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
    comments: req.body.comments,
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
  /*if ((await auth(req, ["admin", "staff"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }*/
  try {
    const orgsWithUsers = await Organization.find()
      .populate({
        path: "users",
        select: "username firstName lastName -_id", // Select only the username, firstName, lastName fields and exclude _id
      })
      .exec();

    res.json(
      orgsWithUsers.map((org) => ({
        _id: org._id,
        companyName: org.companyName,
        users: org.users.map((user) => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        })),
      }))
    );
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
