import React from "react";
import { UPLOAD } from "../api/client";

const ProductCard = ({ name, price, description, image, onAddToCart }) => {
  const img = image.split("/").pop();

  return (
    <div className="glass-effect hover-scale rounded-3xl overflow-hidden animate-fadeIn hover-glow shadow-lg transition-all">
      <div className="gradient-border">
        <div className="relative group">
          <img
            src={UPLOAD + img}
            alt={name}
            className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-semibold shadow-lg animate-float">
              🌈 Trending
            </span>
          </div>
        </div>

        <div className="p-6 relative">
          <h2 className="text-xl font-semibold gradient-text-2 mb-1">{name}</h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold gradient-text-3">${price}</p>
            <button
              onClick={onAddToCart}
              className="relative px-6 py-2.5 rounded-full overflow-hidden text-white font-semibold shadow-md group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></span>
              <span className="relative flex items-center gap-2">
                Add to Cart
                <svg
                  className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
