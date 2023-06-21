import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Grid,
    Image,
    Text,
    Tooltip,
    Center,
    IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

const url = process.env.REACT_APP_API_BASE_URL;
const serverApi = process.env.REACT_APP_SERVER;

export const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [direction, setDirection] = useState("DESC");
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `${url}/products/fetch-all-products?page=${page}&search_query=${searchQuery}&order=${order}&by=${direction}`
            );
            console.log(response);
            setProducts(response.data.result);
            setTotalPages(response.data.totalPage);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, searchQuery, order, direction]);

    const handleCardClick = (productName) => {
        navigate(`/product/${productName}`);
    };

    return (
        <Box p={4}>
            <Grid
                templateColumns={{
                    base: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                }}
                gap={4}
            >
                {products.map((product) => (
                    <Box
                        key={product.id}
                        bg="white"
                        p={2}
                        borderRadius="md"
                        boxShadow="md"
                        _hover={{
                            cursor: "pointer",
                            boxShadow: "xl",
                        }}
                        onClick={() => handleCardClick(product.name)}
                    >
                        <Box display="flex" justifyContent="center">
                            <Image
                                src={`${serverApi}${product.product_image}`}
                                alt={product.name}
                                mb={4}
                                h="200px"
                                objectFit="cover"
                                borderRadius="lg"
                            />
                        </Box>

                        <Tooltip label={product.name} placement="top" hasArrow>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                mb={2}
                                style={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                _hover={{ color: "#385898" }}
                            >
                                {product.name}
                            </Text>
                        </Tooltip>
                        <Text fontWeight={"600"} color={"maroon"}>
                            {`Rp ${product?.price?.toLocaleString()}`}
                        </Text>
                        <Text mt={2} fontSize="sm" fontWeight="500">
                            Category: {product.category.name}
                        </Text>
                    </Box>
                ))}
            </Grid>

            <Box mt={8}>
                <Center paddingY={"10px"}>
                    {page <= 0 ? (
                        <IconButton icon={<SlArrowLeft />} disabled />
                    ) : (
                        <IconButton
                            onClick={() => {
                                setPage(page - 1);
                            }}
                            icon={<SlArrowLeft />}
                        />
                    )}
                    <Text paddingX={"10px"}>
                        {page + 1} of {totalPages}
                    </Text>
                    {page < totalPages - 1 ? (
                        <IconButton
                            icon={<SlArrowRight />}
                            onClick={() => {
                                setPage(page + 1);
                            }}
                        />
                    ) : (
                        <IconButton icon={<SlArrowRight />} disabled />
                    )}
                </Center>
            </Box>
        </Box>
    );
};