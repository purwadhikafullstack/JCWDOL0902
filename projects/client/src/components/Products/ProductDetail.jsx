import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import {
    Box,
    Container,
    Divider,
    Text,
    useMediaQuery,
    Image,
} from "@chakra-ui/react";

const baseApi = process.env.REACT_APP_API_BASE_URL;
const serverApi = process.env.REACT_APP_SERVER;

export const ProductDetail = () => {
    const [setDir] = useMediaQuery("(max-width: 1050px)");
    const { name } = useParams();
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [subtotal, setSubtotal] = useState(0);
    const [category, setCategory] = useState();
    const url_detail = `${baseApi}/products/detail/${name}`;

    const getProduct = useCallback(async () => {
        try {
            const response = await await axios.get(url_detail);
            // console.log(response.data.result.price);
            setProduct(response.data.result);
            setCategory(response.data.result.category.name);
            setSubtotal(response.data.result.price);
        } catch (error) {}
    }, [url_detail]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);
    return (
        <Container
            maxW={"inherit"}
            minH={"85.5vh"}
            color={"black"}
            px={{ base: "4", md: "32" }}
        >
            <Box
                display={"flex"}
                flexDirection={setDir ? "column" : "row"}
                gap={{ base: "2", md: "4" }}
            >
                <Box pt={2} m={setDir ? "auto" : "0"}>
                    <Box w={{ base: "248px", md: "369px" }} borderRadius="md">
                        <Image
                            src={`${serverApi}${product?.product_image}`}
                            alt={product?.name}
                            borderRadius={"xl"}
                            width="100%"
                            height="100%"
                            objectFit={"cover"}
                        />
                    </Box>
                </Box>
                <Box p={2} px={6} w={setDir ? "100%" : "40%"}>
                    <Box>
                        <Text
                            fontSize={"2xl"}
                            fontWeight={"extrabold"}
                            color={"black"}
                        >
                            {product?.name}
                        </Text>
                        <Text
                            fontWeight="bold"
                            fontSize={"2xl"}
                            color={"#720026"}
                        >
                            {`Rp${product?.price?.toLocaleString()}`}
                        </Text>
                    </Box>
                    <Divider my={"3"} />
                    <Box mb={"3"} color={"#495057"}>
                        <Text>Condition: New</Text>
                        <Text>
                            Status: {product?.stock ? "Ready" : "Out of Stock"}
                        </Text>
                        <Text>
                            Weight:
                            {product?.weight < 1000
                                ? ` ${product?.weight} g`
                                : ` ${product?.weight / 1000} kg`}
                        </Text>
                        <Text>Brand: {product?.brand}</Text>
                        <Text>
                            Category:{" "}
                            <Text
                                as={Link}
                                to={`/product?search_query=${category}`}
                                color={"#343A40"}
                                textTransform={"capitalize"}
                                fontWeight={"semibold"}
                            >
                                {category}
                            </Text>
                        </Text>
                    </Box>
                    <Box h={"242px"} overflow={"auto"}>
                        <Text color={"black"}>{product?.description}</Text>
                    </Box>
                </Box>
                <Box px={"6"} pt={4} mb={{ base: "14", md: "" }}>
                    {/* cart section */}
                </Box>
            </Box>
        </Container>
    );
};
