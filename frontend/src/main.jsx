import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import store from "./redux/store.js";
import { clearSession } from "./redux/authSlice.js";
import { registerUnauthorizedHandler } from "./utils/api.js";
import "./index.css";

registerUnauthorizedHandler(() => {
  store.dispatch(clearSession());
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "10px",
              background: "#0f172a",
              color: "#f8fafc",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#2563eb", secondary: "#fff" } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
