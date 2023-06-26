import { HomeCarousel } from "../components/Carousel";
import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { ProductPage } from "../components/Products/ProductLists";
import { CategoryList } from "../components/Products/CategoryLists";
import { Banner } from "../components/Banner";
import divider from "../assets/divider.jpeg";
import divider_2 from "../assets/divider_2.jpg";

export const HomePage = () => {
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
                <HomeCarousel />
                <Box mt={isSmallScreen ? "50px" : "130px"} color="black" pb="6">
                    <Box maxW="1200px" m="auto">
                        <div
                            style={{
                                backgroundImage: `url(${divider})`,
                                backgroundSize: "cover",
                                borderRadius: "12px",
                            }}
                            className="w-full flex justify-between p-4"
                        >
                            <div className="hidden lg:flex lg:flex-col lg:gap-1 lg:w-full text-white">
                                <p className="text-2xl font-semibold">
                                    Categories
                                </p>
                            </div>
                            {isSmallScreen && (
                                <div className="flex flex-col gap-1 w-full text-white">
                                    <p className="text-2xl font-semibold">
                                        Categories
                                    </p>
                                </div>
                            )}
                        </div>
                        <CategoryList />
                    </Box>
                    <Box maxW="1200px" m="auto" mt="2">
                        <div
                            style={{
                                backgroundImage: `url(${divider_2})`,
                                backgroundSize: "cover",
                                borderRadius: "12px",
                            }}
                            className="w-full flex justify-between p-4 mt-5"
                        >
                            <div className="hidden lg:flex lg:flex-col lg:gap-1 lg:w-full text-white">
                                <p className="text-2xl font-semibold">
                                    All Available Products
                                </p>
                            </div>
                            {isSmallScreen && (
                                <div className="flex flex-col gap-1 w-full text-white">
                                    <p className="text-2xl font-semibold">
                                        All Products
                                    </p>
                                </div>
                            )}
                        </div>
                        <ProductPage />
                    </Box>
                </Box>
            </Box>
            <Banner />
            <FooterComponent />
        </Box>
    );
};
