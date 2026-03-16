import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingOrders: 0,
    deliveryPending: 0, // ✅ Approved orders
    co2Saved: 0,
  });

  const [participationData, setParticipationData] = useState({
    labels: [],
    datasets: [],
  });

  const [biofuelProductionData, setBiofuelProductionData] = useState({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Stats
      const [
        { count: deliveredCount },
        { count: pendingCount },
        { count: approvedCount },
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "Delivered"),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "Pending"),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "Approved"),
      ]);

      // CO2 from delivered orders quantity
      const { data: deliveredOrders } = await supabase
        .from("orders")
        .select("quantity")
        .eq("status", "Delivered");
      const totalQuantity =
        deliveredOrders?.reduce((sum, o) => sum + (o.quantity || 0), 0) || 0;
      const co2Saved = totalQuantity * 2;

      setStats({
        totalDeliveries: deliveredCount || 0,
        pendingOrders: pendingCount || 0,
        deliveryPending: approvedCount || 0, // ✅ Delivery Pending
        co2Saved: Math.round(co2Saved),
      });

      // Charts data
      setParticipationData({
        labels: ["Delivered", "Pending", "Delivery Pending"], // ✅ Approved included
        datasets: [
          {
            label: "Orders",
            data: [deliveredCount || 0, pendingCount || 0, approvedCount || 0],
            backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722"],
          },
        ],
      });

      // Production trend (recent orders)
      const { data: recentOrders } = await supabase
        .from("orders")
        .select("created_at, quantity")
        .gte("created_at", "2026-01-01")
        .order("created_at")
        .limit(6);

      const months = {};
      recentOrders?.forEach((order) => {
        const month = new Date(order.created_at).toLocaleDateString("en-US", {
          month: "short",
        });
        months[month] = (months[month] || 0) + (order.quantity || 0);
      });

      setBiofuelProductionData({
        labels: Object.keys(months),
        datasets: [
          {
            label: "Biofuel Production",
            data: Object.values(months),
            fill: false,
            borderColor: "#4CAF50",
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-100 min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-100 min-h-screen font-sans">
      {/* Page Header - EXACT SAME */}
      <div className="bg-gradient-to-r from-blue-500 via-teal-600 to-green-600 text-white p-8 rounded-lg shadow-lg mb-6 text-center">
        <h1 className="text-5xl font-extrabold mb-3">Admin Dashboard</h1>
        <p className="text-xl">
          Track and manage cooperative performance and environmental impact.
        </p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 bg-white text-teal-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 shadow-md"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards - EXACT SAME LAYOUT + Delivery Pending */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-md transition-all">
          <h3 className="text-2xl font-semibold text-blue-600">
            Total Deliveries
          </h3>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.totalDeliveries}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-md transition-all">
          <h3 className="text-2xl font-semibold text-blue-600">
            Pending Orders
          </h3>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {stats.pendingOrders}
          </p>
        </div>
        {/* ✅ NEW: Delivery Pending Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-md transition-all">
          <h3 className="text-2xl font-semibold text-blue-600">
            Delivery Pending
          </h3>
          <p className="text-4xl font-bold text-orange-500 mt-2">
            {stats.deliveryPending}
          </p>
          <small className="text-gray-500 block">(Approved)</small>
        </div>
      </div>

      {/* Charts Section - EXACT SAME */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-md transition-all">
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Order Status Distribution
          </h3>
          <Pie data={participationData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-md transition-all">
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Production Trend
          </h3>
          <Line data={biofuelProductionData} />
        </div>
      </div>

      {/* Environmental Impact - EXACT SAME */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-md transition-all">
        <h3 className="text-2xl font-bold text-teal-600 mb-4">
          Environmental Impact
        </h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-sm font-medium text-green-600">
              CO2 Saved
            </span>
            <span className="text-sm font-medium text-green-600">
              {stats.co2Saved} kg
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
            <div
              style={{
                width: `${Math.min((stats.co2Saved / 5000) * 100, 100)}%`,
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            />
          </div>
          <span className="text-sm text-gray-600">Goal: 5000 kg</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
