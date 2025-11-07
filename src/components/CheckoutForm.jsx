import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CheckoutForm({ total, clearCart, cart = [] }) {
  const navigate = useNavigate(); 
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const orderData = {
      name: form[0].value,
      email: form[1].value,
      phone: form[2].value,
      address: form[3].value,
      total,
      items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
    };

    try {
      const res = await apiClient.post("/order/createCheckout", orderData);
      
      if(res.data.status === 'success'){
       setIsLoading(true)

        setTimeout(() => {
          navigate("/order-status"); 
          setIsLoading(false)
          clearCart();
        },3000)
      }

      
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
        <p className="text-gray-700 mb-4">
          Please sign in or create an account to complete your purchase.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="bg-white p-6 rounded-lg shadow-md mt-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <input type="text" placeholder="Full Name" required className="border p-2 w-full mb-3 rounded" />
      <input type="email" placeholder="Email Address" required className="border p-2 w-full mb-3 rounded" />
      <input type="number" placeholder="Phone Number" required className="border p-2 w-full mb-3 rounded" />
      <input type="text" placeholder="Shipping Address" required className="border p-2 w-full mb-3 rounded" />
      <p className="text-right font-semibold mb-3">Total: ${total.toFixed(2)}</p>
      <button type="submit" className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
        {isLoading ? 'Please wait...' : 'Place Order'}
      </button>
    </form>
  );
}
