const validateMonth = (req, res, next) => {
    const { month } = req.query;
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).send('Invalid month. Please provide a month between 1 and 12.');
    }
    next();
};

module.exports = validateMonth;
