const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const db = require("./models");
const scheduler = require("node-schedule");
const transaction = db.transaction;
const { Op } = require("sequelize");
const moment = require("moment");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
//     cors({
//         origin: [
//             process.env.WHITELISTED_DOMAIN &&
//                 process.env.WHITELISTED_DOMAIN.split(","),
//         ],
//     })
// );

app.use(express.json());
app.use("/Public", express.static(path.join(__dirname, "Public")));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
    res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
    res.status(200).json({
        message: "Hello, Student !",
    });
});

//routes
const {
    userRouters,
    adminUserRouters,
    adminWarehouseRouters,
    rajaOngkirRouters,
    categoryRouters,
    adminProductRouters,
    productRouters,
    userProfileRouters,
    adminStockRouters,
    userOrderRouters,
    adminMutationRouters,
    userAddressRouters,
    adminStockReportRouters,
    adminTransactionRouters,
    userTransactionRouters,
    adminSalesReportRouters,
} = require("./routes/index");

//users
app.use("/api/users", userRouters);
app.use("/api/users", userProfileRouters);
app.use("/api/users", userAddressRouters);
app.use("/api/users", userOrderRouters);
app.use("/api/users", userTransactionRouters);

//admin
app.use("/api/admin", adminUserRouters);
app.use("/api/admin", adminWarehouseRouters);
app.use("/api/admin", categoryRouters);
app.use("/api/admin", adminProductRouters);
app.use("/api/admin", adminStockRouters);
app.use("/api/admin", adminMutationRouters);
app.use("/api/admin", adminStockReportRouters);
app.use("/api/admin", adminTransactionRouters);
app.use("/api/admin", adminSalesReportRouters);

//products
app.use("/api/products", productRouters);

//rajaongkir
app.use("/api", rajaOngkirRouters);

// ===========================

// not found
app.use((req, res, next) => {
    if (req.path.includes("/api/")) {
        res.status(404).send("Not found !");
    } else {
        next();
    }
});

// error
app.use((err, req, res, next) => {
    if (req.path.includes("/api/")) {
        console.error("Error : ", err.stack);
        res.status(500).send("Error !");
    } else {
        next();
    }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
    res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

// schedule to check payment and user confirmation
const checkPayment = async () => {
    try {
        console.log("CHECKING PAYMENT");
        const currentDate = new Date();
        const transactions = await transaction.findAll({
            where: {
                order_status_id: 1,
                transaction_date: {
                    [Op.gte]: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate()
                    ).setUTCHours(0, 0, 0, 0),
                    [Op.lt]: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 1
                    ).setUTCHours(0, 0, 0, 0),
                },
            },
        });

        await Promise.all(
            transactions.map(async (item) => {
                const expDate = new Date(item.expired);
                if (expDate < currentDate) {
                    await transaction.update(
                        {
                            order_status_id: 6,
                        },
                        { where: { id: item.id } }
                    );
                }
            })
        );
    } catch (error) {
        console.log("Error Check Payment", error);
    }
};
const checkSent = async () => {
    try {
        // console.log("CHECKING Sent");
        const currentDate = new Date();

        // return daysDifference > 7;
        const transactions = await transaction.findAll(
            {
                order_status_id: 4,
            },
            {
                where: {
                    id: item.id,
                },
            }
        );

        await Promise.all(
            transactions.map(async (item) => {
                const expDate = new Date(item.transaction_date);
                const timeDifference =
                    currentDate.getTime() - expDate.getTime();
                const daysDifference = timeDifference / (1000 * 3600 * 24);

                if (daysDifference > 6) {
                    await transaction.update(
                        {
                            order_status_id: 5,
                        },
                        { where: { id: item.id } }
                    );
                }
            })
        );
    } catch (error) {
        console.log("Error Check Sent", error);
    }
};

const schedule1 = scheduler.scheduleJob("*/10 * * * *", checkPayment);
const schedule2 = scheduler.scheduleJob("0 1 * * *", checkSent);

app.listen(PORT, (err) => {
    if (err) {
        console.log(`ERROR: ${err}`);
    } else {
        // db.sequelize.sync({ alter: true });
        console.log(`APP RUNNING at ${PORT} ✅`);
    }
});
