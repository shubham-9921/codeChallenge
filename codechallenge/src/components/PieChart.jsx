import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto'; // Ensures Chart.js is properly initialized

const PieChart = ({ month }) => {
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        fetchPieChartData();
    }, [month]);

    const fetchPieChartData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/pie-chart`, {
                params: { month }
            });
            setCategoryData(response.data);
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    };

    const data = {
        labels: categoryData.map(item => item._id),
        datasets: [{
            data: categoryData.map(item => item.count),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                // Add more colors as needed
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                // Add more colors as needed
            ]
        }]
    };

    return (
        <div className='container mx-auto mt-20 mb-10 '>
            <h2  className='text-center text-4xl font-semibold'>Pie Chart</h2>
            <div className='mt-5 w-[50rem] mx-auto'>
                <Pie data={data} />
            </div>
        </div>
    );
};

export default PieChart;
