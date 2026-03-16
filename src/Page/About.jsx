// Import necessary modules
import React from "react";

const AboutPage = () => {
  return (
<>
  
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-200 flex flex-col items-center p-8">
      <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About Us</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Welcome to Hindustan Petroleum's Farmer's Portal! Our mission is to empower the farming community by providing a seamless solution for fuel ordering. 
          We understand the challenges you face daily, and our platform is designed to ensure you can focus on what you do best—feeding the nation.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Our Mission */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Our Mission</h2>
            <p className="text-gray-600">
              To provide farmers with easy access to fuel, optimize delivery times, and reduce operational inefficiencies, ensuring smooth agricultural operations.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Our Vision</h2>
            <p className="text-gray-600">
              A future where technology bridges the gap between essential resources and the agricultural community, driving sustainability and growth.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Why Choose Us?</h2>
            <ul className="text-gray-600 list-disc list-inside">
              <li>Quick and reliable fuel ordering process</li>
              <li>Transparent pricing</li>
              <li>Real-time delivery tracking</li>
              <li>User-friendly platform</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Contact Us</h2>
            <p className="text-gray-600">
              Got questions or feedback? Reach out to our support team at <a href="mailto:support@hindustanpetroleum.com" className="text-blue-500 underline">support@hindustanpetroleum.com</a>.
            </p>
          </div>
        </div>

        

        <footer className="mt-12 text-gray-500">
          © {new Date().getFullYear()} Hindustan Petroleum. All rights reserved.
        </footer>
      </div>
    </div>
    </>
  );
};

export default AboutPage;
