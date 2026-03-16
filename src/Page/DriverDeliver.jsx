import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useUser } from "../Context/UserContext";

const DriverDeliver = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDriverOrders();
    }
  }, [user]);

  const fetchDriverOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          users!orders_farmer_id_fkey (
            name,
            phone
          )
        `,
        )
        .eq("driver_id", user.id)
        .ilike("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  const handleCompleteDelivery = async (order) => {
    try {
      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "Delivered" })
        .eq("id", order.id);

      if (updateError) throw updateError;

      // Insert delivery record (minimal columns)
      const { error: deliveryError } = await supabase
        .from("deliveries")
        .insert({
          order_id: order.id,
          co2_saved: order.quantity * 2,
          delivered_at: new Date().toISOString(),
        });

      if (deliveryError) throw deliveryError;

      await fetchDriverOrders();
    } catch (err) {
      console.error("Error completing delivery:", err.message);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-green-50 to-teal-100 min-h-screen">
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6 text-center">
        <h1 className="text-4xl font-bold">Driver Dashboard</h1>
        <p>Manage your assigned deliveries</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Assigned Orders</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Fuel</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No assigned orders.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-3 border">{order.users?.name || "N/A"}</td>
                  <td className="p-3 border">{order.fuel_type}</td>
                  <td className="p-3 border">{order.address || "N/A"}</td>
                  <td className="p-3 border">{order.quantity}</td>
                  <td className="p-3 border">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleCompleteDelivery(order)}
                    >
                      Mark Delivered
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverDeliver;
