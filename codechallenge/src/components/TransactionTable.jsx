import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, [month, search, page]);

    const fetchTransactions = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`, {
            params: { month, search, page }
        });
        setTransactions(response.data);
    };

    return (
        <>
        <div className=' container mx-auto'>

            <div className="container mx-auto mt-10">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="text-left p-3 font-medium text-gray-600 uppercase tracking-wider">Title</th>
                        <th className="text-left p-3 font-medium text-gray-600 uppercase tracking-wider">Description</th>
                        <th className="text-left p-3 font-medium text-gray-600 uppercase tracking-wider">Price</th>
                        <th className="text-left p-3 font-medium text-gray-600 uppercase tracking-wider">Sold</th>
                        <th className="text-left p-3 font-medium text-gray-600 uppercase tracking-wider">Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{transaction.title}</td>
                            <td className="p-3">{transaction.description}</td>
                            <td className="p-3">${transaction.price.toFixed(2)}</td>
                            <td className="p-3">{transaction.sold ? 'Yes' : 'No'}</td>
                            <td className="p-3">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div className='flex gap-2 my-5'>
                <button className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' onClick={() => setPage(page - 1)} disabled={page === 1}>
                &lt; Previous
                </button>
                <button className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' onClick={() => setPage(page + 1)}>
                    Next &gt;
                </button>
            </div>
       
        </div>
        </>
    );
};

export default TransactionTable;
