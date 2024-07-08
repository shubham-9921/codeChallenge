const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateMonth = require('../middleware/validateMonth');

router.get('/init', productController.initializeDatabase);
router.get('/transactions', validateMonth, productController.getTransactions);
router.get('/statistics', validateMonth, productController.getStatistics);
router.get('/bar-chart', validateMonth, productController.getBarChartData);
router.get('/pie-chart', validateMonth, productController.getPieChartData);
router.get('/combined', validateMonth, productController.getCombinedData);

module.exports = router;
