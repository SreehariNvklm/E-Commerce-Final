const productSchema = require('../config/connection');

module.exports={

    addProduct:(product,callback)=>{
        //console.log(product);
        product = new productSchema({
            name: product.nameOfProduct,
            category: product.categoryOfProduct,
            price: product.priceOfProduct,
            description: product.descriptionOfProduct
        }).save((err,res)=>{
            if(err){
                console.log(err);
            }
            else{
                //console.log(res);
                callback(res);
            }
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await productSchema.find();
            resolve(products);
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            productSchema.remove({_id:prodId}).then((response)=>{
                //console.log(response);
                resolve(response);
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            productSchema.findById(proId).then((product)=>{
                resolve(product);
            })            
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            productSchema.findByIdAndUpdate(proId,
                {
                    $set:{
                        name: proDetails.nameOfProduct,
                        category: proDetails.categoryOfProduct,
                        price: proDetails.priceOfProduct,
                        description: proDetails.descriptionOfProduct
                    }
                }).then((product)=>{
                    resolve();
                })
        })
    }

}