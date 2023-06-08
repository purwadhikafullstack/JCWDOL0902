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
} from "@chakra-ui/react";

// swal
import Swal from "sweetalert2";

// icons
import { BsFillGearFill } from "react-icons/bs";
import { RxCheck, RxCross1 } from "react-icons/rx";

export const EditCategory = ({ category, getCategory }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <IconButton icon={<BsFillGearFill />} bg={"none"} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditForm
              categoryValue={category}
              getCategory={getCategory}
              close={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const EditForm = ({ close, categoryValue, getCategory }) => {
  const url =
    process.env.REACT_APP_API_BASE_URL +
    `/editCategory/${categoryValue.id}`;
  const token = localStorage.getItem("token");

  const validation = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const editCategory = async (value) => {
    try {
      if (value.name !== categoryValue.name) {
        const editData = {
          name: value.name,
        };
        await Axios.patch(url, editData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        getCategory();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Category Edited`,
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
          // category: "",
          name: categoryValue.name,
        }}
        validationSchema={validation}
        onSubmit={(value) => {
          editCategory(value);
        }}
      >
        {(props) => {
          return (
            <Form>
              <FormControl>
                <FormLabel>Category</FormLabel>
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
