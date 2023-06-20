import { Flex, Image, Box, Center } from "@chakra-ui/react";
import banner from "../assets/banner_hobby_zone.jpg";

export const Banner = () => {
    return (
        <Center>
            <Box maxW="100%">
                <Flex justify="center" alignItems="center">
                    <Image
                        src={banner}
                        alt="Banner"
                        objectFit="cover"
                        width="100%"
                    />
                </Flex>
            </Box>
        </Center>
    );
};
