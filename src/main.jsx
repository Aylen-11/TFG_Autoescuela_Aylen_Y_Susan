import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./routes/Router"; 
import "./index.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const paypalOptions= {
  clientId: 'ARhY9S4Bp1CEQ6gjlevQiu25pwZ6ScGmA_W-tGVCmkAIEUY6BrI9ckQmYNbdNQH4hIGT7oeQTIbfhst-',
  currency: 'EUR',
};

createRoot(document.getElementById("root")).render(
  <PayPalScriptProvider options={paypalOptions}>
    <Router />
  </PayPalScriptProvider>
);
