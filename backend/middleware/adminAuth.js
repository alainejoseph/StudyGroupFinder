var Users = require("../Modals/Users")


module.exports = async function(req, res, next) {
  if (!req.session.user) {
    return res.status(500).json({ message: "Login again" });
  }
  console.log(req.session.user)
  const user = await Users.findById(req.session.user)
  console.log("Admin Auth\n", user)

  if (!user.isAdmin) {
    return res.status(400).json({ msg: "Admin access required" })
  }
  next();
};
