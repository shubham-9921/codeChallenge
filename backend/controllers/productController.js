const axios = require('axios');
const Product = require('../models/Product');

exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get(process.env.API_URL);
        await Product.deleteMany({});
        
        const products = response.data.map(product => {
            const dateOfSale = new Date(product.dateOfSale);
            if (isNaN(dateOfSale.getTime())) {
                console.warn(`Invalid date format for product ID: ${product.id}`);
                return null;
            }
            return {
                ...product,
                dateOfSale
            };
        }).filter(product => product !== null);

        await Product.insertMany(products);
        res.status(200).send('Database initialized');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getTransactions = async (req, res) => {
    const { month, search, page } = req.query;

    // Construct query object
    const query = {
        dateOfSale: { 
            $gte: new Date(`2022-${month}-01`),
            $lt: new Date(`2022-${month}-31`)
        }
    };

    // Add search regex condition if search is provided
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } } // Assuming price is stored as string
        ];
    }

    try {
        const perPage = 10;
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Server error');
    }
};

exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const start = new Date(`2022-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    try {
        const totalSaleAmount = await Product.aggregate([
            { $match: { dateOfSale: { $gte: start, $lt: end }, sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const totalSoldItems = await Product.countDocuments({ dateOfSale: { $gte: start, $lt: end }, sold: true });
        const totalNotSoldItems = await Product.countDocuments({ dateOfSale: { $gte: start, $lt: end }, sold: false });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getBarChartData = async (req, res) => {
    const { month } = req.query;
    const start = new Date(`2022-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    try {
        const barChartData = await Product.aggregate([
            { $match: { dateOfSale: { $gte: start, $lt: end } } },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: "Other",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getPieChartData = async (req, res) => {
    const { month } = req.query;
    const start = new Date(`2022-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    try {
        const pieChartData = await Product.aggregate([
            { $match: { dateOfSale: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getCombinedData = async (req, res) => {
    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:${process.env.PORT}/api/transactions`, { params: req.query }),
            axios.get(`http://localhost:${process.env.PORT}/api/statistics`, { params: req.query }),
            axios.get(`http://localhost:${process.env.PORT}/api/bar-chart`, { params: req.query }),
            axios.get(`http://localhost:${process.env.PORT}/api/pie-chart`, { params: req.query })
        ]);

        res.status(200).json({
            transactions: transactions.data,
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
