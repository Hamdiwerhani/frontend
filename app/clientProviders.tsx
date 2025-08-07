"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navbar from "./components/Navbar";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Navbar />
        {children}
      </Provider>
    </AuthProvider>
  );
}
