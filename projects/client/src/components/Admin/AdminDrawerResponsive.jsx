// import {
//     Drawer,
//     DrawerContent,
//     DrawerCloseButton,
//     useDisclosure,
//     Box,
// } from "@chakra-ui/react";

// import { HamburgerIcon } from "@chakra-ui/icons";
// import { DrawerItems } from "./AdminDrawerItems";

// export const DrawerAdminResponsive = () => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     return (
//         <Box>
//             <HamburgerIcon
//                 color={"white"}
//                 display={{ base: "flex", md: "none" }}
//                 onClick={onOpen}
//                 variant="outline"
//                 aria-label="open menu"
//                 w={6}
//                 h={6}
//             />
//             <Drawer
//                 autoFocus={false}
//                 isOpen={isOpen}
//                 placement="left"
//                 onClose={onClose}
//                 returnFocusOnClose={false}
//                 onOverlayClick={onClose}
//                 size={"xs"}
//             >
//                 <DrawerContent bg={"#343A40"}>
//                     <DrawerCloseButton color={"white"} />
//                     <DrawerItems onClose={onClose} />
//                 </DrawerContent>
//             </Drawer>
//         </Box>
//     );
// };
