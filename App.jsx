import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import Review from "./components/Review";
import DoD from "./components/DoD";
import Login from "./components/Login";

// Protected Route wrapper
const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth");
  return isAuth ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [cartItems, setCartItems] = React.useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Add to cart handler
  const handleOrder = (food) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.title === food.title);
      const updated = exists
        ? prev.map(i => i.title === food.title ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...food, id: food.title, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updated));
      alert(`${food.title} added to cart!`);
      return updated;
    });
  };

  // Cart quantity update
  const handleUpdateQuantity = (id, change, clear = false) => {
    if (id === "CLEAR_CART" || clear) {
      setCartItems([]);
      localStorage.setItem("cart", JSON.stringify([]));
      return;
    }
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      ).filter(item => item.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Router>
      <Navbar cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected pages */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/DoD"
            element={
              <PrivateRoute>
                <DoD onOrder={handleOrder} />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Menu onOrder={handleOrder} />
              </PrivateRoute>
            }
          />
         
          <Route
            path="/review"
            element={
              <PrivateRoute>
                <Review />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
