var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
var userHelper = require('../helpers/user-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  }
  else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user;
  //console.log(user);
  if (user) {
    let productsArray = await userHelper.getCartProducts(req.session.user._id).then((response) => {
      if (response) {
        cartCount = response.productId.length;
        console.log(cartCount);
        productHelper.getAllProducts().then((products) => {
          console.log(products);
          res.render('index', { title: 'Shopping Cart', products, user, cartCount, admin: false });
        })
      }
      else {
        let cartCount = 0;
        productHelper.getAllProducts().then((products) => {
          console.log(products);
          res.render('index', { title: 'Shopping Cart', products, user, cartCount, admin: false });
        })
      }
    })
  }
})
router.get('/login', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/');
  }
  else {
    res.render('user/login', { loginErr: req.session.loginErr });
    req.session.loginErr = "";
  }
});
router.get('/signup', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/');
  }
  else {
    res.render('user/signup');
  }
});
router.post('/signup', function (req, res) {
  userHelper.doSignUp(req.body).then((response) => {
    req.session.loggedIn = true;
    req.session.user = response;
    res.redirect('/login')
  })
})
router.post('/login', function (req, res) {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    }
    else {
      req.session.loginErr = "Invalid username or password";
      res.redirect('/login');
    }
  })
})
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
})
router.get('/cart', verifyLogin, async function (req, res) {
  let productsArray = await userHelper.getCartProducts(req.session.user._id)
  let productArr = [];
  let cartCount = 0;
  cartCount = productsArray.productId.length;
  let user = req.session.user;
  for (let i = 0; i < cartCount; i++) {
    console.log(productsArray.productId[i]);
    await productHelper.getProductDetails(productsArray.productId[i]).then((products) => {
      console.log(products)
      productArr.push(products);
    }).catch((err) => {
      console.log(err);
    })
  }
  res.render('user/cart', { user, productArr, cartCount, admin: false });
})
  //let cartCount = productsArray.length;
  // if (productsArray == null) {
  //   let user = req.session.user;
  //   res.render('user/cart', { user, productArr, admin: false });
  // }
  // else {
  //   let productArr = [];
  //   let user = req.session.user;
  //   for (let i = 0; i < productsArray.length; i++) {
  //     console.log(productsArray[i]);
  //     await productHelper.getProductDetails(productsArray[i]).then((products) => {
  //       console.log(products)
  //       productArr.push(products);
  //     }).catch((err) => {
  //       console.log(err);
  //     })
  //   }
  //   res.render('user/cart', { productArr, user, cartCount, admin: false });
  // }

router.get('/add-to-cart/:id', (req, res) => {
  userHelper.addToCart(req.params.id, req.session.user._id).then(() => {
    res.redirect('/');
  })
})
router.get('/remove-cart-item/:id', (req, res) => {
  userHelper.removeFromCart(req.params.id, req.session.user._id).then(() => {
    res.redirect('/cart/');
  })
})

module.exports = router;
