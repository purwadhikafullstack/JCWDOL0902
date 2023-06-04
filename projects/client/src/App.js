import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginForm } from "./pages/login";

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
