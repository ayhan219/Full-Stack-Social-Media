import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-10 relative z-10">
      <div className="container mx-auto flex flex-col items-center md:flex-row md:justify-between">
        
        {/* Footer Logo / Title */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl font-bold">Social Media</h1>
        </div>

        {/* Footer Links */}
        <div className="mb-6 md:mb-0">
          <ul className="flex space-x-8">
            <li><a href="#" className="hover:text-gray-400 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-gray-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-gray-400 transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-gray-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-6">
          <a href="#" aria-label="Facebook" className="hover:text-gray-400 transition-colors">
            <FaFacebook size={24} />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-gray-400 transition-colors">
            <FaTwitter size={24} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-gray-400 transition-colors">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        © 2024 Social Media. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
