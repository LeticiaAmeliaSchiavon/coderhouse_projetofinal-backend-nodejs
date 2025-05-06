class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async create(data) {
    return await this.dao.createTicket(data);
  }

  async getByCode(code) {
    return await this.dao.getTicketByCode(code);
  }
}
module.exports = TicketRepository;
