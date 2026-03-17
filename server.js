//------------------------------------------------------------------------------------------------------------
const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const XLSX = require("xlsx")
const PORT = 4000

// ----------------------
// SCHEMAS & MODELS
// ----------------------
const registeredUserSchema = new mongoose.Schema({
    email: String,
    password: String
})

const productsListSchema = new mongoose.Schema({
    itemName: String,
    price: Number
})

const waitingOrdersSchema = new mongoose.Schema({
    userEmail: String,
    items: Array
})

const RegisteredUser = mongoose.model("registeredUser", registeredUserSchema)
const ProductsList = mongoose.model("productsList", productsListSchema)
const WaitingOrders = mongoose.model("waitingOrders", waitingOrdersSchema)

// ----------------------
// EXCEL IMPORT FUNCTION
// ----------------------
async function loadProductsFromExcel() {
    try {
        const workbook = XLSX.readFile("products.xlsx")
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const products = XLSX.utils.sheet_to_json(sheet)

        const count = await ProductsList.countDocuments()
        if (count > 0) {
            console.log("Products already exist in DB, skipping import.")
            return
        }

        // await ProductsList.deleteMany({})
        await ProductsList.insertMany(products)
        console.log("Products imported from Excel!")

    } catch (err) {
        console.log("Error loading Excel:", err)
    }
}

// ----------------------
// CONNECT TO DATABASE
// ----------------------
mongoose.connect("mongodb+srv://dvir4500:12345@cluster0.oxfrzio.mongodb.net/svshop")
    .then(async () => {
        console.log("DB connected!")
        await loadProductsFromExcel()
    })
    .catch(err => console.log("Error connecting!", err))

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(express.json())
app.use(express.static("client"))

function adminCheck(req, res, next) {
    if (req.query.admin === "true") {
        return next()
    }

    res.status(400).send("error")
}

// ----------------------
// ROUTES
// ----------------------
app.get("/all", adminCheck, async (req, res) => {
    try {
        const orders = await WaitingOrders.find()
        res.json(orders)
    } catch (err) {
        res.status(500).send("Server error: " + err.message)
    }
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"))
})

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "signup.html"))
})

app.get("/products", async (req, res) => {
    const products = await ProductsList.find()
    res.json(products)
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).send("Email and password are required")

    try {
        const user = await RegisteredUser.findOne({ email })

        if (!user)
            return res.status(404).send("User not found - please signup")

        if (user.password !== password)
            return res.status(401).send("Incorrect password")

        res.send("Signin successful")

    } catch (error) {
        res.status(500).send("Server error: " + error.message)
    }
})

app.post("/signup", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).send("Email and password are required")

    try {
        const exists = await RegisteredUser.findOne({ email })

        if (exists)
            return res.status(400).send("User already exists")

        const newUser = new RegisteredUser({ email, password })
        await newUser.save()

        res.status(201).send("Signup successful")

    } catch (error) {
        res.status(500).send("Server error: " + error.message)
    }
})

app.post("/buy", async (req, res) => {
    const { userEmail, items } = req.body

    if (!userEmail || !items || items.length === 0)
        return res.status(400).send("Invalid order")

    try {
        const order = new WaitingOrders({ userEmail, items })
        await order.save()
        res.send("Order saved successfully")

    } catch (error) {
        res.status(500).send("Error saving order: " + error.message)
    }
})

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
    console.log(`Server is on: http://localhost:${PORT}`)
})