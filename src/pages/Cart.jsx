import React, { useContext, useMemo } from "react";
import { CartContext } from "../CartContext";

export default function Cart() {
  const { cart, dispatch } = useContext(CartContext);

  // 🧠 Memoized total price
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  // 🧠 Memoized total items count
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  if (cart.length === 0) {
    return <h2 className="empty-cart">Your cart is empty 🛒</h2>;
  }

  return (
    <div className="cart">
      <h1>Your cart</h1>
      <div className="cart-container">
        {/* 📦 Cart Items */}
        <div className="cart-item-container">

          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.title} width="80" />

              <div>
                <h4>{item.title}</h4>
                <p>Price: {item.price}$</p>


                <div className="actions">

                  <div className="actions-bt">
                    <button
                      onClick={() =>
                        dispatch({ type: "DECREASE", id: item.id })
                      }
                    >
                      -
                    </button>
                    <p>{/* Quantity: */} {item.quantity}</p>
                    <button
                      onClick={() =>
                        dispatch({ type: "INCREASE", id: item.id })
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE", id: item.id })
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>

          ))}
        </div>


        <div className="Summary">
          {/* 🧮 Summary */}
          <h2>Order Summary</h2>
          <p>Total Items: {totalItems}</p>
          <p>Total Price: {totalPrice.toFixed(2)} $</p>
          <button>Go to Checkout</button>
          {/* 🧹 Clear Cart */}
          <button
            className="clear-btn"
            onClick={() => dispatch({ type: "CLEAR" })}
          >
            Clear Cart
          </button>
        </div>

      </div>
    </div>

  );
}


/* import { useContext } from "react";
import { CartContext } from "../CartContext";
export default function Cart() {
  const { cart, dispatch } = useContext(CartContext);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  if (cart.length === 0) return <h2>Cart is empty</h2>;
  return (
    <div className="cart">
      Shopping Cart
      {cart.map(item => (
        <div key={item.id} className="cart-item">
           <img src={item.thumbnail} alt="" />
           <div className="ditels">
          <h4>{item.title}</h4>
          <h4>{item.description}</h4>
          <h4>Only {item.stock} left in stock</h4>
          <p>{item.price}$</p>
            <button onClick={() => dispatch({ type: "DECREASE", id: item.id })}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => dispatch({ type: "INCREASE", id: item.id })}>+</button>
          <button onClick={() => dispatch({ type: "REMOVE", id: item.id })}>
            Remove
          </button>
           </div>
        </div>
      ))}
            <button
        onClick={() => dispatch({ type: "CLEAR" })}
        className="clear-btn"
      >
        Clear Cart
      </button>
      <h2>Total: {total.toFixed(2)} $</h2>
    </div>
  );
} */