const express = require("express")
const app = express()
const path = require("path")
const db = require("mongoose")
const PORT = 4000

db.connect("").then(()=>{
    console.log("DB connected!")
}).catch((err)=>{
    console.log("Error connecting!", err)
})

app.use(express.json())
app.use(express.static("client"))

//Get requests
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "add-employee.html"))
})

// const employeeSchema = new db.Schema({
//     name:String,
//     department:String,
//     age:Number,
//     salery:Number
// })


// const Employee = db.model("Employee",employeeSchema)

// app.post("/", async (req,res)=>{
//     const {name , department , age , salery} = req.body
//     if(!name){
//         return res.status(400).send("Error: name is required")
//     }

//     const employeeObject = {name , department , age , salery}
//     try {
//         await addEmployee(employeeObject)
//         console.log("User added to DB.")
//         res.send("Success!")
//     } catch (error) {
//         res.status(500).send("Something happend" + error.message)
//     }
// })

app.post("/singup", async(req,res)=>{
    const {name, oldDepartment, newDepartment} = req.body
    try {
        let result = await Employee.findOneAndUpdate(
            {name: name, department: oldDepartment},
            {$set:{department: newDepartment}},
            {new: true}
        )
        if(result){
            res.send(`${result.name}'s department now been changed to ${result.department}`)
        }else{
            res.status(404).send("No such name found")
        }
    } catch (error) {
        res.status(500).send("Something happend" + error.message)
    }
})

app.post("/products", async(req,res)=>{
    const {name, oldDepartment, newDepartment} = req.body
    try {
        let result = await Employee.findOneAndUpdate(
            {name: name, department: oldDepartment},
            {$set:{department: newDepartment}},
            {new: true}
        )
        if(result){
            res.send(`${result.name}'s department now been changed to ${result.department}`)
        }else{
            res.status(404).send("No such name found")
        }
    } catch (error) {
        res.status(500).send("Something happend" + error.message)
    }
})

app.post("/buy", async(req,res)=>{
    const {name, oldDepartment, newDepartment} = req.body
    try {
        let result = await Employee.findOneAndUpdate(
            {name: name, department: oldDepartment},
            {$set:{department: newDepartment}},
            {new: true}
        )
        if(result){
            res.send(`${result.name}'s department now been changed to ${result.department}`)
        }else{
            res.status(404).send("No such name found")
        }
    } catch (error) {
        res.status(500).send("Something happend" + error.message)
    }
})

app.post("/all", async(req,res)=>{
    const {name, oldDepartment, newDepartment} = req.body
    try {
        let result = await Employee.findOneAndUpdate(
            {name: name, department: oldDepartment},
            {$set:{department: newDepartment}},
            {new: true}
        )
        if(result){
            res.send(`${result.name}'s department now been changed to ${result.department}`)
        }else{
            res.status(404).send("No such name found")
        }
    } catch (error) {
        res.status(500).send("Something happend" + error.message)
    }
})


app.listen(PORT, ()=>{
    console.log(`Server is on: http://localhost:${PORT}`)    
})