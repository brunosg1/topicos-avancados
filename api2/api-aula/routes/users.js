var express = require('express');
var router = express.Router();
var User = require("../User")


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/", async function(req,res) {
  // Obtendo os dados do corpo da requisição
  //const {name, email, password} = req.body;
  const user = new User(req.body);
  res.status(201).json(await user.save());
});

module.exports = router;


