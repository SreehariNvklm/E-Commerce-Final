const multer = require('multer')
const upload = multer({ dest: 'admin/' })
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const { response } = require('express');

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{ title : 'Admin Panel' , admin : true , products })
  })  
});

router.get('/add-product/',(req,res)=>{
  res.render('admin/add-product' , { title : "Admin Panel" , admin : true });
})

router.post('/add-product/', (req,res)=>{
  console.log(req.body);
  console.log(req.files);

  productHelper.addProduct(req.body,(result)=>{
    req.files.productImg.mv('./public/product-images/'+result._id+'.jpg');
    res.render('admin/add-product' , { title : "Admin Panel" , admin : true });
  })
})

router.get('/delete-product/:id',(req,res)=>{
  let proId = req.params.id;
  console.log(proId);
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect("/admin/");
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  let proId = req.params.id;
  let product = await productHelper.getProductDetails(proId);
  console.log(product);
  res.render("admin/edit-product",{product});
})

router.post('/edit-product/:id',(req,res)=>{
  productHelper.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin');
    if(req.files.productImg){
      req.files.productImg.mv('./public/product-images/'+req.params.id+'.jpg');
    }
  })
})

module.exports = router;
