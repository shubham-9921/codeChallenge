require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const productRoutes = require('./routes/productRoutes');


app.use('/api', productRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
