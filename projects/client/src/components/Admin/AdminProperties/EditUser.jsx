// react
import Axios from "axios";

// validation
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

// chakra
import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Center,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditUser = ({ user, getUsers }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <IconButton
                icon={<BsFillGearFill />}
                bg={"none"}
                onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Edit User</ModalHeader>
                    <ModalBody>
                        <EditForm
                            user={user}
                            getUsers={getUsers}
                            close={onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const EditForm = ({ user, close, getUsers }) => {
    const url = process.env.REACT_APP_API_BASE_URL + `/edituser/${user.id}`;
    const token = localStorage.getItem("token");

    const validation = Yup.object().shape({
        name: Yup.string().required("Cannot be Empty"),
        phone_number: Yup.string().required("Cannot be Empty"),
    });

    const editUser = async (value) => {
        try {
            if (
                value.name !== user.name ||
                value.phone_number !== user.phone_number
            ) {
                const editData = {
                    name: value.name,
                    phone_number: value.phone_number,
                };
                await Axios.patch(url, editData, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                getUsers();
            }

            Swal.fire({
                icon: "success",
                title: "Success",
                text: `User Edited`,
            });

            close();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data.name
                    ? err.response.data.errors[0].message.toUpperCase()
                    : err.response.data.toUpperCase(),
            });
        }
    };

    return (
        <Box>
            <Formik
                initialValues={{
                    name: user.name,
                    phone_number: user.phone_number,
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    editUser(value);
                }}
            >
                {(props) => {
                    return (
                        <Form>
                            <FormControl>
                                <FormLabel>Phone Number</FormLabel>
                                <Input as={Field} name={"phone_number"} />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="phone_number"
                                />
                                <FormLabel>Name</FormLabel>
                                <Input as={Field} name={"name"} />
                                <ErrorMessage
                                    style={{ color: "red" }}
                                    component="div"
                                    name="name"
                                />
                                <Center paddingTop={"10px"} gap={"10px"}>
                                    <IconButton
                                        icon={<RxCheck />}
                                        fontSize={"3xl"}
                                        color={"green"}
                                        type={"submit"}
                                    />
                                    <IconButton
                                        icon={<RxCross1 />}
                                        fontSize={"xl"}
                                        color={"red"}
                                        onClick={close}
                                    />
                                </Center>
                            </FormControl>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};
