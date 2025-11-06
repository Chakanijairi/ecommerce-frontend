import React, { useEffect, useState, useRef } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import OrderStatus from "./components/OrderStatus"; 
import { products as productData } from "./data/products"; 
import axios from "axios";
import EditPage from "./components/EditPage";
import { useNavigate, Routes, Route } from "react-router-dom"; 

export default function App() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  // Load edited products if available, otherwise default
const savedProducts = JSON.parse(localStorage.getItem("editedProducts")) || productData;

  const cartRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(() => {    //new
  const saved = localStorage.getItem("editedProducts");
  return saved ? JSON.parse(saved) : productData;
});
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id) => {
    const product = products.find((p) => p.id === id); //new
    if (!product) return;

    const existing = cart.find((item) => item.id === id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);

      if (cart.length === 0) {
        setTimeout(() => {
          if (cartRef.current) {
            cartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 0);
      }
    }
  };

  const updateQty = (id, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const result = await axios.get(
          "https://ecommerce-backend-lxq0.onrender.com/api/order/orders"
        );
        console.log(result);
        setOrders(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAllOrders();
  }, []);

  useEffect(() => {       //NEW
  const handler = () => {
    const saved = localStorage.getItem("editedProducts");
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse editedProducts", err);
      }
    } else {
      setProducts(productData); // fallback
    }
  };

  window.addEventListener("productsUpdated", handler);
  return () => window.removeEventListener("productsUpdated", handler);
}, []);


  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="max-w-6xl mx-auto p-6">
            <header className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-3xl font-bold text-blue-600">
                Together by Shaw
              </h1>
              <nav className="hidden md:flex gap-6 text-blue-700">
                <a href="#about" className="hover:text-red-600">
                  About
                </a>
                <a href="#shop" className="hover:text-red-600">
                  Shop
                </a>
                <a href="#projects" className="hover:text-red-600">
                  Projects
                </a>
              </nav>

              <div className="p-2">
                <button className="fixed top-24 right-30 z-50 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Cart ({cart.reduce((sum, item) => sum + (item.qty || 0), 0)})
                </button>
              </div>
            </header>

            <section id="about" className="bg-black p-6 rounded-lg shadow mb-8">
              <h2 className="text-blue-600 text-2xl font-semibold mb-2">
                About
              </h2>
              <p className="text-blue-600">
                Together by Shaw is a fun and creative e-commerce platform built
                with passion for both technology and great design. We believe
                shopping should be more than just buying things, it should be an
                experience that connects people, inspires creativity, and brings
                communities together. Here, we aim to offer high-quality
                products that fit your modern lifestyle while giving you a
                smooth and enjoyable digital experience. Whether you’re looking
                for tech gear, gadgets, or stylish essentials, we’re here to
                make it simple, trustworthy, and exciting. At Together by Shaw,
                our goal is to blend innovation with connection, combining the
                best of technology, creativity, and community to make your
                online shopping journey truly special. 💙
              </p>
            </section>

            <div className="flex justify-end mb-4">
              <button
                onClick={() => navigate("/edit")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
              >
                Edit
              </button>
            </div>

            <section id="shop" className="scroll-mt-20 pt-4">
              <ProductList addToCart={addToCart} products={products} />
            </section>

            <div className="my-10" />

            <Cart
              ref={cartRef}
              cart={cart}
              updateQty={updateQty}
              removeFromCart={removeFromCart}
              total={total}
            />

            {cart.length > 0 && (
              <CheckoutForm total={total} clearCart={clearCart} />
            )}
          </div>
        }
      />

      <Route path="/order-status" element={<OrderStatus />} />
      <Route path="/edit" element={<EditPage />} />
    </Routes>
  );
}
