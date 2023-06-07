import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import icon from "../assets/kickshub_logo.png";
import iconSimple from "../assets/kickshub_logo_simplified.png";

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

import { BiSearchAlt } from "react-icons/bi";
import { CgHeart } from "react-icons/cg";

import { RegisterationForm } from "./Authentications/RegisterationForm";
import { LoginForm } from "./Authentications/LoginForm";
import { HamburgerMenu } from "./HamburgerMenu";
import { UserMenu } from "./UserMenu";

export const Navbar = ({
    setPage,
    searchquery,
    setSearchParams,
    setPmax,
    setPmin,
}) => {
    const [mobileView] = useMediaQuery("(max-width: 1007px)");
    const navigate = useNavigate();
    const toast = useToast();
    const [valuesearch, setValueSearch] = useState("");
    const [enter, setEnter] = useState(0);
    const location = useLocation();

    function handleSearch() {
        if (location.pathname === "/product") {
            setPage(1);
            setPmax(null);
            setPmin(null);
            setSearchParams(`search_query=${valuesearch}`);
        }
    }

    const token = localStorage.getItem("token");

    return (
        <>
            <Box
                px={{ base: 6, md: "28" }}
                py={{ base: 1, md: 4 }}
                backgroundColor="#212529"
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
                                    <HamburgerMenu />
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
                                        marginLeft={2}
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
                                        marginLeft={2}
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
                                        marginLeft={2}
                                    />
                                </Center>
                            </GridItem>
                            <GridItem colSpan={{ base: 1 }}>
                                <Flex>
                                    <Box
                                        border="2px solid white"
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
                                            color={"white"}
                                            placeholder="Find Your Feet Companion"
                                            _placeholder={{
                                                color: "grey",
                                                fontSize: {
                                                    base: "12px",
                                                    md: "16px",
                                                },
                                                fontWeight: "600",
                                            }}
                                            _focusVisible={{
                                                outline: "none",
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    if (!valuesearch) {
                                                        if (enter === 2) {
                                                            return setTimeout(
                                                                () =>
                                                                    window.location.reload(),
                                                                500
                                                            );
                                                        }
                                                        toast({
                                                            position: "top",
                                                            title: `Find Something?`,
                                                            variant: "subtle",
                                                            duration: 1500,
                                                            isClosable: true,
                                                        });
                                                        return setEnter(
                                                            enter + 1
                                                        );
                                                    }
                                                    navigate(
                                                        `/product?search_query=${e.target.value}`
                                                    );
                                                    if (
                                                        location.pathname ===
                                                        "/product"
                                                    ) {
                                                        setPage(1);
                                                        setPmax(null);
                                                        setPmin(null);
                                                        setSearchParams(
                                                            `search_query=${e.target.value}`
                                                        );
                                                    }
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                setValueSearch(e.target.value);
                                            }}
                                            defaultValue={searchquery}
                                        />
                                    </Box>
                                    <Box
                                        marginTop={"3px"}
                                        paddingTop={{ base: "1px", md: "4px" }}
                                        transition={"0.5s"}
                                    >
                                        <Tooltip label="Search" hasArrow>
                                            <IconButton
                                                icon={<BiSearchAlt />}
                                                h={{ base: "10px", md: "40x" }}
                                                minW={{
                                                    base: "30px",
                                                    md: "40px",
                                                }}
                                                fontSize={{ md: "3xl" }}
                                                borderRadius={0}
                                                bg="none"
                                                color={"white"}
                                                _hover={{
                                                    bg: "none",
                                                }}
                                                _active={{
                                                    bg: "none",
                                                    color: "white",
                                                }}
                                                onClick={() => {
                                                    navigate(
                                                        `/product?search_query=${valuesearch}`
                                                    );
                                                    handleSearch();
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
                            >
                                <Flex>
                                    <IconButton
                                        icon={<CgHeart />}
                                        fontSize={"35px"}
                                        href={"#"}
                                        bg={"none"}
                                        borderRadius={0}
                                        borderRight={"1px solid white"}
                                        color={"white"}
                                        width={70}
                                        height={30}
                                        _hover={{
                                            bg: "none",
                                            color: "red",
                                        }}
                                        _active={{ color: "white" }}
                                    />
                                </Flex>
                            </GridItem>
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
