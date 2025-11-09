export default function OrderStatus() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center mt-20">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Thank You!</h1>
      <p className="text-black text-lg mb-4">Your order is being prepared and will be shipped soon.</p>
      <p className="text-black">You will receive an email confirmation shortly.</p>
      <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
        Back to Home
      </a>
    </div>
  );
}
