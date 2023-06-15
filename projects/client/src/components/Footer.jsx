import {
    Box,
    Image,
    Container,
    Link,
    Stack,
    Text,
    useColorModeValue,
    IconButton,
} from "@chakra-ui/react";

import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import icon from "../assets/hobbyzone_footer.png";

export const FooterComponent = () => {
    return (
        <Box
            bg={useColorModeValue("gray.50", "gray.900")}
            color={useColorModeValue("gray.700", "gray.200")}
        >
            <Container
                as={Stack}
                maxW={"6xl"}
                py={4}
                spacing={4}
                justify={"center"}
                align={"center"}
            >
                <Image
                    src={icon}
                    w={"auto"}
                    h={14}
                    cursor={"pointer"}
                    onClick={() => window.location.replace("/")}
                />
                <Stack direction={"row"} spacing={6} fontWeight={"500"}>
                    <Link href={"#"}>Home</Link>
                    <Link href={"#"}>About</Link>
                    <Link href={"#"}>Blog</Link>
                    <Link href={"#"}>Contact</Link>
                </Stack>
            </Container>

            <Box
                borderTopWidth={2}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                <Container
                    as={Stack}
                    maxW={"6xl"}
                    py={4}
                    direction={{ base: "column", md: "row" }}
                    spacing={4}
                    justify={{ base: "center", md: "space-between" }}
                    align={{ base: "center", md: "center" }}
                >
                    <Text fontWeight={"500"}>
                        © 2023 Hobby Zone. All rights reserved
                    </Text>
                    <Stack direction={"row"} spacing={6}>
                        <IconButton
                            aria-label="Twitter"
                            icon={<FaTwitter />}
                            borderRadius="full"
                            color={useColorModeValue("gray.700", "gray.200")}
                            _hover={{
                                bg: useColorModeValue("gray.200", "gray.700"),
                            }}
                        />
                        <IconButton
                            aria-label="YouTube"
                            icon={<FaYoutube />}
                            borderRadius="full"
                            color={useColorModeValue("gray.700", "gray.200")}
                            _hover={{
                                bg: useColorModeValue("gray.200", "gray.700"),
                            }}
                        />
                        <IconButton
                            aria-label="Instagram"
                            icon={<FaInstagram />}
                            borderRadius="full"
                            color={useColorModeValue("gray.700", "gray.200")}
                            _hover={{
                                bg: useColorModeValue("gray.200", "gray.700"),
                            }}
                        />
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};
