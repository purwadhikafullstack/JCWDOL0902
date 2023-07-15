import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Product from "./Product";
import { AiOutlineCamera } from "react-icons/ai";
import Swal from "sweetalert2";
import axios from "axios";

function getColorById(id) {
  const orderStatusPalette = {
    1: { background: "#F9DC5C", text: "#ffffff" }, // Waiting for Payment
    2: { background: "#f0ad4e", text: "#ffffff" }, // Waiting Payment Confirmation
    3: { background: "#f0ad4e", text: "#ffffff" }, // Processed
    4: { background: "#5bc0de", text: "#FFFFFF" }, // Shipped
    5: { background: "#5cb85c", text: "#ffffff" }, // Order Confirmed
    6: { background: "#d9534f", text: "#ffffff" }, // Canceled
  };

  return orderStatusPalette[id] || { background: "", text: "" }; // Return the color object or an empty object if ID is not found
}

const BASE_API = process.env.REACT_APP_API_BASE_URL;

const OrderItem = ({ data, refetch }) => {
  const [isSmallScreen] = useMediaQuery("(max-width: 666px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleCancelOrder = () => {
    Swal.fire({
      title: "Apakah anda ingin membatalkan pesanan?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: `Tidak`,
      confirmButtonColor: "red",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("order_status_id", 6);

        await updateTransaction(formData);
        Swal.fire({
          text: "Order has been cancelled!",
          icon: "warning",
        });
      }
    });
  };

  const handleUploadOrder = async () => {
    if (!file) {
      return Swal.fire({
        icon: "warning",
        text: `Please upload payment proof!`,
      });
    }
    onClose();
    const formData = new FormData();
    formData.append("order_status_id", 2);
    formData.append("images", file);
    await updateTransaction(formData);
    Swal.fire({
      text: "Order has been confirmed!",
      icon: "success",
    });
  };

  const handleAcceptOrder = async () => {
    const formData = new FormData();
    formData.append("order_status_id", 5); 
    // await updateTransaction(formData);
    Swal.fire({
      text: "Apakah anda yakin sudah menerima order?",
      icon: "warning",
      showConfirmButton:true,
      showCancelButton:true
    });
  };

  

  const updateTransaction = async (body) => {
    try {
      const { data: response } = await axios.patch(
        BASE_API + `/users/transaction/${data.id}`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      await refetch();
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      flexDirection={"column"}
      mx="2"
      mt="5"
      border={"2px"}
      rounded={"xl"}
      borderColor={"gray.400"}
    >
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"2"}
        borderBottom={"2px"}
        borderColor={"gray.200"}
      >
        <Text>#{data.id}</Text>
        <Text
          px={"2"}
          py={"1"}
          rounded={"lg"}
          style={{
            backgroundColor: getColorById(data.order_status.id).background,
            color: getColorById(data.order_status.id).text,
            fontWeight: "bold",
          }}
        >
          {data.order_status.status}
        </Text>
      </Flex>
      <Flex flexDir={"column"}>
        {data.transaction_items.map((item, i) => (
          <Product data={item} key={i} />
        ))}
      </Flex>
      <Flex
        p={"2"}
        flexDirection={isSmallScreen ? "column" : "row"}
        gap={"2"}
        justifyContent={"space-between"}
      >
        <Text fontSize={"lg"}>Total Belanja : </Text>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          Rp{Intl.NumberFormat("id-ID").format(data.total_price)}
        </Text>
      </Flex>
      {data.order_status.id === 1 && (
        <Flex
          p={"2"}
          flexDirection={isSmallScreen ? "column" : "row"}
          gap={"2"}
          justifyContent={"space-between"}
          borderTop={"2px"}
          borderColor={"gray.200"}
        >
          <Button colorScheme="green" onClick={onOpen}>
            Upload bukti pembayaran
          </Button>
          <Button colorScheme="red" onClick={handleCancelOrder}>
            Batalkan Pesanan
          </Button>
        </Flex>
      )}
      {data.order_status.id === 4 && (
        <Flex
          p={"2"}
          flexDirection={isSmallScreen ? "column" : "row"}
          gap={"2"}
          justifyContent={"space-between"}
          borderTop={"2px"}
          borderColor={"gray.200"}
        >
          <Button colorScheme="green" onClick={handleAcceptOrder}>
            Selesaikan Pesanan
          </Button>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload bukti pembayaran</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <label htmlFor="upload">
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                fontSize={"3xl"}
                cursor={"pointer"}
                border={"dashed"}
                p={"5"}
                overflow={"hidden"}
                w={"full"}
                h={"full"}
              >
                <input
                  type="file"
                  // value={file}
                  onChange={(e) => setFile(e.currentTarget.files[0])}
                  hidden
                  id="upload"
                />
                {file ? (
                  <Box flex={1} w={"full"} h="full">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="payment-proof"
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "10rem",
                      }}
                    />
                    <Text fontSize={"sm"}>{file.name}</Text>
                  </Box>
                ) : (
                  <AiOutlineCamera />
                )}
              </Flex>
            </label>
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"center"} w={"full"}>
            <Button colorScheme="blue" mr={3} onClick={handleUploadOrder}>
              Upload
            </Button>
            <Button variant="solid" colorScheme="red" onClick={onClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default OrderItem;
