import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "./ThemeContext"; // Use ThemeContext
import { Sun, Moon, LogOut, Clock, Heart, Search } from "lucide-react";
import { Menu as HeadlessMenu } from "@headlessui/react";
import { auth } from "../lib/firebase";
import { AuthModal } from "./AuthModal";

export const Navbar = () => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useTheme(); // Access theme context
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu state
  const [searchQuery, setSearchQuery] = useState(""); // Track search query

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDonationClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 50000 }), // Example: Rs. 500
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to create order. Please try again later."
        );
      }

      const order = await response.json();
      console.log("Backend response:", order); // Log the response to check its contents

      if (!order || !order.orderId) {
        throw new Error(
          "Invalid order details received. Please try again later."
        );
      }

      const options = {
        key: "rzp_test_v5vyoGfVzHPkmz", // Replace with your actual Razorpay key
        amount: order.amount, // Ensure amount is correct
        currency: "INR",
        name: "Gaddiyali Podcast",
        description: "Donation for Gaddiyali Podcast",
        image: "/logo.png",
        order_id: order.orderId, // Use the orderId from the backend
        handler: (response: any) => {
          console.log("Payment successful!", response);
          alert("Thank you for your donation!");
        },
        prefill: {
          name: user?.displayName || "Anonymous",
          email: user?.email || "",
          contact: "7807251467", // Ideally, use dynamic data
        },
        theme: {
          color: "#6366f1",
        },
      };

      // Check if Razorpay is loaded before proceeding
      if (typeof window !== "undefined" && window.Razorpay) {
        const razorpay = new window.Razorpay(options); // Use Razorpay global object
        razorpay.open(); // Open the Razorpay payment modal
      } else {
        alert("Razorpay script is not loaded. Please try again later.");
      }
    } catch (error: any) {
      console.error("Donation error:", error);
      alert(error.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Branding */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 sm:text-xl md:text-2xl sm:leading-tight sm:text-center">
                GA PA
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="outline-none bg-transparent text-sm text-gray-600 dark:text-gray-400 flex-grow"
            />
          </div>

          {/* Right-side actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {user ? (
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button
                  className="flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu on avatar click
                >
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.displayName}`
                    }
                    alt={user.displayName || ""}
                    className="w-8 h-8 rounded-full"
                  />
                </HeadlessMenu.Button>

                {isMenuOpen && ( // Only show menu when isMenuOpen is true
                  <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                          >
                            Profile
                          </Link>
                        )}
                      </HeadlessMenu.Item>
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <Link
                            to="/watch-later"
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                          >
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Watch Later
                            </div>
                          </Link>
                        )}
                      </HeadlessMenu.Item>

                      {/* Dark Mode Toggle Item */}
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={toggleTheme}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 flex items-center`}
                          >
                            {isDarkMode ? (
                              <Sun className="w-4 h-4 text-indigo-600 text-gray-700 dark:text-gray-200 mr-2" />
                            ) : (
                              <Moon className="w-4 h-4 text-indigo-600 text-gray-700 dark:text-gray-200 mr-2" />
                            )}
                            Toggle Theme
                          </button>
                        )}
                      </HeadlessMenu.Item>

                      {/* Donation Button Item */}
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleDonationClick}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 flex items-center`}
                            title="Make a Donation"
                          >
                            <Heart className="w-4 h-4 text-indigo-600 text-gray-700 dark:text-gray-200 mr-2" />{" "}
                            Donate
                          </button>
                        )}
                      </HeadlessMenu.Item>

                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                          >
                            <div className="flex items-center">
                              <LogOut className="w-4 h-4 mr-2" />
                              Sign Out
                            </div>
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </div>
                  </HeadlessMenu.Items>
                )}
              </HeadlessMenu>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};
