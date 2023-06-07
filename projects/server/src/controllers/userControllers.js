const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { hashPassword, hashMatch } = require("../helpers/hashpassword");
const transporter = require("../helpers/transporter");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const { createToken } = require("../helpers/token");

//import model
const db = require("../models");
const user = db.user;

//env
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    register: async (req, res) => {
        try {
            let { name, email, phone_number } = req.body;

            if (!name || !email || !phone_number)
                throw { message: "please complete your data" };

            let dataEmail = await user.findOne({
                where: {
                    email,
                },
            });

            if (dataEmail) throw { message: "Email already registered" };

            if (isNaN(phone_number)) throw { message: "Please input a number" };

            if (phone_number.length < 8 || phone_number.length > 13)
                throw { message: "Please input a valid phone number" };

            let createUser = await user.create({
                id: uuidv4(),
                name,
                email,
                phone_number,
                password: await hashPassword("DefaultPass1234"),
                is_verified: false,
                role: 1,
            });

            const template = await fs.readFile(
                path.resolve(__dirname, "../template/confirmation.html"),
                "utf-8"
            );
            const templateToCompile = await handlebars.compile(template);
            const newTemplate = templateToCompile({
                name,
                email,
                url: `${process.env.URL}/activation/${createUser.dataValues.id}`,
            });
            await transporter.sendMail({
                from: "KicksHub",
                to: email,
                subject: "Account Activation",
                html: newTemplate,
            });

            res.status(200).send({
                status: true,
                message: "Register Success",
                data: createUser,
            });
        } catch (error) {
            console.log(error);
            res.status(401).send({
                status: false,
                message: error.message,
            });
        }
    },
    activation: async (req, res) => {
        try {
            let { id } = req.params;
            let { password, password_confirmation } = req.body;

            let dataUser = await user.findOne({
                where: {
                    id,
                    is_verified: false,
                },
            });

            if (!dataUser)
                throw {
                    message: "User not found or account is already verified",
                };

            if (!password || !password_confirmation)
                throw { message: "Please complete your data" };

            if (password !== password_confirmation)
                throw { message: "Password does not match" };

            if (password.length < 8)
                throw {
                    message: "Password must contain at least 8 characters",
                };

            await user.update(
                { is_verified: true, password: await hashPassword(password) },
                {
                    where: {
                        id,
                    },
                }
            );
            res.status(200).send({
                status: true,
                message: "Account verified!",
            });
        } catch (error) {
            console.log(error);
            res.status(404).send({
                status: false,
                message: error.message,
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                throw { message: "Please Complete Your Data" };

            const dataUser = await user.findOne({
                where: {
                    email,
                },
            });
            if (!dataUser)
                throw {
                    status: false,
                    message: "User Not Found",
                };

            let matchPassword = await hashMatch(
                password,
                dataUser.dataValues.password
            );

            if (matchPassword == false)
                return res.status(404).send({
                    status: false,
                    message: "Wrong Password",
                });

            const token = createToken({
                id: dataUser.dataValues.id,
                role: dataUser.dataValues.role,
                picture: dataUser.dataValues.photo_profile,
                name: dataUser.dataValues.name,
            });

            res.status(200).send({
                status: true,
                message: "Login Success",
                data: {
                    username: dataUser.dataValues.name,
                    role: dataUser.dataValues.role,
                    token: token,
                    id: dataUser.dataValues.id,
                },
            });
        } catch (error) {
            res.status(404).send({
                status: false,
                message: error.message,
            });
        }
    },
};
