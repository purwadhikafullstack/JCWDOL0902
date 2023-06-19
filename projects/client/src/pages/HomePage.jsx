import { HomeCarousel } from "../components/Carousel";
import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { ProductPage } from "../components/Products/ProductLists";
import { CategoryList } from "../components/Products/CategoryLists";
import { Banner } from "../components/Banner";

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
                <Box mt={isSmallScreen ? "50px" : "200px"} color="black" pb="6">
                    <Box maxW="85%" m="auto">
                        <Heading
                            fontFamily={"gantari"}
                            mb="2"
                            size="lg"
                            color="black"
                            fontWeight="bold"
                            >
                                <Banner/>
                            Categories
                        </Heading>
                        <CategoryList />
                    </Box>
                    <Box maxW="85%" m="auto" mt="2">
                        <Heading
                            fontFamily={"gantari"}
                            mb="2"
                            size="lg"
                            color="black"
                            fontWeight="bold"
                        >
                            All Products
                        </Heading>
                        <ProductPage />
                    </Box>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};
