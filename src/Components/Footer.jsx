import { Fuel } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text">
                Hindustan Petroleum Corporation Limited, India
              </span>
            </div>
            <p className="text-gray-600">
              Making fuel delivery simple, fast, and eco-friendly.
            </p>
          </div>
          {[
            {
              title: "Company",
              links: ["About", "Careers", "Press", "Blog"]
            },
            {
              title: "Services",
              links: ["Personal", "Business", "Fleet", "Industrial"]
            },
            {
              title: "Support",
              links: ["Help Center", "Safety", "Terms", "Privacy"]
            }
          ].map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-12 pt-8 text-center text-gray-600">
          <p>© 2024 FuelFast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}