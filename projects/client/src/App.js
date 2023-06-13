import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { VerificationPage } from "./pages/VerificationPage";
import { AdminPage } from "./pages/AdminPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { DetailProductPage } from "./pages/ProductDetailPage";
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    { path: "/activation/:id", element: <VerificationPage /> },
    { path: "/reset-password/:token", element: <ResetPasswordPage /> },
    { path: "/admin", element: <AdminPage />, errorElement: <ErrorPage /> },
    { path: "/product/:name", element: <DetailProductPage /> },
]);

function App() {
    return (
        <main>
            <RouterProvider router={router} />
        </main>
    );
}

export default App;
