import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const AdminManagement = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchDrivers();
  }, []);

  // Fetch Pending Orders
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "Pending");

    if (error) {
      console.log(error);
    } else {
      setPendingOrders(data);
    }
  };

  // Fetch Drivers
  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id,name")
      .ilike("role", "driver"); // case insensitive

    if (error) {
      console.log(error);
    } else {
      setDrivers(data);
    }
  };

  // Assign Driver
  const handleAssignDriver = async (orderId, driverId) => {
    const { error } = await supabase
      .from("orders")
      .update({ driver_id: driverId })
      .eq("id", orderId);

    if (!error) {
      // UI update instantly
      setPendingOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, driver_id: driverId } : order,
        ),
      );
    }
  };

  // Approve Order
  const handleApprove = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "Approved" })
      .eq("id", orderId);

    if (!error) {
      fetchOrders();
      alert("Order Approved");
    }
  };

  // Reject Order
  const handleReject = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "Rejected" })
      .eq("id", orderId);

    if (!error) {
      fetchOrders();
      alert("Order Rejected");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-pink-50 to-purple-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg mb-6 text-center">
        <h1 className="text-5xl font-bold mb-2">Admin Management</h1>
        <p className="text-lg">Seamlessly manage and assign orders</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-purple-600 mb-6">
          Pending Orders
        </h2>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <th className="p-4 border">Fuel Type</th>
              <th className="p-4 border">Quantity</th>
              <th className="p-4 border">Address</th>
              <th className="p-4 border">Driver</th>
              <th className="p-4 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingOrders.map((order) => (
              <tr key={order.id} className="hover:bg-purple-50">
                <td className="p-4 border">{order.fuel_type}</td>

                <td className="p-4 border">{order.quantity}</td>

                <td className="p-4 border">{order.address}</td>

                {/* Driver Dropdown */}
                <td className="p-4 border">
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={order.driver_id || ""}
                    onChange={(e) =>
                      handleAssignDriver(order.id, e.target.value)
                    }
                  >
                    <option value="">Select Driver</option>

                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Actions */}
                <td className="p-4 border">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(order.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(order.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManagement;
