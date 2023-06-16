import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Image, Text, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const url = process.env.REACT_APP_API_BASE_URL;
const serverApi = process.env.REACT_APP_SERVER;

export const CategoryList = () => {
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();

    const fetchcategory = async () => {
        try {
            const response = await axios.get(
                `${url}/products/fetch-categories`
            );
            setCategory(response.data.result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchcategory();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <Box p={4}>
            <Slider {...settings}>
                {category.map((category) => (
                    <Box
                        key={category.id}
                        bg="white"
                        p={2}
                        borderRadius="md"
                        boxShadow="md"
                        _hover={{
                            cursor: "pointer",
                            boxShadow: "xl",
                        }}
                    >
                        <Box display="flex" justifyContent="center">
                            <Image
                                src={`${serverApi}${category.image}`}
                                alt={category.name}
                                mb={4}
                                h="200px"
                                objectFit="cover"
                                borderRadius="lg"
                            />
                        </Box>

                        <Tooltip label={category.name} placement="top" hasArrow>
                            <Text
                                textAlign="center"
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
                                {category.name}
                            </Text>
                        </Tooltip>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};
