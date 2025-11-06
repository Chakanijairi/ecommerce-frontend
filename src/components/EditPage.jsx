import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { products as initialProducts } from "../data/products";
import { reserveProducts as initialReserveProducts } from "../data/reserve";


export default function EditPage() {
  const navigate = useNavigate();

  // Load shop products (check localStorage first)
  const [shopProducts, setShopProducts] = useState(() => {
    const saved = localStorage.getItem("editedProducts");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Load reserve products (editable)
  const [reserveProducts, setReserveProducts] = useState(() => {
  const saved = localStorage.getItem("reserveProducts");
  return saved
    ? JSON.parse(saved)
    : initialReserveProducts.map((p) => ({ ...p })); // copy objects
});

  // ===== Handlers =====
  const handleRemove = (id) => {
  setShopProducts((prev) => {
    const removedItem = prev.find((item) => item.id === id);
    if (removedItem) {
      // Move back to reserve only if it's not already there
      setReserveProducts((reservePrev) => {
        const alreadyInReserve = reservePrev.some((p) => p.id === id);
        if (!alreadyInReserve) {
          return [...reservePrev, removedItem];
        }
        return reservePrev;
      });
    }
    // Remove from shop
    return prev.filter((item) => item.id !== id);
  });
};


  const handleAdd = (product) => {
  setShopProducts((prev) => {
    const alreadyInShop = prev.some((p) => p.id === product.id);
    if (alreadyInShop) {
      alert("Product already exists in the shop!");
      return prev;
    }

    // Remove it from reserve when added to shop
    setReserveProducts((reservePrev) =>
      reservePrev.filter((p) => p.id !== product.id)
    );

    return [...prev, product];
  });
};

  const handleEditReserve = (id, field, value) => { //NEW
  setReserveProducts((prev) =>
    prev.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    )
  );
};



  const handleSave = () => {
    localStorage.setItem("editedProducts", JSON.stringify(shopProducts));
    localStorage.setItem("reserveProducts", JSON.stringify(reserveProducts));

    window.dispatchEvent(new Event("productsUpdated"));
    alert("Changes saved successfully! Returning to homepage...");
    setTimeout(() => navigate("/"), 700);
  };

  // ===== UI =====
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen rounded-lg shadow-lg mt-10">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Make Some Adjustments ✏️
      </h1>

      {/* ===== SHOP PRODUCTS SECTION ===== */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          🛒 Current Shop Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto max-h-[500px] p-2">
          {shopProducts.length > 0 ? (
            shopProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600 transition"
                >
                  ✕
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-blue-600 font-bold mt-2">${product.price}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No products in the shop — add from reserves below!
            </p>
          )}
        </div>
      </section>

      {/* ===== RESERVE PRODUCTS SECTION ===== */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          🔄 Reserve Products (Editable)
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {reserveProducts.map((product) => (
            <div
              key={product.id + "-reserve"}
              className="flex-none w-72 bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />

              {/* Editable Fields */}
              <label className="text-xs text-gray-500">Name</label>
              <input
                type="text"
                value={product.name || ""}
                onChange={(e) =>
                  handleEditReserve(product.id, "name", e.target.value)
                }
                className="w-full border rounded p-1 mb-2 text-sm"
              />

              <label className="text-xs text-gray-500">Description</label>
              <textarea
                value={product.description || ""}
                onChange={(e) =>
                  handleEditReserve(product.id, "description", e.target.value)
                }
                className="w-full border rounded p-1 mb-2 text-sm"
              />

              <label className="text-xs text-gray-500">Price</label>
              <input
                type="number"
                value={product.price || ""}
                onChange={(e) =>
                  handleEditReserve(
                    product.id,
                    "price",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full border rounded p-1 mb-2 text-sm"
              />
              <button
                onClick={() => handleAdd(product)}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SAVE & BACK BUTTONS ===== */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Changes
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
