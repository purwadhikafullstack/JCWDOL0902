import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Grid,
    Image,
    Text,
    Tooltip,
    Select,
    Center,
    IconButton,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import pict from "../../assets/not_found.png";

const url = process.env.REACT_APP_API_BASE_URL;
const serverApi = process.env.REACT_APP_SERVER;

export const ProductListBySearch = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState(0);

    const { querry } = useParams();
    const navigate = useNavigate();

    let productData;

    switch (parseInt(sort)) {
        //mengurutkan dari nama produk A-Z
        case 1:
            productData = `${url}/products/fetch-all-products?page=${page}&search_query=${querry}&order=${"name"}&by=${"asc"}`;
            break;
        //mengurutkan nama Z-A
        case 2:
            productData = `${url}/products/fetch-all-products?page=${page}&search_query=${querry}&order=${"name"}&by=${"desc"}`;
            break;
        //mengurutkan harga dari termahal - termurah
        case 3:
            productData = `${url}/products/fetch-all-products?page=${page}&search_query=${querry}&order=${"price"}&by=${"desc"}`;
            break;
        //mengurutkan harga dari termurah - termahal
        case 4:
            productData = `${url}/products/fetch-all-products?page=${page}&search_query=${querry}&order=${"price"}&by=${"asc"}`;
            break;
        default:
            productData = `${url}/products/fetch-all-products?page=${page}&search_query=${querry}&order=${""}&by=${"desc"}`;
    }

    const fetchProducts = async () => {
        try {
            const response = await axios.get(productData);
            console.log(response);
            setProducts(response.data.result);
            setTotalPages(response.data.totalPage);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, sort, querry]);

    const handleCardClick = (productName) => {
        navigate(`/product/${productName}`);
    };

    return (
        <Box p={4}>
            <Select
                placeholder="Sort by"
                mb={5}
                backgroundColor={"#48CAE4"}
                fontWeight={"600"}
                borderRadius={"lg"}
                color={"#023E8A"}
                size={"sm"}
                maxW="250px"
                onChange={(e) => setSort(e.target.value)}
            >
                <option value="1">Product Name A-Z</option>
                <option value="2">Product Name Z-A</option>
                <option value="3">Price Highest-Lowest</option>
                <option value="4">Price Lowest-Highest</option>
            </Select>

            {products.length === 0 ? (
                <Box
                    textAlign="center"
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                >
                    <Text fontSize="lg" fontWeight="bold">
                        No Results Found For {querry}
                    </Text>
                    <Image src={pict} alt="No products found" maxW={"2xl"} />
                </Box>
            ) : (
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
                            bg={product.stock === 0 ? "#CED4DA" : "white"}
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
                                    style={
                                        product.stock === 0
                                            ? { filter: "grayscale(100%)" }
                                            : {}
                                    }
                                />
                            </Box>

                            <Tooltip
                                label={product.name}
                                placement="top"
                                hasArrow
                            >
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
                            {product.stock === 0 && (
                                <Text
                                    mt={2}
                                    fontSize="md"
                                    fontWeight="600"
                                    color="red"
                                >
                                    Out of Stock
                                </Text>
                            )}
                        </Box>
                    ))}
                </Grid>
            )}

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
                    <Text paddingX={"10px"}>{page + 1}</Text>
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
