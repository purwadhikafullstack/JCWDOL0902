const { Op } = require("sequelize");
const { hashPassword, hashMatch } = require("../helpers/hashpassword");
const fs = require("fs");

//import model
const db = require("../models");
const user = db.user;

module.exports = {
    fetchUserData: async (req, res) => {
        try {
            const userData = dataToken;

            if (req.params.id !== userData.id) {
                throw {
                    message: "Unauthorized access",
                };
            }
            const response = await user.findOne({
                where: { id: req.params.id },
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password"],
                },
            });
            res.status(200).send(response);
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    profileUserSettings: async (req, res) => {
        try {
            const userData = dataToken;

            if (req.params.id !== userData.id) {
                throw {
                    message: "Unauthorized access",
                };
            }
            await user.update(req.body, {
                where: { id: req.params.id },
            });
            res.status(200).send({
                status: true,
                message: "Success update profile",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    uploadPicture: async (req, res) => {
        try {
            await user.update(
                {
                    photo_profile: `Public/images/${req.files.images[0].filename}`,
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );

            res.status(200).send({
                status: true,
                message: "Success updating profile picture",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword, newPasswordConfirmation } =
                req.body;

            const checkUser = await user.findOne({
                where: { id: req.params.id },
            });
            const validPassword = await hashMatch(
                oldPassword,
                checkUser.password
            );
            if (!validPassword) {
                throw { message: "Incorrect old password" };
            }
            if (oldPassword === newPassword) {
                throw { message: "Enter a new password" };
            }
            if (newPassword !== newPasswordConfirmation) {
                throw { message: "Password does not match" };
            }

            const updatedPassword = await hashPassword(newPassword);
            await user.update(
                { password: updatedPassword },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );

            res.status(200).send({
                status: true,
                message: "Password Successfully changed",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
};
