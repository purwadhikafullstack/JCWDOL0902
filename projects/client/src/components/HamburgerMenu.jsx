import React, { useState } from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Button,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <Button onClick={handleToggle} variant="ghost">
                <HamburgerIcon w={6} h={6} color="white" />
            </Button>
            <Drawer isOpen={isOpen} placement="left" onClose={handleToggle}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        {/* Categories */}
                        <h2>Categories</h2>
                        <ul>
                            <li>Category 1</li>
                            <li>Category 2</li>
                            <li>Category 3</li>
                        </ul>

                        {/* Filters */}
                        <h2>Filters</h2>
                        <ul>
                            <li>Filter 1</li>
                            <li>Filter 2</li>
                            <li>Filter 3</li>
                        </ul>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
