const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "Please enter name"]
        },
        photo:{
            type: String,
            required: [true, "Please enter photo"]
        },
        price:{
            type: Number,
            required: [true, "please enter price"]
        },
        stock:{
            type:Number,
            required: [true, "please enter stock"]
        },
        category:{
            type: String,
            required:[true, "please enter category"],
            trim: true
        },
    },
    {
        timestamps: true,
    }    
)

const Product = mongoose.model('Products', ProductSchema);

module.exports = Product;