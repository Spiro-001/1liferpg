var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const User = mongoose.model("User");

/* GET users listing. */
router.get("/all", async (req, res, next) => {
  try {
    const topTen = await User.find().sort({ score: -1 }).limit(10);
    return res.json(topTen);
  } catch (err) {
    next(err);
  }
});

router.post("/score", (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      score: req.body.score,
    });
    newUser.save();
    return res.json(newUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
