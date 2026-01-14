import { createContext, useReducer, useEffect } from "react";

export const CartContext = createContext();
/* قراءة الكارت من LocalStorage */
const getInitialCart = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(item => item.id === action.product.id);
      if (existing) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }

    case "INCREASE":
      return state.map(item =>
        item.id === action.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case "DECREASE":
      return state
        .map(item =>
          item.id === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);

    case "REMOVE":
      return state.filter(item => item.id !== action.id);

    case "CLEAR":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  /* ستخدامه كـ initialState */
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);
/* حفظ الكارت عند أي تغيير */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};