import React from "react";
import { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    Button,
    Avatar,
    Box,
    Stack,
} from "@chakra-ui/react";
import decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import {
    FaUser,
    FaMapMarkerAlt,
    FaShoppingCart,
    FaHistory,
} from "react-icons/fa";

import { RegisterationForm } from "./Authentications/RegisterationForm";
import { LoginForm } from "./Authentications/LoginForm";

import userLogin from "../assets/default_avatar.jpg";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

const serverApi = process.env.REACT_APP_SERVER;

export const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let decodedToken;
    if (token) {
        decodedToken = decode(token);
    } else {
        decodedToken = null;
    }

    const dispatch = useDispatch();
    const onLogout = async () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
    };

    const onOpen = () => {
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    return (
        <Box>
            <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
                <PopoverTrigger>
                    <Button
                        as={Avatar}
                        size="xl"
                        src={
                            token
                                ? `${serverApi}${decodedToken.picture}`
                                : userLogin
                        }
                        bg="grey"
                        boxSize={{ base: 8, lg: 12 }}
                        borderRadius="50%"
                        onClick={onOpen}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                        <Box>
                            <Box fontWeight="600" fontSize="lg">
                                {token
                                    ? `Hi, ${decodedToken.name}`
                                    : "Login Menu"}
                            </Box>
                        </Box>
                    </PopoverHeader>
                    <PopoverBody display="flex" flexDir="column">
                        {token ? (
                            <Stack>
                                <Button
                                    as={Link}
                                    to="/profile/settings"
                                    fontWeight="600"
                                    colorScheme="linkedin"
                                >
                                    <FaUser style={{ marginRight: "0.5rem" }} />{" "}
                                    Profile
                                </Button>
                                <Button
                                    as={Link}
                                    to="/profile/settings"
                                    fontWeight="600"
                                    colorScheme="linkedin"
                                >
                                    <FaMapMarkerAlt
                                        style={{ marginRight: "0.5rem" }}
                                    />{" "}
                                    Address
                                </Button>
                                <Button
                                    as={Link}
                                    to="/cart"
                                    fontWeight="600"
                                    colorScheme="linkedin"
                                >
                                    <FaShoppingCart
                                        style={{ marginRight: "0.5rem" }}
                                    />{" "}
                                    Cart
                                </Button>
                                <Button
                                    as={Link}
                                    to="/cart"
                                    fontWeight="600"
                                    colorScheme="linkedin"
                                >
                                    <FaHistory
                                        style={{ marginRight: "0.5rem" }}
                                    />{" "}
                                    My Order History
                                </Button>
                            </Stack>
                        ) : (
                            <Stack>
                                <LoginForm />
                                <RegisterationForm />
                            </Stack>
                        )}
                    </PopoverBody>
                    {token && (
                        <PopoverFooter>
                            <Box display="flex" justifyContent="flex-end">
                                <Button onClick={onLogout} colorScheme="red">
                                    Log Out
                                </Button>
                            </Box>
                        </PopoverFooter>
                    )}
                </PopoverContent>
            </Popover>
        </Box>
    );
};
