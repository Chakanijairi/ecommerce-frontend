import React from "react";
import { UPLOAD } from "../api/client";

const ProductCard = ({ name, price, description, image, onAddToCart }) => {
  const img = image.split("/").pop()
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img src={UPLOAD + img} alt={name} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <p className="text-blue-600 font-bold text-lg mt-2">${price}</p>

        <button
          onClick={onAddToCart}
          className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

