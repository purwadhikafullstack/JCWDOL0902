import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { VerificationPage } from "./pages/VerificationPage";
import { AdminPage } from "./pages/AdminPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { DetailProductPage } from "./pages/ProductDetailPage";
import { ProfilePage } from "./pages/UserProfilePage";
import { ProductFilteredPage } from "./pages/ProductFiltered";
import { ProductBySearchPage } from "./pages/ProductBySearchPage";

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
    {
        path: "profile/settings",
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
    },
    { path: "/productlist/:category", element: <ProductFilteredPage /> },
    { path: "/product-results/:querry", element: <ProductBySearchPage /> },
]);

function App() {
    return (
        <main>
            <RouterProvider router={router} />
        </main>
    );
}

export default App;
