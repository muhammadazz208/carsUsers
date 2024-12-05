const express=require("express")
const cors=require("cors")
const { carCreateSchema,userCreateSchem } = require("./schema")
const axios=require("axios")
const app=express()
const port=7777

const cars=[{
    id:1,
    model:"bmw"
},{
    id:2,
    model:"porsche"
}]
function getById(id) {
    const foundUser=cars.findIndex((el)=>el.id===id)
    if (foundUser===-1) {
        return undefined
    }else{
        return foundUser
    }
}
app.use(cors())
app.use(express.json())



app.get("/api/cars",(req,res)=>{
    res.status(200).json({statusCode:200,message:"cars",data:cars})
})


app.post("/api/cars",(req,res)=>{
    const dto=req.body
    const {error}=carCreateSchema.validate(dto)

    if (error) {
        return res.status(400).json({statusCode:400,message:error.message})
    }

    const newCar={
        id:cars[cars.length-1].id+1,
        loginmodel:dto.model,
    }
    cars.push(newCar)

    res.status(201).json({statusCode:201,message:"created",data:newCar})
})

app.get("/api/users",async(req,res)=>{
    try {
        const response=await axios.get("http://localhost:3000/api/users") 
        res.status(200).json({statusCode:200,message:"jusfdsfd",data:response.data})

    } catch (error) {
        res.status(500).json({statusCode:500,message:error.message})
    }
})

app.post("/api/users",async(req,res)=>{
    try {
        const dto=req.body
        const {error}=userCreateSchem.validate(dto)
        if (error) {
           return res.status(400).json({statusCode:400,message:"bad request",data:error.message})
        }
        const response=await axios.post("http://localhost:3000/api/users",dto)

        res.status(201).json({statusCode:201,message:"created",data:response.data})
    } catch (error) {
        res.status(500).json({statusCode:500,message:error.message})
    }
})

app.delete("/api/users/:id",async(req,res)=>{
try {
    let userId=req.params.id
    if (isNaN(userId)) {
        return res.status(400).json({statusCode:400,message:"invalid id"})
    }
    const response=await axios.delete("http://localhost:3000/api/users/"+userId)
    res.status(200).json({statusCode:200,message:"success",data:response.data})
} catch (error) {
    res.status(500).json({statusCode:500,message:error.message})
}

})

app.delete("/api/cars/:id",(req,res)=>{
    const id=Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({statusCode:400,message:"invalid id"})
    }
    const car=getById(id)

    if (typeof car==="undefined") {
        return  res.status(404).json({statusCode:404,message:"not found"})
    }
    const deletedUser=cars.splice(car,1)
    res.status(200).json({statusCode:200,message:"success",data:deletedUser})
})
app.put("/api/cars/:id",(req,res)=>{
    const id=Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({statusCode:400,message:"invalid id"})
    }
    const car=getById(id)
    if (typeof car=== "undefined") {
        return res.status(404).json({ statusCode: 404, message: "not found" });
    }

    const dto = req.body;
    const { error } = carCreateSchema.validate(dto);
    if (error) {
        return res.status(400).json({ statusCode: 400, message: error.message });
    }
    cars[car]={
        ...cars[car],
        model:dto.model|| cars[car].model,
    } 
    res.status(200).json({ statusCode: 200, message: "updated", data: cars[car] })
})
app.patch("/api/cars/:id",(req,res)=>{
    const id=Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({statusCode:400,message:"invalid id"})
    }
    const car=getById(id)
    if (typeof car=== "undefined") {
        return res.status(404).json({ statusCode: 404, message: "not found" });
    }
    const dto = req.body;
    const { error } = carCreateSchema.validate(dto);
    if (error) {
        return res.status(400).json({ statusCode: 400, message: error.message });
    }
    cars[car]={
        ...cars[car],
        model: dto.model || cars[car].model
    } 
    res.status(200).json({ statusCode: 200, message: "updated", data: cars[car] })
})
app.listen(port,()=>{
    console.log("server is running on port ",port);
    
})