import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { ProductListPerCategory } from "../components/Products/ProductListPerCategory";
import { useParams } from "react-router-dom";

function capitalizeFirstCharacterOfWords(sentence) {
    const words = sentence.split(" ");

    const capitalizedWords = words.map((word) => {
        const firstChar = word.charAt(0).toUpperCase();
        const restOfWord = word.slice(1).toLowerCase();

        return firstChar + restOfWord;
    });

    return capitalizedWords.join(" ");
}

export const ProductFilteredPage = () => {
    const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
    const { category } = useParams();

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
                            {capitalizeFirstCharacterOfWords(category)}
                        </Heading>

                        <ProductListPerCategory />
                    </Box>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};
