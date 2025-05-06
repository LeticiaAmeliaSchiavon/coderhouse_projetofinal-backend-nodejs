const moment = require("moment");

module.exports = {
  formatUserForResponse(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
    };
  },

  formatDate(date) {
    return moment(date).format("DD/MM/YYYY HH:mm");
  },

  isProd: process.env.NODE_ENV === "production",
};
