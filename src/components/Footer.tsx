import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./footer.css"; // You can adjust the CSS classes here as needed

export const Footer = () => {
  const [email, setEmail] = useState(""); // State to store the email
  const [status, setStatus] = useState(""); // State to store subscription status message

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Simple validation for email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Subscription successful! Thank you.");
        setEmail(""); // Clear the email field after successful subscription
      } else {
        setStatus(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Media Links Section */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-600"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://youtube.com/@gaddiyalipodcast?si=uTpcgZ8pQr9DHDmi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="https://instagram.com/gaddiyalipodcast/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-500"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-lg font-medium mb-1">Subscribe to Email</p>
          <form
            onSubmit={handleSubscribe}
            className="flex items-center space-x-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-l-md border border-gray-300 text-black focus:outline-none"
              value={email}
              onChange={handleEmailChange}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              Subscribe
            </button>
          </form>
          {/* Display subscription status */}
          {status && <p className="text-sm mt-2">{status}</p>}
        </div>

        {/* Footer Bottom Section */}
        <div className="text-center text-sm">
          <p>
            Created by{" "}
            <Link
              to="https://rahulbhardwaj.com"
              target="_blank"
              className="text-blue-400 hover:text-blue-600 font-semibold"
            >
              Rahul Bhardwaj
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
