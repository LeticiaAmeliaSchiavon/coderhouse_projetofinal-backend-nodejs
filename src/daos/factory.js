const MongoDAO = require('./mongoDAO');
const MemoryDAO = require('./memoryDAO');

class DAOFactory {
    static getDAO(type) {
        switch (type) {
            case 'mongo':
                return new MongoDAO();
            case 'memory':
                return new MemoryDAO();
            default:
                throw new Error('Tipo de DAO não suportado');
        }
    }
}

module.exports = DAOFactory;