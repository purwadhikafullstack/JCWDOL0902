import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { ProductListBySearch } from "../components/Products/ProductListBySearch";

export const ProductBySearchPage = () => {
    const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
    const { querry } = useParams();

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
                    <Box maxW="85%" m="auto">
                        <Heading
                            fontFamily={"gantari"}
                            mb="2"
                            size="lg"
                            color="black"
                            fontWeight="bold"
                        >
                            Results
                        </Heading>
                        <ProductListBySearch />
                    </Box>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};
