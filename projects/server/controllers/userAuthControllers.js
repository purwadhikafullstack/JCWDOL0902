const db = require("../src/models");
const jwt = require("jsonwebtoken");
const user = db.user;

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw "Invalid Email and/or Password";

      const userExist = await user.findOne({
        where: {
          email,
        },
      });
      if (!userExist)
        throw {
          status: false,
          message: "User Not Found",
        };

      const isValid = await bcrypt.compare(password, userExist.password);
      if (!isValid)
        throw {
          status: false,
          message: "Wrong Password",
        };

      const payload = { id: userExist.id };
      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      res.status(200).send({
        status: true,
        message: "Login Success",
        data: userExist,
        token,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
