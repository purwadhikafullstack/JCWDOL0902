import { Text, useToast } from "@chakra-ui/react";

import { useState } from "react";
import axios from "axios";
import swal from "sweetalert";

export const DeleteAddress = ({ item, getAddressUser, baseApi, id }) => {
    const [isLoading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const toast = useToast();

    const deleteAddress = async (item) => {
        try {
            setLoading(true);
            await axios.delete(`${baseApi}/users/delete-address/${item.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTimeout(
                () =>
                    toast({
                        position: "top",
                        title: "Successfully Deleting Address",
                        status: "success",
                        isClosable: true,
                    }),
                2000
            );
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            setLoading(false);
        }
    };
    const handleDelete = () => {
        swal({
            title: "Delete Address",
            text: "Are you sure?",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        }).then((confirmed) => {
            if (confirmed) {
                deleteAddress(item);
            }
        });
    };

    return (
        <>
            <Text
                cursor={"pointer"}
                hidden={item?.status ? true : false}
                onClick={handleDelete}
                color={"red"}
                fontWeight={"bold"}
            >
                Delete
            </Text>
        </>
    );
};
