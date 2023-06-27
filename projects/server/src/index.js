const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const db = require("./models");

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
} = require("./routes/index");

//users
app.use("/api/users", userRouters);
app.use("/api/users", userProfileRouters);
app.use("/api/users", userAddressRouters);
app.use("/api/users", userOrderRouters);

//admin
app.use("/api/admin", adminUserRouters);
app.use("/api/admin", adminWarehouseRouters);
app.use("/api/admin", categoryRouters);
app.use("/api/admin", adminProductRouters);
app.use("/api/admin", adminStockRouters);
app.use("/api/admin", adminMutationRouters);
app.use("/api/admin", adminStockReportRouters);

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

app.listen(PORT, (err) => {
    if (err) {
        console.log(`ERROR: ${err}`);
    } else {
        // db.sequelize.sync({ alter: true });
        console.log(`APP RUNNING at ${PORT} ✅`);
    }
});
