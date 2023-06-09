import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { VerificationPage } from "./pages/VerificationPage";
import { AdminPage } from "./pages/AdminPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    { path: "/activation/:id", element: <VerificationPage /> },
    { path: "/reset-password/:token", element: <ResetPasswordPage /> },
    { path: "/admin", element: <AdminPage /> },
]);

function App() {
    return (
        <main>
            <RouterProvider router={router} />
        </main>
    );
}

export default App;
