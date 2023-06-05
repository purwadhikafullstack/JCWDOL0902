import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { VerificationPage } from "./pages/VerificationPage";
import { LoginForm } from "./pages/login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    { path: "/activation/:id", element: <VerificationPage /> },
    { path: "/login", element: <LoginForm /> }
]);

function App() {
    return (
        <main>
            <RouterProvider router={router} />
        </main>
    );
}

export default App;
