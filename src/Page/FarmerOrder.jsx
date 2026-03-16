import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { toast, Toaster } from "react-hot-toast";

const FarmerOrder = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    fuelType: "Petrol",
    quantity: "",
    address: "",
    fuelPrice: 0,
  });

  const [fuelPrices, setFuelPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user info and fuel prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get logged in user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (userError) throw userError;

        if (userData) {
          setFormData((prev) => ({
            ...prev,
            name: userData.name,
            phone: userData.phone,
          }));
        }

        // Fetch fuel prices
        const { data: pricesData, error: pricesError } = await supabase
          .from("fuel_prices")
          .select("*");
        if (pricesError) throw pricesError;

        setFuelPrices(pricesData || []);

        // Set initial price for default fuel type
        const defaultFuel = pricesData?.find((f) => f.fuel_type === "Petrol");
        if (defaultFuel) {
          setFormData((prev) => ({ ...prev, fuelPrice: defaultFuel.price }));
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };

    fetchData();
  }, []);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFormData((prev) => ({
          ...prev,
          address: `Lat: ${lat}, Lng: ${lng}`,
        }));
      },
      () => alert("Unable to retrieve your location."),
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update fuelPrice when fuelType changes
    if (name === "fuelType") {
      const selectedFuel = fuelPrices.find((f) => f.fuel_type === value);
      setFormData((prev) => ({
        ...prev,
        fuelPrice: selectedFuel ? selectedFuel.price : 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase.from("orders").insert({
        farmer_id: user.id,
        fuel_type: formData.fuelType,
        quantity: parseFloat(formData.quantity),
        fuel_price: formData.fuelPrice,
        total_price: formData.fuelPrice * parseFloat(formData.quantity),
        status: "Pending",
        created_at: new Date(),
        address: formData.address,
      });

      if (error) throw error;
      toast.success("Order placed successfully!");

      // Reset form
      setFormData((prev) => ({
        ...prev,
        fuelType: "Petrol",
        quantity: "",
        address: "",
        fuelPrice: fuelPrices.find((f) => f.fuel_type === "Petrol")?.price || 0,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to place the order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Toaster />
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Place Your Fuel Order
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <div>
          <label className="block font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="w-full p-3 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            readOnly
            className="w-full p-3 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Fuel Type</label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            {fuelPrices.map((f) => (
              <option key={f.id} value={f.fuel_type}>
                {f.fuel_type} - ₹{f.price} per {f.unit}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Price per Unit</label>
          <input
            type="number"
            value={formData.fuelPrice}
            readOnly
            className="w-full p-3 border rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-3 border rounded"
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Delivery Address</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={detectCurrentLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Use Location
            </button>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="flex-1 p-3 border rounded"
              placeholder="Enter delivery address"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 w-full text-white py-3 rounded text-lg font-semibold hover:bg-green-600"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default FarmerOrder;
