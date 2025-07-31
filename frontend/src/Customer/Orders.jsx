import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar"; 
import Halleyx from '../assets/halleyx-logo.svg';
import server from '../Authentication/Server';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userid = localStorage.getItem('userid');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await server.post('/getorders', { userid: Number(userid) });
        if (response.status === 200) {
          setOrders(response.data);
          console.log("Orders fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar Halleyx={Halleyx} />
      <div className="px-4 py-6 w-screen min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-center">🧾 My Orders</h1>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={index} className="border border-gray-300 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
               <div>
                <img src={order.img} alt={order.name} className="w-16 h-16 object-cover rounded" />
                  <h2 className="font-semibold text-lg">Order #{String(order.orderid).padStart(3, '0')}</h2>
                <p className="text-sm text-gray-600">
               Date: {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
               <p className="text-sm font-medium text-green-600">Status: {order.orderstatus}</p>
                </div>

                <div className="text-sm text-gray-700 mb-2">
                  - {order.name} x{order.quantity} - ${order.totalPrice}
                </div>

                <div className="text-right">
                  <button className="text-blue-600 font-medium hover:underline text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
