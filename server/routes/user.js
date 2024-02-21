const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let User = require("../schemas/user");
const { auth } = require("./auth");

const createToken = (username, perm) => {
  return jwt.sign({ username, perm }, process.env.SECRET, { expiresIn: "3h" });
};

router.route("/").get(async function (req, res) {
  if ((await auth(req, ["admin"])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/add").post(async function (req, res) {
  if ((await auth(req, ['admin'])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  const exists = await User.findOne({ username: req.body.username });
  if (exists) {
    res.json("User already exists");
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    permission: req.body.permission,
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/signup").post(async function (req, res) {
  const exists = await User.findOne({ username: req.body.username });
  if (exists) {
    res.status(400).json("User already exists");
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/:username").get((req, res) => {
  User.find({ username: req.params.username })
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:username").delete((req, res) => {
  User.findOneAndDelete({ username: req.params.username })
    .then(() => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:username").post(async (req, res) => {
  if ((await auth(req, ['admin'])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  const exists = await User.findOne({ username: req.body.username });
  if (exists && req.body.username != req.params.username) {
    res.status(400).json("User already exists");
    return;
  }
  User.findOne({ username: req.params.username })
    .then(async (user) => {
      const hashedPassword = undefined;
      const salt = await bcrypt.genSalt(10);
      if (req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, salt);
      }
      User.replaceOne(
        { username: req.params.username },
        {
          username: req.body.username || user.username,
          password: hashedPassword || user.password,
          name: req.body.name || user.name,
          email: req.body.email || user.email,
          phone: req.body.phone || user.phone,
          permission: req.body.permission || user.permission,
          created: user.created,
          updated: Date.now,
        }
      )
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json(err));
});+

router.route("/onboard").post(async (req, res) => {
  const exists = await User.findOne({ username: req.body.username });
  if (!exists) {
    res.status(400).json("User not found");
    return;
  }
  console.log(req.body.companyName)
      User.findOneAndUpdate(
        { username: req.body.username },
        Object.entries({
          companyName: req.body.companyName,
  companyWebsite: req.body.companyWebsite,
  contactEmail: req.body.contactEmail,
  socials: req.body.socials,
  contactName: req.body.contactName,
  legalDocuments: req.body.legalDocuments,
  comments:req.body.comments,
  onboard:true,
          updated: Date.now(),
        }).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {}),
        {new:true}
      )
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
});


router.route("/login").post(async function (req, res) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.status(400).json("incorrect credentials");
    return;
  }
  if (!req.body.password) {
    res.status(400).json("incorrect credentials");
    return;
  }
  const hashedPassword = user.password;
  const match = await bcrypt.compare(req.body.password, hashedPassword);
  if (!match) {
    res.status(400).json("incorrect credentials");
  } else {
    const userDB = await User.findOne({ username: req.body.username });
    res.status(200).json({
      message: "login success",
      token: createToken(req.body.username, userDB.permission),
      user: req.body.username,
      perm: userDB.permission,
    });
  }
});
router.route("/refresh").post(async function (req, res) {
  if ((await auth(req, ['admin','staff','user'])) !== 1) {
    res.status(403).json("Auth Error");
    return;
  }
  const userDB = await User.findOne({ username: req.body.username });
  res.status(200).json({
    message: "login success",
    token: createToken(req.body.username, userDB.permission),
    user: req.body.username,
    perm: userDB.permission,
  });
});
module.exports = router;
