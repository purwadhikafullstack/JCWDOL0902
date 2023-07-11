import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, useMediaQuery } from "@chakra-ui/react";
import divider from "../assets/divider_result.jpg";
import { CartForm } from "../components/Cart/CartForm/CartForm";
import { ErrorPage } from "./ErrorPage";

export const CartPage = () => {
    const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
    const token = localStorage.getItem("token");

    if (!token) {
        return <ErrorPage />;
    }

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navbar />
            <Box flex="1">
                <Box mt={isSmallScreen ? "50px" : "50px"} color="black" pb="6">
                    <Box maxW="1100px" m="auto">
                        <Box
                            maxW={{
                                base: "3xl",
                                lg: "7xl",
                            }}
                            mx="auto"
                            px={{
                                base: "4",
                                md: "8",
                                lg: "12",
                            }}
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${divider})`,
                                    backgroundSize: "cover",
                                    borderRadius: "12px",
                                }}
                                className="w-full flex justify-between p-5 mt-5"
                            >
                                <div className="hidden lg:flex lg:flex-col lg:gap-1 lg:w-full text-white">
                                    <p className="text-2xl font-semibold">
                                        Your Cart
                                    </p>
                                </div>
                                {isSmallScreen && (
                                    <div className="flex flex-col gap-1 w-full text-white">
                                        <p className="text-2xl font-semibold">
                                            Your Cart
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Box>
                        <CartForm />
                    </Box>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};
