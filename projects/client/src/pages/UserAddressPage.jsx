import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, useMediaQuery } from "@chakra-ui/react";
import divider from "../assets/divider_result.jpg";
import { Address } from "../components/UserAddress/Address";
import { ErrorPage } from "./ErrorPage";

export const AddressPage = () => {
    const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
    const token = localStorage.getItem("token");

    if (!token) {
        return <ErrorPage />;
    }

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navbar />
            <Box flex="1">
                <Box mt={isSmallScreen ? "30px" : "30px"} color="black" pb="6">
                    <Box maxW="1000px" m="auto">
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
                                    Address
                                </p>
                            </div>
                            {isSmallScreen && (
                                <div className="flex flex-col gap-1 w-full text-white">
                                    <p className="text-2xl font-semibold">
                                        Address
                                    </p>
                                </div>
                            )}
                        </div>
                        <Address />
                    </Box>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};
