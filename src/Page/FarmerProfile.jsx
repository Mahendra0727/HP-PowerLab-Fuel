import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const FarmerProfile = () => {
  const [pastOrders, setPastOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      const formatted = data.map((order) => ({
        date: new Date(order.created_at).toLocaleDateString(),
        type: order.fuel_type,
        quantity: order.quantity,
        cost: order.quantity * order.fuel_price,
      }));

      setPastOrders(formatted);
    }
  };

  const dates = pastOrders.map((order) => order.date);
  const quantities = pastOrders.map((order) => order.quantity);
  const costs = pastOrders.map((order) => order.cost);

  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: "Fuel Usage (Quantity)",
        data: quantities,
        borderColor: "#34d399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: dates,
    datasets: [
      {
        label: "Fuel Cost",
        data: costs,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen font-sans">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-green-600 mb-2">
          Farmer Profile
        </h1>
        <p className="text-gray-500">
          Manage your orders and track your fuel usage with ease.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Past Orders</h2>

        <table className="min-w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-blue-400 text-white">
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Quantity (Liters)</th>
              <th className="p-3 border">Cost (₹)</th>
            </tr>
          </thead>

          <tbody>
            {pastOrders.map((order, index) => (
              <tr
                key={index}
                className={`hover:bg-blue-100 ${index % 2 === 0 ? "bg-blue-50" : ""}`}
              >
                <td className="p-3 border">{order.date}</td>
                <td className="p-3 border">{order.type}</td>
                <td className="p-3 border">{order.quantity}</td>
                <td className="p-3 border">{order.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Fuel Usage Over Time
          </h2>
          <Line data={lineChartData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Fuel Cost Over Time
          </h2>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
