import React, { forwardRef } from "react";

const Cart = forwardRef(({ cart, updateQty, removeFromCart, total }, ref) => {
  if (!cart.length) return null;

  return (
    <div ref={ref} className="glass-effect p-8 rounded-3xl animate-fadeIn rainbow-border">
      <h2 className="text-3xl font-bold mb-6 gradient-text-1">Shopping Cart</h2>
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b border-gray-100 py-4 px-4 hover-scale group"
        >
          <div>
            <h3 className="font-medium gradient-text-2 text-lg">{item.name}</h3>
            <p className="gradient-text-3 font-semibold text-lg">
              ${item.price ? item.price.toFixed(2) : "0.00"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center glass-effect rounded-full p-1 group-hover:neon-glow transition-all duration-300">
              <button
                onClick={() => updateQty(item.id, -1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-violet-100 transition-colors text-violet-600"
              >
                −
              </button>
              <span className="w-8 text-center font-medium gradient-text-1">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-violet-100 transition-colors text-violet-600"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="relative overflow-hidden px-4 py-1.5 rounded-full group/btn"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-20 group-hover/btn:opacity-100 transition-opacity"></span>
              <span className="relative text-red-500 group-hover/btn:text-white transition-colors">
                Remove
              </span>
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
        <span className="text-2xl font-bold text-gray-800">Total:</span>
        <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
});

export default Cart;
