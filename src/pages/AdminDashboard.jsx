import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { UPLOAD } from "../api/client";

const PAGE_SIZE = 5;

const emptyProduct = {
  id: "",
  name: "",
  description: "",
  price: "",
  imageUrl: "",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState("add");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [productSaving, setProductSaving] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);

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

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      if(!token) {
        console.log('no token')
        return;
      }
      
      try {
        const { data } = await apiClient.get("/order/orders", {
          Authorization: `Bearer ${token}`,
        });
        setOrders(data);
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Unable to load orders";
        setError(message);
        // toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
        Authorization: `Bearer ${token}`,
      });
      setProducts(data.map(normaliseProduct));
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unable to load products";
      setProductsError(message);
      // toast.error(message);
    } finally {
      setProductsLoading(false);
    }
  }, [normaliseProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const safeTotalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
    if (currentPage > safeTotalPages) {
      setCurrentPage(safeTotalPages);
    }
  }, [orders, currentPage]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, currentPage]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  const openAddProductModal = () => {
    setProductModalMode("add");
    setProductForm(emptyProduct);
    setSelectedImageFile(null);
    setProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setProductModalMode("edit");
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price !== undefined ? String(product.price) : "",
      imageUrl: product.imageUrl || "",
    });
    setSelectedImageFile(null);
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setProductForm(emptyProduct);
    setSelectedImageFile(null);
  };

  const handleProductChange = (event) => {
    const { name, value } = event.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setProductForm((prev) => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setProductSaving(true);

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    }

    try {
      if (productModalMode === "edit") {
        const { data } = await apiClient.put(`/products/${productForm.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updatedProduct = normaliseProduct(data.product);
        setProducts((prev) =>
          prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
        );
        toast.success("Product updated successfully");
      } else {
        const { data } = await apiClient.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const createdProduct = normaliseProduct(data.product);
        setProducts((prev) => [createdProduct, ...prev]);
        toast.success("Product added successfully");
      }

      closeProductModal();
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to save product";
      toast.error(message);
    } finally {
      setProductSaving(false);
    }
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeletingProduct(true);
    try {
      await apiClient.delete(`/products/${productToDelete.id}`);
      setProducts((prev) => prev.filter((product) => product.id !== productToDelete.id));
      toast.success("Product deleted");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to delete product";
      toast.error(message);
    } finally {
      setDeletingProduct(false);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 gap-6 sticky top-0 h-screen">
        <div>
          <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
          <p className="text-blue-200 text-sm">Manage store activity</p>
        </div>
        <nav className="flex flex-col gap-3 text-sm">
          <a href="#overview" className="hover:text-blue-200 transition">Overview</a>
          <a href="#orders" className="hover:text-blue-200 transition">Recent Orders</a>
          <a href="#products" className="hover:text-blue-200 transition">Products</a>
        </nav>
        <div className="mt-auto flex flex-col gap-3 text-sm">
          <span className="text-sm text-blue-200">{user?.name}</span>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-blue-900 font-medium py-2 rounded-md hover:bg-blue-100 transition"
          >
            Back to Store
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white font-medium py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <section id="overview" className="bg-white rounded-lg shadow p-6 flex flex-wrap gap-6">
          <div className="flex-1 min-w-[220px] border border-blue-100 rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Total Orders</h3>
            <p className="text-3xl font-semibold text-blue-700">{orders.length}</p>
          </div>
          <div className="flex-1 min-w-[220px] border border-blue-100 rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-semibold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="flex-1 min-w-[220px] border border-blue-100 rounded-lg p-4">
            <h3 className="text-sm text-gray-500">Published Products</h3>
            <p className="text-3xl font-semibold text-purple-600">{products.length}</p>
          </div>
        </section>

        <section id="orders" className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          </div>
          {loading && <p className="text-gray-600">Loading orders...</p>}
          {/* {error && <p className="text-red-600">{error}</p>} */}
          {!loading && !error && orders.length === 0 && (
            <p className="text-gray-600">No orders found.</p>
          )}

          <div className="overflow-x-auto">
            {paginatedOrders.length > 0 && (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Placed At</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 odd:bg-gray-50">
                      <td className="px-4 py-2">{order.name || "-"}</td>
                      <td className="px-4 py-2">{order.email || "-"}</td>
                      <td className="px-4 py-2">{order.phone || "-"}</td>
                      <td className="px-4 py-2">${Number(order.total || 0).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {orders.length > PAGE_SIZE && (
            <div className="flex justify-end items-center gap-4 mt-4 text-sm">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="px-3 py-1 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="px-3 py-1 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>

        <section id="products" className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Products</h2>
              <span className="text-sm text-gray-500">Total {products.length}</span>
            </div>
            <button
              onClick={openAddProductModal}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Add Product
            </button>
          </div>
          {productsLoading && <p className="text-gray-600">Loading products...</p>}
          {/* {productsError && <p className="text-red-600">{productsError}</p>} */}
          <div className="overflow-x-auto">
            {products.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const img = product.imageUrl.split("/").pop()
                    return (
                      <tr key={product.id} className="border-b border-gray-200 odd:bg-gray-50">
                      <td className="px-4 py-2 font-medium flex items-center gap-3">
                        {product.imageUrl && (
                          <img
                            src={UPLOAD + img}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        {product.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 max-w-[320px]">
                        {product.description}
                      </td>
                      <td className="px-4 py-2">${Number(product.price || 0).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditProductModal(product)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteProduct(product)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              !productsLoading && <p className="text-gray-600">No products available.</p>
            )}
          </div>
        </section>
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {productModalMode === "edit" ? "Edit Product" : "Add Product"}
              </h3>
              <button onClick={closeProductModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleProductSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleProductChange}
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleProductChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductFileChange}
                  className="w-full"
                />
                {productForm.imageUrl && (
                  <img
                    src={productForm.imageUrl}
                    alt="Preview"
                    className="mt-3 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productSaving}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {productSaving
                    ? "Saving..."
                    : productModalMode === "edit"
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 space-y-4">
            <h3 className="text-xl font-semibold text-red-600">Delete Product</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-medium">{productToDelete.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deletingProduct}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deletingProduct ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

