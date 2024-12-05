const joi=require("joi")

const carCreateSchema=joi.object({
    model:joi.string().min(2).max(18).required()
})


const userCreateSchem=joi.object({
    fullName:joi.string().min(2).max(30).required(),
    login:joi.string().required(),
    password:joi.string().min(3).max(30).required(),
})
 module.exports={carCreateSchema,userCreateSchem}