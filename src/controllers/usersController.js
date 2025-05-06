const userService = require("../services/userService");
const mailService = require("../services/emailService");
const { formatUserForResponse } = require("../utils/helpers");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users.map(formatUserForResponse));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteInactiveUsers(req, res) {
    try {
      const inactiveThreshold = new Date(
        Date.now() - (process.env.INACTIVE_THRESHOLD || 2 * 24 * 60 * 60 * 1000)
      );

      const deletedUsers = await userService.deleteInactiveUsers(
        inactiveThreshold
      );

      deletedUsers.forEach((user) => {
        mailService.sendInactivityNotification(user.email, user.name);
      });

      res.json({
        deletedCount: deletedUsers.length,
        message: `${deletedUsers.length} usuários inativos removidos`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async renderAdminView(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.render("adminUsers", {
        users: users.map(formatUserForResponse),
        isAdmin: true,
      });
    } catch (error) {
      res.status(500).render("error", { error });
    }
  },

  async updateRole(req, res) {
    try {
      const user = await userService.updateUserRole(
        req.params.id,
        req.body.role
      );
      res.json(formatUserForResponse(user));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      await userService.deleteUserById(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
