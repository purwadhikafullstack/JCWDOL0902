import { FooterComponent } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { ProductListPerCategory } from "../components/Products/ProductListPerCategory";
import { useParams } from "react-router-dom";
import divider_2 from "../assets/divider_2.jpg";

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
                    <Box maxW="1200px" m="auto">
                        <div
                            style={{
                                backgroundImage: `url(${divider_2})`,
                                backgroundSize: "cover",
                                borderRadius: "12px",
                            }}
                            className="w-full flex justify-between p-5 mt-5"
                        >
                            <div className="hidden lg:flex lg:flex-col lg:gap-1 lg:w-full text-white">
                                <p className="text-2xl font-semibold">
                                    {capitalizeFirstCharacterOfWords(category)}
                                </p>
                            </div>
                            {isSmallScreen && (
                                <div className="flex flex-col gap-1 w-full text-white">
                                    <p className="text-2xl font-semibold">
                                        {capitalizeFirstCharacterOfWords(
                                            category
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                        <ProductListPerCategory />
                    </Box>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};
