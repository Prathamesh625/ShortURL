const expres = require("express");
const shortid = require("short-id");
const validurl = require("valid-url");
const router = expres.Router();
const schema = require("./url");
router.post("/post", async (req, res) => {
  const longUrl = req.body.longUrl;
  const baseUrl = "https://link-gen-app.herokuapp.com/";

  const urlCode = shortid.generate();

  const shortUrl = baseUrl + "api/" + urlCode;

  const newId = new schema({
    longUrl,
    shortUrl,
    urlCode,
  });

  const data = await newId.save();
  res.json({ data });
});

router.get("/:code", async (req, res) => {
  const one = await schema.findOne({ urlCode: req.params.code });

  if (validurl.isUri(one.longUrl)) {
    try {
      if (one) {
        res.redirect(one.longUrl);
      } else {
        res.sendStatus(404).json("error");
      }
    } catch {
      res.send("server error");
    }
  } else {
    res.send("Invalid Url");
  }
});

module.exports = router;
