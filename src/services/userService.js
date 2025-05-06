const User = require("../models/User");

exports.getAllUsers = async () => {
  return await User.find({}, "name email role lastActivity");
};

exports.deleteInactiveUsers = async (cutoffDate) => {
  const inactiveUsers = await User.find({
    lastActivity: { $lt: cutoffDate },
  });

  await User.deleteMany({
    _id: { $in: inactiveUsers.map((u) => u._id) },
  });

  return inactiveUsers;
};

exports.updateUserRole = async (userId, newRole) => {
  return await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
};
