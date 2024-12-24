// const { faker } = require('@faker-js/faker');
const express = require('express');
const Product = require('./schema');
const ConnectDB = require('./ConnectDB');
require('dotenv').config();
const cors = require('cors');
const NodeCache = require('node-cache');
const {redisConnect,client} = require("./redisConnect");

const app = express();

const nodeCache = new NodeCache({
    // stdTTL: 60
})

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

//Cacheing with node-cache
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


app.get("/redis/products", async(req,res)=>{
    
    try {
        const cache_products = await client.get("redis/products")
        if(cache_products){
            res.status(200).json(JSON.parse(cache_products));
        }else{
            const products = await Product.find({});
            client.setEx("redis/products", 3600, JSON.stringify(products));
            res.status(200).json({products});
        }
        
    } catch (error) {
        res.status(500).json({error:"internal server error"});
    }
})

app.get("/redis/products/:id",async(req,res)=>{
    try {
        const id = req.params.id;

        const product = await client.get(`redis/products:${id}`);

        if(product){
            res.json(JSON.parse(product));
        }else{
            const newProduct = await Product.findOne({
                _id:id
            })
            res.json(newProduct);
            client.setEx(`redis/products:${id}`, 3600, JSON.stringify(newProduct));
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({"error":error.message});
    }
})

app.get("/api/products", async(req,res)=>{
    
    try {
        const cache_products = await cacheGetAndSet("api/products", async()=>{
            const NewProducts = await Product.find({});
            return NewProducts;
        })
        res.status(200).json({cache_products});
        
    } catch (error) {
        res.status(500).json({error:"internal server error"});
    }
})

//bar bar get set na kore amra jodi ekta function e ei setup ta kore nei taholy jinista aro easy hoy
async function cacheGetAndSet(key, cb) {
    const data = await client.get(key);
    if(data){
        return JSON.parse(data);
    }else{
        const newData = await cb();
        client.setEx(key, 3600, JSON.stringify(newData));
        return newData;
    }
}

app.listen(PORT, async()=>{
    console.log(`server run localhost:${PORT}`);
    ConnectDB();
    redisConnect();
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