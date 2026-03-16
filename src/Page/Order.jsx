import React from "react";
import { useNavigate } from "react-router-dom";

export default function Ordering() {
  const navigate = useNavigate();

  const products = [
    {
      name: "Petrol",
      image:
        "https://th.bing.com/th/id/OIP.RNlfXkgSijBJx2zufMYULgAAAA?rs=1&pid=ImgDetMain",
    },
    {
      name: "Diesel",
      image:
        "https://thumbs.dreamstime.com/b/historic-green-yellow-fuel-dispenser-diesel-petrol-german-text-blasenfrei-zapfen-engl-refuel-bubbles-historic-133050492.jpg",
    },
    {
      name: "LPG",
      image:
        "https://cdn2.adrianflux.co.uk/wp-fluxposure/uploads/2022/08/lpg-car-nozzle.jpeg",
    },
    {
      name: "Empty Cans",
      image: "https://m.media-amazon.com/images/I/71mm5ddz-CL.jpg",
    },
    {
      name: "Cylinders",
      image:
        "https://5.imimg.com/data5/MX/PE/KU/GLADMIN-9819795/ori-500x500.jpeg",
    },
  ];

  const handleOrder = (product) => {
    navigate("/farmer-order", { state: { fuelType: product } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Our Products and Services
        </h1>
        <p className="text-lg text-gray-600">
          On-demand Fuel Delivery Services and Fuel Storage Solutions.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h2>

              <p className="text-gray-600 mb-4">
                Get high quality {product.name} delivered directly to your
                location safely and quickly.
              </p>

              <button
                onClick={() => handleOrder(product.name)}
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
