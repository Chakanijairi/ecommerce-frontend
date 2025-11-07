import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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

  const cartRef = useRef(null);
  // const [products, setProducts] = useState(() => {
  //   const saved = localStorage.getItem("editedProducts");
  //   return saved ? JSON.parse(saved) : productData;
  // });
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

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
    
    if(!token) {
      console.log('no token')
      return;
    }

    
    try {
      const { data } = await apiClient.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data)
      setProducts(data.map(normaliseProduct));
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unable to load products";
      setProductsError(message);
      console.log(message)
      // toast.error(message);
    } finally {
      setProductsLoading(false);
    }
  }, [normaliseProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss={false} pauseOnHover theme="colored" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-6xl mx-auto p-6">
              <header className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-blue-600">
                  Together by Shaw
                </h1>
                <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                      <>
                        <span className="text-sm text-blue-700">{user?.name}</span>
                        {user?.role === "Admin" && (
                          <button
                            onClick={() => navigate("/admin")}
                            className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition"
                          >
                            Admin
                          </button>
                        )}
                        <button
                          onClick={logout}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("/login")}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => navigate("/register")}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                        >
                          Register
                        </button>
                      </>
                    )}
                  </div>
                  <div className="p-2">
                    <button className="fixed top-24 right-30 z-50 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                      Cart ({cart.reduce((sum, item) => sum + (item.qty || 0), 0)})
                    </button>
                  </div>
                </div>
              </header>

              <section id="about" className="bg-black p-6 rounded-lg shadow mb-8">
                <h2 className="text-blue-600 text-2xl font-semibold mb-2">
                  About
                </h2>
                <p className="text-white">
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
                <CheckoutForm total={total} clearCart={clearCart} cart={cart} />
              )}
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
