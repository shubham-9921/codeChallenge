import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0
    });

    useEffect(() => {
        fetchStatistics();
    }, [month]);

    const fetchStatistics = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/statistics`, {
            params: { month }
        });
        setStatistics(response.data);
    };

    return (
        <>
        <hr />
        <div className='container mx-auto w-fit  my-5 p-8 rounded-lg shadow-lg bg-sky-200'>
            <h3 className='text-3xl font-semibold text-center underline'>Statistics</h3>
            <div className='my-3 text-xl text-slate-700 '>
                <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
                <p>Total Sold Items: {statistics.totalSoldItems}</p>
                <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
            </div>
        </div>
        </>
    );
};

export default Statistics;
