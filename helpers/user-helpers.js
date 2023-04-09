const bcrypt = require('bcrypt');
const userSchema = require('../config/userConnection');
const cartSchema = require('../config/cartConnection');

const { response } = require('express');
module.exports = {
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10);
            user = new userSchema({
                name: userData.Name,
                email: userData.Email,
                password: userData.Password,
                city: userData.City
            }).save((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(res);
                    resolve();
                }
            })
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            let user = await userSchema.findOne({ email: userData.Email });
            if (user) {
                bcrypt.compare(userData.Password, user.password).then((status) => {
                    if (status) {
                        console.log(status);
                        response.user = user;
                        response.status = status;
                        resolve(response);
                    }
                    else {
                        resolve({ status: false });
                    }
                })
            }
            else {
                console.log('User not found');
                var status = response.status;
                resolve({ status: false });
            }
        })
    },
    addToCart: (productid, userid) => {
        return new Promise(async (resolve, reject) => {
            let userCart = await cartSchema.findOne({ userId: userid });
            if (userCart) {
                console.log(userCart.productId);
                // await cartSchema.findOne({userId: userid},{userId: 0},function(err,result){
                //     if(err){
                //         console.log(err);
                //     }
                //     else{
                //         console.log(result.productId)
                //     }
                // })
                await cartSchema.findOneAndUpdate({ userId: userid },
                    {
                        "$push": { productId: productid }
                    }).then((response) => {
                        resolve();
                    })
            }
            else {
                cart = new cartSchema({
                    productId: [productid],
                    userId: userid
                }).save((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(res);
                    }
                })
            }
        })
    },
    getCartProducts: (userid) => {
        return new Promise(async (resolve, reject) => {
            await cartSchema.findOne({ userId: userid }, { userId: 0 }, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    // console.log(result);
                    resolve(result);
                }
            }).clone();
        })
    },
    removeFromCart:(prodid,userid)=>{
        return new Promise((resolve,reject)=>{
            cartSchema.updateOne({userId:userid},
                {
                    "$pull": { productId: prodid }
                }).then((response) => {
                    resolve();
                }
                )
        })
    },
    createCart:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            cart = new cartSchema({
                productId: [],
                userId: userid
            }).save((err, res) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(res);
                    resolve(res);
                }
            })
        })
    }
}