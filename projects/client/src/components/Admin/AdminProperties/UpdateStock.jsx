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
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Center,
    Button,
    Select,
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BiEdit } from "react-icons/bi";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const UpdateStock = ({ stock, getStock }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Button
                rightIcon={<BiEdit />}
                bg={"#495057"}
                color={"white"}
                _hover={{ bg: "#DEE2E6", color: "#495057" }}
                textAlign={"center"}
                onClick={onOpen}
            >
                Update Stock
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>Update Stock</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <EditForm
                            stockValue={stock}
                            getStock={getStock}
                            close={onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const EditForm = ({ close, stockValue, getStock }) => {
    const url =
        process.env.REACT_APP_API_BASE_URL +
        `/admin/edit-product-stock/${stockValue.id}`;
    const token = localStorage.getItem("token");

    const validation = Yup.object().shape({
        name: Yup.string().required("Required"),
    });

    const editStock = async (value) => {
        try {
            if (value.name !== stockValue.name) {
                const editData = {
                    name: value.name,
                };
                await Axios.patch(url, editData, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                getStock();

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: `Stock Updated`,
                });
            }

            close();
        } catch (err) {
            console.log(err);
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
                    name: stockValue.name,
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                    editStock(value);
                }}
            >
                {(props) => {
                    return (
                        <Form>
                            <FormControl>
                                <FormLabel>
                                    {stockValue.name} (
                                    {
                                        stockValue.user.warehouse_location
                                            .warehouse_name
                                    }
                                    )
                                </FormLabel>
                                {/* <Input  as={Field} name={"name"} /> */}

                                <Select
                                    paddingRight={"5px"}
                                    defaultValue={"All Warehouse"}placeholder="Select Type of Journal"
                                >
                                    <option value={"type"}>penjualan product</option>
                                    <option value={"type"}>penambahan stock oleh admin</option>
                                    <option value={"type"}>pengurangan stock oleh admin</option>
                                </Select>

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
