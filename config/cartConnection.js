const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    productId: [{type:String}],
    userId: {type:String}
});

module.exports = mongoose.model("Cart", cartSchema);