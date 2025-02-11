function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado' });
    }
}

function isUser(req, res, next) {
    if (req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado' });
    }
}

module.exports = { isAdmin, isUser };