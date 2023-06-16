import {
    Box,
    Container,
    Link,
    SimpleGrid,
    Stack,
    Text,
    Input,
    IconButton,
    useColorModeValue,
    Image,
} from "@chakra-ui/react";

import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { BiEnvelope, BiMail } from "react-icons/bi";
import icon from "../assets/hobbyzone_footer.png";
import appstore from "../assets/app_store.png";

export const FooterComponent = () => {
    return (
        <Box
            bg={useColorModeValue("#E9ECEF")}
            color={useColorModeValue("gray.700", "gray.200")}
        >
            <Container as={Stack} maxW={"6xl"} py={10}>
                <SimpleGrid
                    templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
                    spacing={8}
                >
                    <Stack spacing={6}>
                        <Box>
                            <Image
                                src={icon}
                                w={"auto"}
                                h={14}
                                cursor={"pointer"}
                                onClick={() => window.location.replace("/")}
                            />
                        </Box>
                        <Text fontSize={"sm"} fontWeight={"600"}>
                            © 2023 HobbyZone. All rights reserved
                        </Text>
                        <Stack direction={"row"} spacing={6}>
                            <IconButton
                                aria-label="Twitter"
                                icon={<FaTwitter />}
                                borderRadius="full"
                                bg="white"
                                color={useColorModeValue(
                                    "gray.700",
                                    "gray.200"
                                )}
                                _hover={{
                                    bg: useColorModeValue(
                                        "gray.200",
                                        "gray.700"
                                    ),
                                }}
                            />
                            <IconButton
                                aria-label="YouTube"
                                icon={<FaYoutube />}
                                borderRadius="full"
                                bg="white"
                                color={useColorModeValue(
                                    "gray.700",
                                    "gray.200"
                                )}
                                _hover={{
                                    bg: useColorModeValue(
                                        "gray.200",
                                        "gray.700"
                                    ),
                                }}
                            />
                            <IconButton
                                aria-label="Instagram"
                                icon={<FaInstagram />}
                                borderRadius="full"
                                bg="white"
                                color={useColorModeValue(
                                    "gray.700",
                                    "gray.200"
                                )}
                                _hover={{
                                    bg: useColorModeValue(
                                        "gray.200",
                                        "gray.700"
                                    ),
                                }}
                            />
                        </Stack>
                    </Stack>
                    <Stack align={"flex-start"} fontWeight={"500"}>
                        <Text fontWeight={"600"}>Company</Text>
                        <Link href={"#"}>About us</Link>
                        <Link href={"#"}>Blog</Link>
                        <Link href={"#"}>Contact us</Link>
                        <Link href={"#"}>Pricing</Link>
                        <Link href={"#"}>Testimonials</Link>
                    </Stack>
                    <Stack align={"flex-start"} fontWeight={"500"}>
                        <Text fontWeight={"600"}> Support</Text>
                        <Link href={"#"}>Help Center</Link>
                        <Link href={"#"}>Terms of Service</Link>
                        <Link href={"#"}>Legal</Link>
                        <Link href={"#"}>Privacy Policy</Link>
                        <Link href={"#"}>Status</Link>
                    </Stack>
                    <Stack align={"flex-start"} fontWeight={"500"}>
                        <Text fontWeight={"600"}>Install HobbyZone App</Text>
                        <Stack direction={"row"}>
                            <Image
                                src={appstore}
                                w={"auto"}
                                h={"120"}
                                cursor={"pointer"}
                                onClick={() => window.location.replace("/")}
                            />
                        </Stack>
                    </Stack>
                </SimpleGrid>
            </Container>
        </Box>
    );
};
