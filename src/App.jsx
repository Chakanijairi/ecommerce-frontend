import { useCallback, useEffect, useState, useRef } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import OrderStatus from "./components/OrderStatus";
import { products as productData } from "./data/products";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "./api/client";


export default function App() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const cartRef = useRef(null);

  const normaliseProduct = useCallback(
    (product) => ({
      id: product._id || product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl || "",
    }),
    []
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      ));
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
    const handler = () => {
      const saved = localStorage.getItem("editedProducts");
      if (saved) {
        try {
          setProducts(JSON.parse(saved));
        } catch (err) {
          console.error("Failed to parse editedProducts", err);
        }
      } else {
        setProducts(productData);
      }
    };

    window.addEventListener("productsUpdated", handler);
    return () => window.removeEventListener("productsUpdated", handler);
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);

    if (!token) {
      console.log("no token");
      return;
    }

    try {
      const { data } = await apiClient.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(data.map(normaliseProduct));
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unable to load products";
      setProductsError(message);
      console.log(message);
    } finally {
      setProductsLoading(false);
    }
  }, [normaliseProduct, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-100 text-gray-800 overflow-hidden">
              {/* Navbar */}
              <header className="fixed top-0 w-full glass-effect z-50 backdrop-blur-md shadow-lg">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-4">
                  <h1 className="text-3xl font-extrabold gradient-text-1 tracking-wide">
                    Together by Shaw
                  </h1>
                  <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
                    <a href="#about" className="hover:gradient-text-1">About</a>
                    <a href="#shop" className="hover:gradient-text-2">Shop</a>
                    <a href="#projects" className="hover:gradient-text-3">Projects</a>
                  </nav>
                  <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                      <>
                        <span className="text-sm font-medium text-indigo-600">{user?.name}</span>
                        {user?.role === "Admin" && (
                          <button
                            onClick={() => navigate("/admin")}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover-scale"
                          >
                            Admin
                          </button>
                        )}
                        <button
                          onClick={logout}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover-scale"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("/login")}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover-scale"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => navigate("/register")}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 text-white hover-scale"
                        >
                          Register
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => cartRef.current?.scrollIntoView({ behavior: "smooth" })}
                      className="relative px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover-scale"
                    >
                      🛒 Cart
                      <span className="absolute -top-2 -right-2 bg-pink-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.reduce((sum, item) => sum + (item.qty || 0), 0)}
                      </span>
                    </button>
                  </div>
                </div>
              </header>

              {/* Hero Section */}
              <section className="flex flex-col items-center justify-center text-center pt-40 pb-24 px-6 animate-fadeIn">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text-2 drop-shadow-lg">
                  Discover. Shop. Enjoy.
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mb-8">
                  Explore premium products crafted for your lifestyle — tech, creativity, and community combined.
                </p>
                <button
                  onClick={() => document.getElementById("shop").scrollIntoView({ behavior: "smooth" })}
                  className="px-10 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover-scale hover-glow"
                >
                  Start Shopping
                </button>
              </section>

              {/* About Section */}
              <section id="about" className="max-w-5xl mx-auto bg-white/70 glass-effect rounded-3xl p-10 mb-16 shadow-xl animate-fadeIn">
                <h2 className="text-3xl font-bold gradient-text-1 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  Together by Shaw is a vibrant e-commerce experience blending innovation and design.
                  We connect communities through creativity, offering high-quality products built for modern lifestyles.
                  Every purchase supports a vision where technology meets art and passion meets purpose. 💙
                </p>
              </section>

              {/* Shop Section */}
              <section id="shop" className="max-w-6xl mx-auto px-4 pb-10">
                <ProductList addToCart={addToCart} products={products} />
              </section>

              <div className="my-10" />

              {/* Cart Section */}
              <div ref={cartRef}>
                <Cart cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} total={total} />
              </div>

              {cart.length > 0 && (
                <CheckoutForm total={total} clearCart={clearCart} cart={cart} />
              )}

              {/* Footer */}
              <footer className="mt-16 text-center py-10 glass-effect border-t border-white/40">
                <p className="gradient-text-3 font-semibold">© 2025 Together by Shaw. All Rights Reserved.</p>
                <div className="flex justify-center gap-6 mt-4 text-gray-500">
                  <a href="#" className="hover:gradient-text-1">Facebook</a>
                  <a href="#" className="hover:gradient-text-2">Instagram</a>
                  <a href="#" className="hover:gradient-text-3">Twitter</a>
                </div>
              </footer>
            </div>
          }
        />

        <Route path="/order-status" element={<OrderStatus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
