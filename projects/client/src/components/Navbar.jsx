import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import icon from "../assets/hobbyzone_logo.png";
import iconSimple from "../assets/hobbyzone_logo_simple.png";

import {
    Box,
    Flex,
    Link,
    IconButton,
    Image,
    Input,
    Grid,
    GridItem,
    Center,
    Container,
    useToast,
    Tooltip,
    useMediaQuery,
} from "@chakra-ui/react";

import { BiSearch } from "react-icons/bi";

import { RegisterationForm } from "./Authentications/RegisterationForm";
import { LoginForm } from "./Authentications/LoginForm";
import { UserMenu } from "./UserMenu";

export const Navbar = () => {
    const [mobileView] = useMediaQuery("(max-width: 1007px)");
    const navigate = useNavigate();
    const toast = useToast();
    const [valuesearch, setValueSearch] = useState("");

    const token = localStorage.getItem("token");

    return (
        <>
            <Box
                px={{ base: 6, md: "28" }}
                py={{ base: 1, md: 4 }}
                backgroundColor="#E9ECEF"
                boxShadow="md"
                position="sticky"
                top="0"
                zIndex="999"
            >
                <Container>
                    <Center>
                        <Grid
                            h={{ base: "45px" }}
                            alignItems={"center"}
                            templateColumns={{
                                base: "repeat(3, 1fr)",
                                md: "repeat(4, 1fr)",
                            }}
                            gap={{ base: 3, md: 3, lg: 5 }}
                        >
                            <GridItem
                                colSpan={{ base: 1 }}
                                w={{ base: "50px", md: "200px" }}
                            >
                                <Center>
                                    <Link
                                        as={Image}
                                        href={"/"}
                                        src={iconSimple}
                                        w={"auto"}
                                        h={8}
                                        display={{ md: "none" }}
                                        cursor={"pointer"}
                                        onClick={() =>
                                            window.location.replace("/")
                                        }
                                    />
                                    <Image
                                        to={"/"}
                                        src={icon}
                                        w={"auto"}
                                        h={14}
                                        display={{
                                            base: "none",
                                            md: "block",
                                            lg: "none",
                                        }}
                                        cursor={"pointer"}
                                        onClick={() =>
                                            window.location.replace("/")
                                        }
                                    />
                                    <Image
                                        to={"/"}
                                        src={icon}
                                        w={"auto"}
                                        h={14}
                                        display={{
                                            base: "none",
                                            md: "none",
                                            lg: "block",
                                        }}
                                        cursor={"pointer"}
                                        onClick={() =>
                                            window.location.replace("/")
                                        }
                                    />
                                </Center>
                            </GridItem>
                            <GridItem colSpan={{ base: 1 }}>
                                <Flex>
                                    <Box
                                        p={{ base: "3px" }}
                                        rounded="15px"
                                        marginLeft={3}
                                    >
                                        <Input
                                            h={{ md: "30px" }}
                                            w={{
                                                base: "200px",
                                                md: "300px",
                                                lg: "80vh",
                                            }}
                                            style={{
                                                border: "none",
                                                outline: "none",
                                            }}
                                            color={"black"}
                                            variant={"filled"}
                                            boxShadow={"sm"}
                                            placeholder="Search for Hobbies"
                                            _placeholder={{
                                                color: "gray",
                                                fontSize: {
                                                    base: "12px",
                                                    md: "16px",
                                                },
                                                fontWeight: "500",
                                            }}
                                            _focusVisible={{
                                                outline: "none",
                                            }}
                                            onChange={(e) => {
                                                setValueSearch(e.target.value);
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        marginTop={"3px"}
                                        paddingTop={{ base: "1px", md: "4px" }}
                                        transition={"0.5s"}
                                    >
                                        <Tooltip label="Search" hasArrow>
                                            <IconButton
                                                icon={<BiSearch />}
                                                h={{ base: "10px", md: "40x" }}
                                                minW={{
                                                    base: "30px",
                                                    md: "40px",
                                                }}
                                                fontSize={{ md: "2xl" }}
                                                borderRadius={0}
                                                bg="none"
                                                color={"gray"}
                                                _hover={{
                                                    bg: "none",
                                                }}
                                                _active={{
                                                    bg: "none",
                                                    color: "gray",
                                                }}
                                                onClick={() => {
                                                    if (!valuesearch) {
                                                        toast({
                                                            title: "Search Warning",
                                                            description:
                                                                "Please enter a search term.",
                                                            status: "warning",
                                                            position: "top",
                                                            duration: 2000,
                                                            isClosable: true,
                                                        });
                                                    } else {
                                                        navigate(
                                                            `/product-results/${valuesearch}`
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    valuesearch ? false : true
                                                }
                                            />
                                        </Tooltip>
                                    </Box>
                                </Flex>
                            </GridItem>
                            <GridItem
                                display={{ base: "none", md: "block" }}
                                w={{ base: "50px", md: "150px" }}
                            ></GridItem>
                            <GridItem
                                colSpan={{ base: 1 }}
                                w={{ base: "50px", lg: "200px" }}
                            >
                                <Center>
                                    {token || mobileView ? (
                                        <UserMenu />
                                    ) : (
                                        <Flex
                                            gap={4}
                                            display={{
                                                base: "none",
                                                lg: "inline-flex",
                                            }}
                                        >
                                            <LoginForm />
                                            <RegisterationForm />
                                        </Flex>
                                    )}
                                </Center>
                            </GridItem>
                        </Grid>
                    </Center>
                </Container>
            </Box>
        </>
    );
};
