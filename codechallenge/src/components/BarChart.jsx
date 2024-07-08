import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ month }) => {
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        fetchBarChartData();
    }, [month]);

    const fetchBarChartData = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/bar-chart`, {
            params: { month }
        });
        setBarChartData(response.data);
    };

    const data = {
        labels: ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901+'],
        datasets: [
            {
                label: 'Number of Items',
                data: barChartData.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div className='container mx-auto mt-20 mb-10 '>
            <h3 className='text-center text-4xl font-semibold'>Bar Chart</h3>
            <Bar className='mt-5' data={data} />
        </div>
    );
};

export default BarChart;
