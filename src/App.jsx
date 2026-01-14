/* import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import { CartProvider } from "./CartContext";
import Cart from "./Cart";
export default function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
} */
import { Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import { useContext } from "react";
import { CartContext } from "./CartContext";
export default function App() {
  const { cart } = useContext(CartContext);
  return (
    <>
      <nav>
        <Link className="Products" to="/">Products</Link>
        <Link className="Cart" to="/cart">Cart {/* 🛒 */}({cart.length})</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}