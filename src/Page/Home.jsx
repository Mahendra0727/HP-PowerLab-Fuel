import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import { ArrowRight, Droplet, Timer, Wallet } from "lucide-react";
import { Car, Factory, Truck } from "lucide-react";
import { supabase } from "../utils/supabaseClient";

const services = [
  {
    icon: Car,
    title: "Personal Vehicles",
    description: "Convenient fuel delivery for your car at home or work",
  },
  {
    icon: Truck,
    title: "Fleet Services",
    description: "Bulk fuel delivery for commercial vehicle fleets",
  },
  {
    icon: Factory,
    title: "Industrial Supply",
    description: "Regular fuel supply for industrial equipment and generators",
  },
  {
    icon: Droplet,
    title: "Emergency Delivery",
    description: "24/7 emergency fuel delivery when you need it most",
  },
];

const steps = [
  {
    title: "Select Your Fuel",
    description: "Choose from our range of high-quality fuels",
  },
  {
    title: "Schedule Delivery",
    description: "Pick a convenient time slot for delivery",
  },
  {
    title: "Track Real-time",
    description: "Monitor your delivery status live",
  },
  {
    title: "Secure Payment",
    description: "Pay securely after successful delivery",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleOrder = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />
        <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Fuel Delivery at Your
                <span className="bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text">
                  {" "}
                  Doorstep
                </span>
              </h1>

              <p className="text-2xl text-gray-600 mb-8">
                Skip the gas station queues. Get fuel delivered to your
                location, whenever you need it.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleOrder}
                  className="flex justify-center gap-2 items-center shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold border-2 rounded-full px-6 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all"
                >
                  Order Now
                </button>

                <button className="bg-white shadow-xl font-bold px-6 py-3 hover:scale-110 transition-transform duration-300 ease-in-out rounded-full">
                  View Pricing
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Timer, text: "Fast Delivery" },
                  { icon: Wallet, text: "Best Prices" },
                  { icon: Droplet, text: "Premium Quality" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center px-3 py-5 rounded-xl bg-gradient-to-r from-blue-300 to-green-300"
                  >
                    <div className="text-center">
                      <item.icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                      <span className="text-lg font-medium">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-green-500/30 rounded-3xl transform rotate-3" />
              <img
                src="/truck.jpeg"
                alt="Fuel Delivery"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Choose from our range of fuel delivery services tailored to your
              needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-[3px] rounded-2xl bg-gradient-to-r from-blue-300 to-green-300"
              >
                <div className="bg-white h-full rounded-2xl p-6 text-center">
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-full p-4 inline-block mb-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">
                    {service.title}
                  </h3>

                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 text-2xl max-w-2xl mx-auto">
              Get your fuel delivered in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>

            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust us for their fuel
              needs
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleOrder}
                className="bg-white flex px-4 py-3 rounded-xl text-blue-600 hover:bg-gray-100"
              >
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
