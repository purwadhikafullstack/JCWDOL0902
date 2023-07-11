import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { ProductListBySearch } from "../components/Products/ProductListBySearch";
import divider from "../assets/divider_result.jpg";

export const ProductBySearchPage = () => {
    const [isSmallScreen] = useMediaQuery("(max-width: 666px)");

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bg={"whitesmoke"}
        >
            <Navbar />
            <Box flex="1">
                <Box mt={isSmallScreen ? "50px" : "50px"} color="black" pb="6">
                    <Box maxW="1200px" m="auto">
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
                                    Results
                                </p>
                            </div>
                            {isSmallScreen && (
                                <div className="flex flex-col gap-1 w-full text-white">
                                    <p className="text-2xl font-semibold">
                                        Results
                                    </p>
                                </div>
                            )}
                        </div>
                        <ProductListBySearch />
                    </Box>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};
