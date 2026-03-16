import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useUser } from "../Context/UserContext";

const DriverProfile = () => {
  const { user } = useUser();

  const [driver, setDriver] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDriverDetails();
      fetchOrders();
    }
  }, [user]);

  const fetchDriverDetails = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    setDriver(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("driver_id", user.id)
      .neq("status", "rejected");

    setOrders(data);
  };

  const updateStatus = async (orderId, status) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);

    fetchOrders();
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-green-50 to-teal-100 min-h-screen">
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6 text-center">
        <h1 className="text-4xl font-bold">Driver Profile</h1>
      </div>

      {/* Driver Details */}

      {driver && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Driver Details</h2>

          <p>
            <strong>Name:</strong> {driver.name}
          </p>
          <p>
            <strong>Email:</strong> {driver.email}
          </p>
          <p>
            <strong>Phone:</strong> {driver.phone}
          </p>
          <p>
            <strong>Address:</strong> {driver.address}
          </p>
          <p>
            <strong>Aadhar:</strong> {driver.aadhar}
          </p>
        </div>
      )}

      {/* Assigned Orders */}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Assigned Orders</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Fuel</th>
              <th className="p-3 border">Village</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-3 border">{order.customer_name}</td>

                <td className="p-3 border">{order.fuel_type}</td>

                <td className="p-3 border">{order.village}</td>

                <td className="p-3 border">{order.quantity}</td>

                <td className="p-3 border">{order.status}</td>

                <td className="p-3 border flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => updateStatus(order.id, "en_route")}
                  >
                    En Route
                  </button>

                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => updateStatus(order.id, "delivered")}
                  >
                    Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverProfile;
