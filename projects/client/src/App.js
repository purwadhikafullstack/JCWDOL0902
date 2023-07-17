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
import { CheckoutPage } from "././pages/CheckoutPage";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/userSlice";
import { cartUser } from "./redux/cartSlice";
import Axios from "axios";
import { AddressPage } from "./pages/UserAddressPage";
import OrderListPage from "./pages/OrderListPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    { path: "/activation/:token", element: <VerificationPage /> },
    { path: "/reset-password/:token", element: <ResetPasswordPage /> },
    { path: "/admin", element: <AdminPage />, errorElement: <ErrorPage /> },
    { path: "/product/:name", element: <DetailProductPage /> },
    {
        path: "profile/settings",
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "profile/address",
        element: <AddressPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/cart",
        element: <CartPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/order-list",
        element: <OrderListPage />,
        errorElement: <ErrorPage />,
    },

    { path: "/category/:category", element: <ProductFilteredPage /> },
    {
        path: "/checkout",
        element: <CheckoutPage />,
        errorElement: <ErrorPage />,
    },

    { path: "/product-results/:querry", element: <ProductBySearchPage /> },
]);

function App() {
    const url = process.env.REACT_APP_API_BASE_URL;
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const { id } = useSelector((state) => state.userSlice.value);

    const keepLogin = useCallback(async () => {
        try {
            if (token) {
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

                const cart = await (
                    await Axios.get(`${url}/users/fetch-cart/${id}`)
                ).data;
                dispatch(cartUser(cart.cartData));
            }
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
