import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const FuelPrices = () => {
  const [prices, setPrices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    fuel_type: "",
    price: "",
    unit: "liter",
    location: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const ORDERS_PER_PAGE = 5;

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    console.log("🔄 Loading all data...");
    setLoading(true);

    try {
      // 1. Fuel prices
      console.log("📊 Loading fuel_prices...");
      const { data: pricesData, error: pricesError } = await supabase
        .from("fuel_prices")
        .select("*");

      if (pricesError) {
        console.error("❌ fuel_prices error:", pricesError);
        alert("Fuel prices error: " + pricesError.message);
      } else {
        console.log("✅ Fuel prices:", pricesData);
        setPrices(pricesData || []);
      }

      // 2. Orders first page
      await loadOrdersPage(0);
    } catch (error) {
      console.error("❌ Load all error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersPage = async (page = 0) => {
    console.log(`📦 Loading orders page ${page}...`);
    setOrdersLoading(true);

    try {
      const from = page * ORDERS_PER_PAGE;
      const to = from + ORDERS_PER_PAGE - 1;

      const {
        data: ordersData,
        error: ordersError,
        count,
      } = await supabase
        .from("orders")
        .select("*, users!orders_farmer_id_fkey(name)")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (ordersError) {
        console.error("❌ Orders error:", ordersError);
        return;
      }

      console.log("✅ Orders loaded:", ordersData?.length || 0);

      // Append if not first page
      if (page === 0) {
        setOrders(ordersData || []);
      } else {
        setOrders((prev) => [...prev, ...(ordersData || [])]);
      }
    } catch (error) {
      console.error("Load orders error:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("fuel_prices")
          .update(form)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fuel_prices").insert([form]);
        if (error) throw error;
      }

      setForm({ fuel_type: "", price: "", unit: "liter", location: "" });
      setEditingId(null);
      loadAllData(); // Refresh everything
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (price) => {
    setForm(price);
    setEditingId(price.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this price?")) return;
    try {
      await supabase.from("fuel_prices").delete().eq("id", id);
      loadAllData();
    } catch (error) {
      alert("Delete error");
    }
  };

  const hasMoreOrders = true; // Always show load more for demo

  return (
    <div className="bg-gradient-to-br from-blue-50 to-emerald-50 px-10 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Fuel Prices */}
        <section>
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Fuel Prices
          </h2>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 p-8 bg-gray-50 rounded-2xl"
            >
              <input
                name="fuel_type"
                placeholder="Fuel Type"
                value={form.fuel_type}
                onChange={handleChange}
                className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="price"
                type="number"
                step="0.1"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="p-4 border rounded-xl"
              >
                <option value="liter">Liter</option>
                <option value="kg">KG</option>
              </select>
              <input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="p-4 border rounded-xl focus:ring-2 focus:ring-teal-500"
                required
              />
              <button
                type="submit"
                className="md:col-span-4 bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all"
              >
                {editingId ? "Update" : "Add Price"}
              </button>
            </form>

            {/* Prices Table */}
            <div className="overflow-x-auto">
              <table className="w-full rounded-2xl overflow-hidden shadow-inner">
                <thead className="bg-gradient-to-r from-blue-100 to-emerald-100">
                  <tr>
                    <th className="p-6 font-bold text-lg text-gray-800">
                      Fuel Type
                    </th>
                    <th className="p-6 font-bold text-lg text-gray-800 text-right">
                      Price
                    </th>
                    <th className="p-6 font-bold text-lg text-gray-800">
                      Unit
                    </th>
                    <th className="p-6 font-bold text-lg text-gray-800">
                      Location
                    </th>
                    <th className="p-6 font-bold text-lg text-gray-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price) => (
                    <tr
                      key={price.id}
                      className="hover:bg-gray-50 border-b hover:border-blue-200"
                    >
                      <td className="p-6 font-bold text-lg">
                        {price.fuel_type}
                      </td>
                      <td className="p-6 text-right">
                        <span className="text-3xl font-black text-emerald-600">
                          ₹{price.price}
                        </span>
                      </td>
                      <td className="p-6 font-semibold text-lg">
                        {price.unit}
                      </td>
                      <td className="p-6">
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {price.location}
                        </span>
                      </td>
                      <td className="p-6">
                        <button
                          onClick={() => handleEdit(price)}
                          className="mr-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(price.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Orders Table */}
        <section>
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Fuel Orders ({orders.length})
          </h2>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100">
            <div className="flex justify-between mb-8">
              <div></div>
              <button
                onClick={() => loadOrdersPage(0)}
                disabled={ordersLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all disabled:opacity-50"
              >
                {ordersLoading ? "Loading..." : "Refresh Orders"}
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 rounded-2xl bg-gray-50">
                <p className="text-2xl text-gray-500 font-semibold mb-2">
                  No orders
                </p>
                <p className="text-gray-400">
                  Orders appear here automatically
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl shadow-inner border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                      <th className="border-b p-6 text-left font-bold text-lg text-gray-700">
                        Fuel
                      </th>
                      <th className="border-b p-6 text-left font-bold text-lg text-gray-700">
                        Price
                      </th>
                      <th className="border-b p-6 text-left font-bold text-lg text-gray-700">
                        Customer
                      </th>
                      <th className="border-b p-6 text-right font-bold text-lg text-gray-700">
                        Quantity
                      </th>
                      <th className="border-b p-6 text-left font-bold text-lg text-gray-700">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const price = prices.find(
                        (p) => p.fuel_type === order.fuel_type,
                      );
                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 border-b"
                        >
                          <td className="p-6 font-bold text-lg">
                            {order.fuel_type}
                          </td>
                          <td className="p-6">
                            <span className="font-bold text-emerald-600">
                              ₹{price?.price}/{price?.unit}
                            </span>
                          </td>
                          <td className="p-6 font-semibold">
                            {order.users?.name || "N/A"}
                          </td>
                          <td className="p-6 text-right font-bold text-2xl text-emerald-600">
                            {order.quantity}
                          </td>
                          <td className="p-6 text-gray-700">{order.address}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <button
                onClick={() => loadOrdersPage(ordersPage + 1)}
                disabled={ordersLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-16 py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {ordersLoading ? "Loading..." : "Load More Orders"}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Showing {orders.length} orders
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FuelPrices;
