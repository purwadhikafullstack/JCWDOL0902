import { Flex, Button, useToast } from "@chakra-ui/react";

import axios from "axios";
import swal from "sweetalert";

import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

export const ApproveMutation = ({ mutationId, getMutation }) => {
    const baseApi = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("token");

    const toast = useToast();

    const actionMutation = async (value) => {
        try {
            await axios.patch(
                `${baseApi}/admin/approve/${mutationId}`,
                { approved: value },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTimeout(
                () =>
                    toast({
                        position: "top",
                        title: `Request Mutation ${value} Successfully `,
                        status: "success",
                        isClosable: true,
                    }),
                2000
            );
            getMutation();
        } catch (error) {
            console.log(error.response.data);
        }
    };
    const handleApprove = (value) => {
        swal({
            title: "Approve Request Mutation",
            text: "Are you sure?",
            icon: "success",
            buttons: ["Cancel", "Approve"],
        }).then((confirmed) => {
            if (confirmed) {
                actionMutation(value);
            }
        });
    };
    const handleReject = (value) => {
        swal({
            title: "Delete Request Mutation",
            text: "Are you sure?",
            icon: "error",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        }).then((confirmed) => {
            if (confirmed) {
                actionMutation(value);
            }
        });
    };

    return (
        <>
            <Flex gap={"3"} justifyContent={"space-evenly"}>
                <Button
                    onClick={() => handleApprove("Accepted")}
                    variant={"unstyled"}
                    color={"green.500"}
                    fontSize={"3xl"}
                >
                    <AiFillCheckCircle />
                </Button>
                <Button
                    onClick={() => handleReject("Rejected")}
                    variant={"unstyled"}
                    color={"red.500"}
                    fontSize={"3xl"}
                >
                    <AiFillCloseCircle />
                </Button>
            </Flex>
        </>
    );
};
