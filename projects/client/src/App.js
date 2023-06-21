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
import { CartPage } from "./pages/CartPage";

import { useEffect, useCallback } from "react";
import { useDispatch,useSelector } from "react-redux";
import { login } from "./redux/userSlice";
import { cartUser } from "./redux/cartSlice";
import Axios from "axios";

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
    {
        path: "/cart",
        element: <CartPage />,
        errorElement: <ErrorPage />,
    },
    ,
    { path: "/productlist/:category", element: <ProductFilteredPage /> },
    { path: "/product-results/:querry", element: <ProductBySearchPage /> },
]);

function App() {
    const url = process.env.REACT_APP_API_BASE_URL;
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const { id, role } = useSelector((state) => state.userSlice.value);

    const keepLogin = useCallback(async () => {
        try {
            const result = await Axios.get(`${url}/users/keeplogin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(
                login({
                    id: result.data.id,
                    email: result.data.email,
                    name: result.data.name,
                    is_verified: result.data.is_verified,
                    role: result.data.role,
                    photo_profile: result.data.photo_profile,
                })
            );

            // console.log(result);

            const cart = await (await Axios.get(`${url}/fetch-cart`)).data;
            dispatch(cartUser(cart.result));
        } catch (error) {}
    }, [dispatch, id, token]);

    useEffect(() => {
        keepLogin();
    }, [keepLogin]);
    return (
        <main>
            <RouterProvider router={router} />
        </main>
    );
}

export default App;
