// chakra
import { Box, Container } from "@chakra-ui/react";
import { DrawerAdminResponsive } from "./AdminDrawerResponsive";
import { DrawerItems } from "./AdminDrawerItems";

export const DrawerAdmin = () => {
    return (
        <Box>
            <Container>
                <DrawerAdminResponsive />
                <Box
                    bg={"#343A40"}
                    w={{ base: 40, md: 60 }}
                    pos={"fixed"}
                    h={"full"}
                    display={{ base: "none" }}
                    left={0}
                    top={0}
                >
                    <DrawerItems />
                </Box>
            </Container>
        </Box>
    );
};
