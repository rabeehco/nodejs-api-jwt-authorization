const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const User = require("../models/user");

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  const result = await user.save();
  const { password, ...others } = result.toJSON();
  res.send(others);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({ message: "Invalid Credential!" });
  }
/* 'secret' is a secret key for jwt. Usually it stores in .env file */
  const token = jwt.sign({_id: user._id}, 'secret')

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 1000 // 1 day
  })

  res.send({
    message: 'success'
  })

});

router.get('/user', async (req, res) => {
    const cookie = req.cookies['jwt']
    const claims = jwt.verify(cookie, 'secret')

    if(!claims){
        return res.status(401).send({ message: "Unauthenticated!" });
    }
    
    const user = await User.findOne({_id: claims._id})

    const {password, ...otherData} = await user.toJSON()

    res.send(otherData)
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: 0})

    res.send({message: 'success'})
})

module.exports = router;
 