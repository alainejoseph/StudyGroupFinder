var express = require('express');
var router = express.Router();
var adminAuth = require("../middleware/adminAuth")
let User = require("../Modals/Users")
let Groups = require("../Modals/Groups")
let Reports = require("../Modals/Reports")


router.get("/stats", adminAuth, async (req, res) => {
  const users = await User.countDocuments();
  const groups = await Groups.countDocuments();
  const reports = await Reports.countDocuments({ status: "pending" });

  res.json({ users, groups, reports });
});

router.get("/users", adminAuth, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

router.patch("/users/:id/ban", adminAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: true });
  res.json({ message: "User banned" });
});

router.patch("/users/:id/unban", adminAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: false });
  res.json({ message: "User unbanned" });
});

router.delete("/users/:id", adminAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

/* ================= GROUPS ================= */

router.get("/groups", adminAuth, async (req, res) => {
  const groups = await Groups.find().populate("createdBy members");
  res.json(groups);
});

router.delete("/groups/:id", adminAuth, async (req, res) => {
  await Groups.findByIdAndDelete(req.params.id);
  res.json({ message: "Group deleted" });
});

router.patch("/groups/:id/toggle-lock", adminAuth, async (req, res) => {
  const group = await Groups.findById(req.params.id);
  group.isLocked = !group.isLocked;
  await group.save();
  res.json({ message: "Group status updated" });
});

/* ================= REPORTS ================= */

router.get("/reports", adminAuth, async (req, res) => {
  const reports = await Reports.find()
    .populate("reportedBy")
    .sort({ createdAt: -1 });

  res.json(reports);
});

router.patch("/reports/:id/resolve", adminAuth, async (req, res) => {
  await Reports.findByIdAndUpdate(req.params.id, { status: "resolved" });
  res.json({ message: "Report resolved" });
});

router.patch("/reports/:id/reject", adminAuth, async (req, res) => {
  await Reports.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Report rejected" });
});

module.exports = router;
