const Ticket = require("../models/Ticket");

class MongoTicketDAO {
  async createTicket(data) {
    const ticket = new Ticket(data);
    return await ticket.save();
  }

  async getTicketByCode(code) {
    return await Ticket.findOne({ code }).populate("products.product");
  }
}
module.exports = MongoTicketDAO;
