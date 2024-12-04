const { faker } = require('@faker-js/faker');
const express = require('express');
const Product = require('./schema');
const ConnectDB = require('./ConnectDB');
require('dotenv').config();
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();

const nodeCache = new NodeCache({
    // stdTTL: 60
})

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get('/',(req,res)=>{
    res.send("apis working");
})

app.get('/products',async(req,res)=>{

    let products;

    if(nodeCache.has("products")){
        products = JSON.parse(nodeCache.get("products"));
    }else{
        products = await Product.find({});
        nodeCache.set("products", JSON.stringify(products));
    }

    return res.status(200).json({
        success:true,
        products
    });

})

app.put('/products', async(req,res)=>{
    const product = await Product.findById(req.query.id);
    product.name = req.body.name;

    await product.save();

    nodeCache.del("products");

    return res.json({
        success: true,
        message: "Updated",
    });
})

app.listen(PORT, ()=>{
    console.log(`server run localhost:${PORT}`);
    ConnectDB();
})

// const createProducts = () => {
//     const products = [];
//     for(let i=0; i<20; i++){
//         const newProduct = {
//             name: faker.commerce.productName(),
//             photo: faker.image.url(),
//             price: faker.commerce.price({min: 1500, max: 8000, dec:0}),
//             stock: faker.commerce.price({min: 0, max: 100, dec:0}),
//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//         };

//         products.push(newProduct);
//     }

//     return products;
// }

// async function generateProducts() {
    
//     const products = await createProducts();
    
//     await Product.insertMany(products);
//     // console.log(products);
//     console.log("check DB");
// }

// generateProducts();