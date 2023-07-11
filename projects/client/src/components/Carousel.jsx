// caraousel
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// chakra
import { Box, Image, Center } from "@chakra-ui/react";

// picture
import carousel1 from "../assets/carousel_1.webp";
import carousel2 from "../assets/carousel_2.webp";
import carousel3 from "../assets/carousel_3.jpeg";
import carousel4 from "../assets/carousel_4.webp";

export const HomeCarousel = () => {
    const carouselPic = [carousel1, carousel2, carousel3, carousel4];

    return (
        <Center>
            <Box w="100%" maxW="1200px">
                <Box
                    as={Carousel}
                    h={{ base: "200px", md: "350px" }}
                    paddingTop={4}
                    autoPlay={true}
                    infiniteLoop={true}
                    showThumbs={false}
                    showArrows={false}
                    showStatus={false}
                    renderIndicator={(
                        onClickHandler,
                        isSelected,
                        index,
                        label
                    ) => {
                        const defStyle = {
                            marginLeft: 10,
                            cursor: "fixed",
                            display: "inline-block",
                            background: "white",
                            height: "5px",
                            width: "5px",
                            borderRadius: "50%",
                        };
                        const style = isSelected
                            ? {
                                  ...defStyle,
                                  background: "white",
                                  height: "8px",
                                  width: "8px",
                              }
                            : { ...defStyle };
                        return (
                            <Box
                                style={style}
                                onClick={onClickHandler}
                                onKeyDown={onClickHandler}
                                display={"inline"}
                                key={index}
                                role="button"
                                aria-label={`Selected: ${label} ${index + 1}`}
                                title={`Selected: ${label} ${index + 1}`}
                            />
                        );
                    }}
                >
                    {carouselPic.map((pic, index) => {
                        return (
                            <Center key={index}>
                                <Image
                                    boxSize={{ base: "200px", md: "450px" }}
                                    src={pic}
                                    alt=""
                                    borderRadius="lg"
                                />
                            </Center>
                        );
                    })}
                </Box>
            </Box>
        </Center>
    );
};
