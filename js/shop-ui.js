/* 
 * =============================================================================
 * Author: Mark Angelo Angulo
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', function (){

    ShopUi = (function() {
        
        const RESOURCES = '../../resources/module-assets/shop/';
        const MOBILE = window.matchMedia("(max-width: 767px)");
        const PREFIX = Lazy.getConfig('prefix');
        
        // form validations
        let loginValidator,
            signupValidator,
            forgotPasswordValidator,
            checkoutValidator;
            
        // modals
        let productInfoModal = Lazy.modal();
            
        // products
        const listProduct = document.querySelector('#list-products > li:first-child');
        const listProducts = document.querySelector('#list-products');
        const emptyListProduct = document.querySelector('#list-products > li.empty');
        
        // cart
        const trCart = document.querySelector('#table-cart tbody > tr:first-child');
        const tbodyCart = document.querySelector('#table-cart tbody');
        const emptyTrProduct = document.querySelector('#table-cart tbody > tr.empty');
        
        // wishlist
        const trWishlist = document.querySelector('#table-wishlist tbody > tr:first-child');
        const tbodyWishlist = document.querySelector('#table-wishlist tbody');
        const emptyTrWishlist = document.querySelector('#table-wishlist tbody > tr.empty');
        
        // select product categories
        const selectProductCategory = document.querySelector('#select-search-products');
        const defaultCategoryOption = document.querySelector('#select-search-products > option:first-child');
        
        // list product categories
        const listCategory = document.querySelector('#list-product-categories > li:first-child');
        const divCategory = document.querySelector('#list-product-categories > li:first-child > div');
        const listCategories = document.querySelector('#list-product-categories');
        const selectCategories = document.querySelector('#select-search-products');
        const emptyListCategory = document.querySelector('#list-product-categories > li.empty');
        
        // orders 
        const trOrder = document.querySelector('#table-orders tbody > tr:first-child');
        const tbodyOrder = document.querySelector('#table-orders tbody');
        const emptyTrOrder = document.querySelector('#table-orders tbody > tr.empty');
        
        /* 
         * ---------------------------------------------------------------------
         * Private Members
         * ---------------------------------------------------------------------
         */
        
        let init = function() {
            cleanUi();
            bindings();
            showHidePassword();
            initializeFormValidations();
            changeColor();
        };
        
        let clearCart = function() {
            let products = document.querySelectorAll('#list-products .btn-add-to-cart');
            [].forEach.call(products, item => item.classList.remove('active'));
            let wishlists = document.querySelectorAll('#table-wishlist .btn-add-to-cart');
            [].forEach.call(wishlists, item => item.classList.remove('active'));
            let items = tbodyCart.querySelectorAll('tr:not(:nth-last-child(2)):not(:last-child)');
            [].forEach.call(items, item => item.remove());
            tbodyCart.querySelector('.empty').style.display = '';
        };
        
        let clearWishlist = function() {
            tbodyWishlist.innerHTML = '';
            tbodyWishlist.append(emptyTrWishlist);
            tbodyWishlist.querySelector('.empty').style.display = '';
            
            let products = document.querySelectorAll('#list-products .btn-add-to-wishlist');
            [].forEach.call(products, item => item.classList.remove('active'));
        };

        let cleanUi = function() {
            
            document.querySelector('#main-navigation').style.display = 'none';
            document.querySelector('#btn-wishlist').style.display = 'none';
            
            selectProductCategory.innerHTML = '';
            selectProductCategory.append(defaultCategoryOption);
            
            listProducts.innerHTML = '';
            listProducts.append(emptyListProduct);
            
            listCategories.innerHTML = '';
            listCategories.append(emptyListCategory);
            
            clearCart();
            clearWishlist();
            
            tbodyOrder.innerHTML = '';
            tbodyOrder.append(emptyTrOrder);
        };
        
        let bindings = function() {
            
            // login
            Lazy.on('submit', '#form-login', event => login(event));

            // forgot password
            Lazy.on('submit', '#form-forgot-password', event => forgotPassword(event));
            
            // signup
            Lazy.on('submit', '#form-signup', event => signup(event));
            
            // list view
            Lazy.on('click', '#btn-list-view', event => listView(event));
            
            // grid view
            Lazy.on('click', '#btn-grid-view', event => gridView(event));
            
            // order
            Lazy.on('change', '#products-sort', event => orderSelect(event));
            Lazy.on('click', '#btn-product-sort', event => order(event));
            
            // categorize
            Lazy.don('click', '#list-product-categories li', event => categorize(event));
            Lazy.don('change', '#select-search-products', event => categorizeSelect(event));
            
            // product info
            Lazy.don('click', '#list-products a[href="#product-info"', event => productInfo(event));
            Lazy.don('click', '#table-wishlist a[href="#product-info"', event => wishlistProductInfo(event));
            Lazy.don('click', '#table-cart a[href="#product-info"', event => cartProductInfo(event));
            Lazy.don('click', '#table-orders a[href="#product-info"', event => ordersProductInfo(event));
            
            // change image
            Lazy.don('click', '.list-product-images > li > a', event => changeImage(event));
            
            // toggle wishlist
            Lazy.don('click', '#list-products .btn-add-to-wishlist', event => toggleWishlist(event, 'li'));
            Lazy.don('click', '#product-info .btn-add-to-wishlist', event => toggleWishlist(event, 'article'));
            
            // toggle cart
            Lazy.don('click', '#list-products .btn-add-to-cart', event => toggleCart(event, 'li'));
            Lazy.don('click', '#product-info .btn-add-to-cart', event => toggleCart(event, 'article'));
            
            // wishlist to cart
            Lazy.don('click', '#table-wishlist .btn-add-to-cart', event => wishlistToCart(event));
            
            // cart to wishlist
            Lazy.don('click','#table-cart .btn-add-to-wishlist', event => cartToWishlist(event));
            
            // remove from wishlist
            Lazy.don('click', '#table-wishlist .btn-remove-from-wishlist', event => removeFromWishlist(event, 'tr'));
            Lazy.don('click', '#product-info .btn-remove-from-wishlist', event => removeFromWishlist(event, 'article'));
            
            // remove from cart
            Lazy.don('click', '#table-cart .btn-remove-from-cart', event => removeFromCart(event, 'tr'));
            Lazy.don('click', '#product-info .btn-remove-from-cart', event => removeFromCart(event, 'article'));
            
            // checkout
            Lazy.on('click', '#btn-checkout', event => checkout(event));
            
            // logout
            Lazy.on('click', '#btn-logout', event => logout(event));
            
        };
        
        let showHidePassword = function() {
            
            Lazy.don('click', 'input[name="password"] + button', e => {
               e.preventDefault();
               e.target.classList.toggle('active');
               let type = e.target.classList.contains('active') ? 'text'  : 'password';
               e.target.previousElementSibling.setAttribute('type', type);
            });
            
            Lazy.don('click', 'input[name="confirm-password"] + button', e => {
               e.preventDefault();
               e.target.classList.toggle('active');
               let type = e.target.classList.contains('active') ? 'text'  : 'password';
               e.target.previousElementSibling.setAttribute('type', type);
            });
            
        };
        
        let buildValidation = function(form, rules){

            let validator = function(){};
            validator.validate = function() {
                
                [].forEach.call(document.querySelectorAll(`${form} .${PREFIX}form-item`), container => {
                    container.classList.remove(`${PREFIX}form-error`);
                    container.classList.add(`${PREFIX}form-success`);
                });
                
                [].forEach.call(document.querySelectorAll(`${form} .${PREFIX}form-error-message`), errorMessage => {
                    errorMessage.remove();
                });
                
                let valid = Lazy.validate(form, rules);
                if( ! valid ) {
                    
                    let errors = Lazy.getValidationErrors();
                    for(let key in errors) {
                        
                        let input = document.querySelector(`${form} [name="${key}"]`);
                        var message = Object.values(errors[key])[0] ;
                        
                        let error = document.createElement('div');
                        error.innerText = message;
                        error.className = `${PREFIX}form-error-message`;

                        input.closest(`.${PREFIX}form-item`).classList.remove(`${PREFIX}form-success`);
                        input.closest(`.${PREFIX}form-item`).classList.add(`${PREFIX}form-error`);
                        input.closest(`.${PREFIX}form-input`).append(error);
                    }
                    
                    return false;
                }
                
                return true;
            };
            
            validator.clear = function() {
                let htmlForm = document.querySelector(form);
                if(htmlForm) {
                    htmlForm.reset();
                    [].forEach.call(document.querySelectorAll(`${form} .${PREFIX}form-item`), container => {
                        container.classList.remove(`${PREFIX}form-error`);
                        container.classList.remove(`${PREFIX}form-success`);
                    });
                    [].forEach.call(document.querySelectorAll(`${form} .${PREFIX}form-error-message`), errorMessage => {
                        errorMessage.remove();
                    });
                }
            };
            
            return validator;
        };
        
        let initializeFormValidations = function(){
            
            // login
            let loginRules = {
                username: {
                    rename: 'Username',
                    rules: ['required', 'min:8']
                },
                password: {
                    rename: 'Password',
                    rules: 'required|min:8'
                }
            };
            loginValidator = buildValidation('#form-login', loginRules);

            // forgot-password
            let forgotPasswordRules = {
                username: {
                    rename: 'Username',
                    rules: ['required', 'email', 'min:8']
                }
            };
            forgotPasswordValidator = buildValidation('#form-forgot-password', forgotPasswordRules);
            
            // signup
            let signupRules = Object.assign({}, loginRules);
            signupRules['confirm-password'] = {
                rename: 'Confirm Password',
                rules: ['required', 'min:8', 'max:255', 'matches:password']
            };
            signupRules['address'] = {
                rename: 'Address',
                rules: ['required', 'max:255']
            };
            signupValidator = buildValidation('#form-signup', signupRules);
            
            // checkout
            let checkoutRules = {
                'card-number': {
                    rename: 'Card Number',
                    rules: ['required', 'min:8']
                },
                cvv: {
                    rename: 'CVV',
                    rules: 'required|min:4'
                },
                year: {
                    rename: 'Year',
                    rules: 'required|min:4'
                }
            };
            checkoutValidator = buildValidation('#form-checkout', checkoutRules);
        };
        
        let changeColor = function() {
            
            let userColor = localStorage.getItem('color');
            const colors = Array.from(document.querySelectorAll('#site-color-picker input[name="color"]')).map(input => input.value);
            const bodyClasses = document.querySelector('body').classList;
            
            // dark mode
            if( userColor === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                userColor = 'dark';
            }
            
            if( userColor !== null ) {
                document.querySelector(`#site-color-picker input[name="color"][value="${userColor}"]`).checked = true;
                for( let i = 0; i < colors.length; i++ ){ bodyClasses.remove(colors[i]); }
                bodyClasses.add(userColor);
            }
            
            Lazy.on('change', '#site-color-picker input[name="color"]', function(e){
                for( let i = 0; i < colors.length; i++ ) { bodyClasses.remove(colors[i]); }
                bodyClasses.add(e.target.value);
                localStorage.setItem('color', e.target.value);
            });
            
            Lazy.on('change', '#site-color-picker input[type="checkbox"]', function(e){
                let value = e.target.value;
                if( e.target.checked ) {
                    localStorage.setItem(value, 'true');
                } else {
                    localStorage.removeItem(value);
                }
                bodyClasses.toggle(value);
            });
            
            setTimeout(function(){
                let siteColorPicker = document.querySelector('#site-color-picker');
                siteColorPicker.animate({ opacity: [1, 0]}, { duration: 1000 });
                siteColorPicker.style.opacity = 0;
            }, 6000);
        };
        
        let login = function(e) {
            e.preventDefault();
            if( ! loginValidator.validate() ) { return; }
            let userName = document.querySelector('#form-login input[name="username"]').value;
            let loginEvent = new Event('login');
            loginEvent.data = {username: userName};
            document.dispatchEvent(loginEvent);
        };

        let forgotPassword = function(e) {
            e.preventDefault();
            if( ! forgotPasswordValidator.validate() ) { return; }
            Lazy.modal({
                title: 'Reset Password',
                content: '<div style="padding: 1rem">Reset password was sent to your email.</div>',
                closable: false,
                closeButton: false,
                footer: 'ok',
                onOk: function(){
                    document.dispatchEvent(new Event('forgot-password'));
                    this.close();
                    window.location.href = '#login';
                }
            }).open();
        };
        
        let signup = function(e) {
            e.preventDefault();
            if( ! signupValidator.validate() ) { return; }
            document.dispatchEvent(new Event('signup'));
            let userName = document.querySelector('#form-signup input[name="username"]').value;
            let loginEvent = new Event('login');
            loginEvent.data = {username: userName};
            document.dispatchEvent(loginEvent);
        };
        
        let listView = function(e) {
            e.preventDefault();
            let productList = document.querySelector('#list-products');
            productList.classList.remove('grid');
            productList.classList.add('list');
            animateProducts();
            e.target.dispatchEvent(new Event('list-view'));
        };
        
        let animateProducts = function() {
            let counter = 0;
            [].forEach.call(document.querySelectorAll('#list-products > li'), function(elem, idx) {
                let display = elem.style.display;
                if( display !== 'none' ) {
                    counter++;
                    elem.style.opacity = 0;
                    setTimeout(function(){
                        elem.animate({ 
                            transform: ['translateY(2rem)', 'translateY(0rem)']
                        }, { 
                            duration: 1000, 
                            iterations: 1, 
                            easing: "ease-out" 
                        });
                        elem.style.opacity = 1;
                    }, counter * 100);
                }
            });
        };
        
        let gridView = function(e) {
            e.preventDefault();
            let productList = document.querySelector('#list-products');
            productList.classList.remove('list');
            productList.classList.add('grid');
            e.target.dispatchEvent(new Event('grid-view'));
            animateProducts();
        };
        
        let orderSelect = function(e) {
            e.preventDefault();
            e.target.dispatchEvent(new Event('order'));
            animateProducts();
        };

        let order = function(e) {
            e.preventDefault();
            let btn = e.target;
            btn.classList.toggle('descending');
            let currentOrder = btn.classList.contains('descending') ? 'Descending' : 'Ascending';
            btn.setAttribute('title', currentOrder);
            btn.querySelector(':scope > span').innerText = currentOrder;
            e.target.dispatchEvent(new Event('order'));
            animateProducts();
        };
        
        let categorize = function(e) {
            e.preventDefault();
            
            document.querySelector('#input-search-products').value = '';
            
            let li = e.target;
            let categories = [];
            if( li.classList.contains('active') ) {
                document.querySelector('#select-search-products').value = li.data.id;
                categories.push(li.data.id);
                [].forEach.call(li.querySelectorAll('li'), child => {
                    categories.push(child.data.id); 
                });
            } else {
                let parentLi = li.parentNode.closest('li');
                if( parentLi ) {
                    categories.push(parentLi.data.id);
                    [].forEach.call(parentLi.querySelectorAll('li'), child => {
                        categories.push(child.data.id); 
                    });
                }
            }
            
            let event = new Event('categorize');
            event.data = {categories: categories};
            document.dispatchEvent(event);
        };
        
        let categorizeSelect = function(e) {
            e.preventDefault();
            document.querySelector('#input-search-products').value = '';
            let categories = e.target.value ? [e.target.value] : [];
            [].forEach.call(document.querySelectorAll('#list-product-categories li'), li => {
                li.classList.remove('active');
                if( li.data && li.data.id && (e.target.value == li.data.id) ) {
                    li.classList.add('active');
                    let parent = li.parentNode.closest('li');
                    if(parent) {
                        parent.classList.add('active');
                    }
                }
            });
            let event = new Event('categorize');
            event.data = {categories: categories};
            document.dispatchEvent(event);
            window.location.href = '#shop';
        };
        
        let changeImage = function(e) {
            e.preventDefault();
            let article = e.target.closest('article');
            let src = e.target.querySelector(':scope img').src;
            let img = article.querySelector('.product-image img');
            img.setAttribute('src', src);
            img.animate({ opacity: [0, 1]}, { duration: 1000, iterations: 1, easing: "ease-out" });
        };
        
        let toggleCart = function(e, parent) {
            e.preventDefault();
            let cartIcon = e.target;
            cartIcon.classList.toggle('active');
            var product = cartIcon.closest(parent).data;
            if( cartIcon.classList.contains('active') ) {
                product.quantity = 1;
                let event = new Event('add-to-cart');
                event.data = {product: product};
                document.dispatchEvent(event);
            } else {
                Lazy.dialog({
                    title: 'Remove from Cart',
                    message: 'Remove this item from your cart?',
                    ok: 'Remove',
                    onOk: function(){
                        let event = new Event('remove-from-cart');
                        event.data = {product: product};
                        document.dispatchEvent(event);
                        this.close();
                    },
                    onCancel: function(){
                        cartIcon.classList.add('active');
                        this.close();
                    }
                }).open();
            }
        };
        
        let toggleWishlist = function(e, parent) {
            e.preventDefault();
            let wishlistIcon = e.target;
            wishlistIcon.classList.toggle('active');
            let product = wishlistIcon.closest(parent).data;
            if( wishlistIcon.classList.contains('active') ) {
                let event = new Event('add-to-wishlist');
                event.data = {product: product};
                document.dispatchEvent(event);
            } else {
                Lazy.dialog({
                    title: 'Remove from Wishlist',
                    message: 'Remove this item from your wishlist?',
                    ok: 'Remove',
                    onOk: function(){
                        let event = new Event('remove-from-wishlist');
                        event.data = {product: product};
                        document.dispatchEvent(event);
                        this.close();
                    },
                    onCancel: function(){
                        wishlistIcon.classList.add('active');
                        this.close();
                    }
                }).open();
            }
        };

        let productInfo = function(e) {
            e.preventDefault();
            let productInfo = document.querySelector('#product-info article');
            productInfo.querySelector('.btn-add-to-wishlist').style.display = '';
            productInfo.querySelector('.btn-add-to-cart').style.display = '';
            productInfo.querySelector('.btn-remove-from-wishlist').style.display = 'none';
            productInfo.querySelector('.btn-remove-from-cart').style.display = 'none';
            let product = e.target.closest('li').data;
            let event = new Event('product-info');
            event.data = {product: product};
            document.dispatchEvent(event);
        };
        
        let wishlistProductInfo = function(e) {
            e.preventDefault();
            let productInfo = document.querySelector('#product-info article');
            productInfo.querySelector('.btn-add-to-wishlist').style.display = '';
            productInfo.querySelector('.btn-add-to-cart').style.display = 'none';
            productInfo.querySelector('.btn-remove-from-wishlist').style.display = '';
            productInfo.querySelector('.btn-remove-from-cart').style.display = 'none';
            let product = e.target.closest('tr').data;
            let event = new Event('product-info');
            event.data = {product: product};
            document.dispatchEvent(event);
        };
        
        let cartProductInfo = function(e) {
            e.preventDefault();
            let productInfo = document.querySelector('#product-info article');
            productInfo.querySelector('.btn-add-to-wishlist').style.display = '';
            productInfo.querySelector('.btn-add-to-cart').style.display = 'none';
            productInfo.querySelector('.btn-remove-from-wishlist').style.display = 'none';
            productInfo.querySelector('.btn-remove-from-cart').style.display = '';
            let product = e.target.closest('tr').data;
            let event = new Event('product-info');
            event.data = {product: product};
            document.dispatchEvent(event);
        };
        
        let ordersProductInfo = function(e) {
            e.preventDefault();
            let productInfo = document.querySelector('#product-info article');
            productInfo.querySelector('.btn-add-to-wishlist').style.display = 'none';
            productInfo.querySelector('.btn-add-to-cart').style.display = 'none';
            productInfo.querySelector('.btn-remove-from-wishlist').style.display = 'none';
            productInfo.querySelector('.btn-remove-from-cart').style.display = 'none';
            let product = e.target.closest('tr').data;
            let event = new Event('product-info');
            event.data = {product: product};
            document.dispatchEvent(event);
        };
        
        let renderProductInfo = function(product) {
            let productInfo = document.querySelector('#product-info article');
            productInfo.data = product;
            if( product['photos'] ) {
                let productImagesList = productInfo.querySelector('.list-product-images');
                productImagesList.innerHTML = '';
                [].forEach.call(product['photos'], function(image, index) {
                        if (index === 0) {
                             productInfo.querySelector('.product-image > img').setAttribute('src', image);
                        }
                        let li = document.createElement('li');
                        let a = document.createElement('a');
                        a.setAttribute('href', '#');
                        let img = document.createElement('img');
                        img.setAttribute('src', image);
                        img.setAttribute('alt', 'product-image');
                        img.setAttribute('width', 40);
                        img.setAttribute('height', 40);
                        li.append(a);
                        a.append(img);
                        productImagesList.append(li);
                });
            }

            let cart = localStorage.getObject('cart') || {};
            if( Object.keys(cart).includes(product.id) ) {
                productInfo.querySelector('.btn-add-to-cart').classList.add('active');
            } else {
                productInfo.querySelector('.btn-add-to-cart').classList.remove('active');
            }
            
            let wishlist = localStorage.getObject('wishlist') || {};
            if( Object.keys(wishlist).includes(product.id) ) {
                productInfo.querySelector('.btn-add-to-wishlist').classList.add('active');
            } else {
                productInfo.querySelector('.btn-add-to-wishlist').classList.remove('active');
            }

            productInfo.querySelector('.product-name').innerText = product['name'];
            productInfo.querySelector('.product-price > span').innerText = product['price'];
            productInfo.querySelector('.product-description > p').innerText = product['description'];
            
            productInfoModal = Lazy.overlay('#product-info', {
                header: 'title',
                title: product['name'],
                closable: false
            }).open();
        };

        let renderProduct = function(product) {
            const newProduct = listProduct.cloneNode(true);
            if( product['photos'] ) {
                let productImagesList = newProduct.querySelector('.list-product-images');
                [].forEach.call(product['photos'], function(image, index) {
                     if (index == 0) {
                         newProduct.querySelector('.product-image > img').setAttribute('src', image);
                         newProduct.querySelector('.list-product-images > li:first-child img').setAttribute('src', image);
                    } else {
                        let li = document.createElement('li');
                        let a = document.createElement('a');
                        a.setAttribute('href', '#');
                        let img = document.createElement('img');
                        img.setAttribute('src', image);
                        img.setAttribute('alt', 'product-image');
                        img.setAttribute('width', 40);
                        img.setAttribute('height', 40);
                        li.append(a);
                        a.append(img);
                        productImagesList.append(li);
                    }
                });
            }

            let cart = localStorage.getObject('cart') || {};
            if( Object.keys(cart).includes(product.id) ) {
                newProduct.querySelector('.btn-add-to-cart').classList.add('active');
            }
            let wishlist = localStorage.getObject('wishlist') || {};
            if( Object.keys(wishlist).includes(product.id) ) {
                newProduct.querySelector('.btn-add-to-wishlist').classList.add('active');
            }

            newProduct.querySelector('.product-name').innerText = product['name'];
            newProduct.querySelector('.product-price > span').innerText = product['price'];
            newProduct.querySelector('.product-description > div > p').innerText = product['description'];

            newProduct.data = product;
            listProducts.append(newProduct);
        };
        
        let markUpListCategory = function(category) {
            const newCategory = divCategory.cloneNode(true);
            newCategory.querySelector('a > span').innerText = category['name'];
            let li = document.createElement('li');
            li.append(newCategory);
            li.data = category;
            return li;
        };
        
        let markUpOptionCategory = function(category) {
            let option = document.createElement('option');
            option.setAttribute('value', category['id']);
            option.innerText = category['name'];
            option.data = category;
            return option;
        };
        
        let renderCategories = function(category) {
            listCategories.append(category);
        };
        
        let renderCategorize = function() {
            animateProducts();
        };
        
        let renderDropdownCategories = function(category) {
            selectCategories.append(category);
        };
        
        let renderAddToCart = function(product) {
            
            let username = localStorage.getItem('username') || false;
            
            const newProduct = trCart.cloneNode(true);
            if( product['photos'][0] ) {
                let image = product['photos'][0];
                newProduct.querySelector('img').setAttribute('src', image);
            }
            
            let products = Array.from(listProducts.querySelectorAll('li'));
            Array.from(products).find((li) => {
                if( li?.data?.id === product.id ) {
                    li.querySelector('.btn-add-to-cart').classList.add('active');
                }
            });
            
            let wishlists = Array.from(tbodyWishlist.querySelectorAll('tr'));
            Array.from(wishlists).find((tr) => {
                if( tr?.data?.id === product.id ) {
                    tr.querySelector('.btn-add-to-cart').classList.add('active');
                }
            });
            
            newProduct.querySelector('.product-name').innerText = product['name'];
            newProduct.querySelector('.product-price').innerText = product['price'];
            newProduct.querySelector('input[name="quantity"]').value = product['quantity'];
            newProduct.querySelector('.product-description').innerText = product['description'];
            
            let addToWishlistDisplay = username ? 'inline-block' : 'none';
            newProduct.querySelector('.btn-add-to-wishlist').style.display = addToWishlistDisplay;
            
            newProduct.data = product;
            tbodyCart.prepend(newProduct);
        };
        
        let renderUpdateCart = function() {
            let cart = localStorage.getObject('cart') || {};
            let items = Object.values(cart).reduce((total, quantity) => parseInt(total) + parseInt(quantity), 0);
            let btnCart = document.querySelector('#btn-cart');
            let aCart = document.querySelector('#main-navigation a[href="#cart"]');
            let aCartBadge = aCart.closest('li').querySelector('.tpl-badge');
            if( items > 0 ) {
                btnCart.classList.add('active');
                btnCart.setAttribute('data-badge', items);
                aCart.classList.add('active');
                aCartBadge.classList.add('active');
                aCartBadge.setAttribute('data-badge', items);
            } else {
                btnCart.classList.remove('active');
                btnCart.setAttribute('data-badge', 0);
                aCart.classList.remove('active');
                aCartBadge.classList.remove('active');
                aCartBadge.setAttribute('data-badge', 0);
            }
        };
        
        let renderAddToWishlist = function(product) {
            const newProduct = trWishlist.cloneNode(true);
            if( product['photos'][0] ) {
                let image = product['photos'][0];
                newProduct.querySelector('img').setAttribute('src', image);
            }
            
            let products = Array.from(listProducts.querySelectorAll('li'));
            Array.from(products).find((li) => {
                if( li?.data?.id === product.id ) {
                    li.querySelector('.btn-add-to-wishlist').classList.add('active');
                }
            });
            
            let cartProducts = Array.from(tbodyCart.querySelectorAll('tr'));
            Array.from(cartProducts).find((tr) => {
                if( tr?.data?.id === product.id ) {
                    tr.querySelector('.btn-add-to-wishlist').classList.add('active');
                }
            });
            
            let cart = localStorage.getObject('cart') || {};
            if( Object.keys(cart).includes(product.id) ) {
                newProduct.querySelector('.btn-add-to-cart').classList.add('active');
            }
            
            newProduct.querySelector('.product-name').innerText = product['name'];
            newProduct.querySelector('.product-price').innerText = product['price'];
            newProduct.querySelector('.product-description').innerText = product['description'];
            newProduct.data = product;
            tbodyWishlist.append(newProduct);
        };
        
        let renderUpdateWishlist = function() {
            let wishlist = localStorage.getObject('wishlist') || {};
            let items = Object.keys(wishlist).length;
            let btnWishlist = document.querySelector('#btn-wishlist');
            let aWishlist = document.querySelector('#main-navigation a[href="#wishlist"]');
            let aWishlistBadge = aWishlist.closest('li').querySelector('.tpl-badge');
            if( items > 0 ) {
                btnWishlist.classList.add('active');
                btnWishlist.setAttribute('data-badge', items);
                aWishlist.classList.add('active');
                aWishlistBadge.classList.add('active');
                aWishlistBadge.setAttribute('data-badge', items);
            } else {
                btnWishlist.classList.remove('active');
                btnWishlist.setAttribute('data-badge', 0);
                aWishlist.classList.remove('active');
                aWishlistBadge.classList.remove('active');
                aWishlistBadge.setAttribute('data-badge', 0);
            }
        };
        
        let renderAddToOrder = function(product) {
            const newProduct = trOrder.cloneNode(true);
            if( product['photos'][0] ) {
                let image = product['photos'][0];
                newProduct.querySelector('img').setAttribute('src', image);
            }
            newProduct.querySelector('.product-name').innerText = product['name'];
            newProduct.querySelector('.product-price').innerText = product['price'];
            newProduct.querySelector('.product-quantity').innerText = product['quantity'];
            newProduct.querySelector('.product-description').innerText = product['description'];
            newProduct.data = product;
            tbodyOrder.append(newProduct);
        };
        
        let renderRemoveFromCart = function(product) {
            
            let products = Array.from(listProducts.querySelectorAll('li'));
            Array.from(products).find((li) => {
                if( li?.data?.id === product.id ) {
                    li.querySelector('.btn-add-to-cart').classList.remove('active');
                }
            });
            
            let wishlists = Array.from(tbodyWishlist.querySelectorAll('tr'));
            Array.from(wishlists).find((tr) => {
                if( tr?.data?.id === product.id ) {
                    tr.querySelector('.btn-add-to-cart').classList.remove('active');
                }
            });
            
            let items = Array.from(tbodyCart.querySelectorAll('tr'));
            Array.from(items).find((item) => {
                if( item?.data?.id === product.id ) {
                    item.remove();
                }
            });
            
            productInfoModal.close();
        };
        
        let removeFromWishlist = function(e, parent) {
            e.preventDefault();
            let wishlistIcon = e.target;
            wishlistIcon.classList.toggle('active');
            let product = wishlistIcon.closest(parent).data;
            Lazy.dialog({
                title: 'Remove from Wishlist',
                message: 'Remove this item from your wishlist?',
                ok: 'Remove',
                onOk: function(){
                    let event = new Event('remove-from-wishlist');
                    event.data = {product: product};
                    document.dispatchEvent(event);
                    this.close();
                },
                onCancel: function(){
                    wishlistIcon.classList.add('active');
                    this.close();
                }
            }).open();
        };
        
        let removeFromCart = function(e, parent) {
            e.preventDefault();
            let cartIcon = e.target;
            cartIcon.classList.toggle('active');
            let product = cartIcon.closest(parent).data;
            Lazy.dialog({
                title: 'Remove from Cart',
                message: 'Remove this item from your cart?',
                ok: 'Remove',
                onOk: function(){
                    let event = new Event('remove-from-cart');
                    event.data = {product: product};
                    document.dispatchEvent(event);
                    this.close();
                },
                onCancel: function(){
                    cartIcon.classList.add('active');
                    this.close();
                }
            }).open();
        };
        
        let wishlistToCart = function(e) {
            e.preventDefault();
            let cartIcon = e.target;
            cartIcon.classList.toggle('active');
            var product = cartIcon.closest('tr').data;
            if( cartIcon.classList.contains('active') ) {
                let event = new Event('add-to-cart');
                event.data = {product: product};
                document.dispatchEvent(event);
            } else {
                Lazy.dialog({
                    title: 'Remove from Cart',
                    message: 'Remove this item from your cart?',
                    ok: 'Remove',
                    onOk: function(){
                        let event = new Event('remove-from-cart');
                        event.data = {product: product};
                        document.dispatchEvent(event);
                        this.close();
                    },
                    onCancel: function(){
                        cartIcon.classList.add('active');
                        this.close();
                    }
                }).open();
            }
        };
        
        let cartToWishlist = function(e) {
            e.preventDefault();
            let wishlistIcon = e.target;
            wishlistIcon.classList.toggle('active');
            var product = wishlistIcon.closest('tr').data;
            if( wishlistIcon.classList.contains('active') ) {
                let event = new Event('add-to-wishlist');
                event.data = {product: product};
                document.dispatchEvent(event);
            } else {
                Lazy.dialog({
                    title: 'Remove from Wishlist',
                    message: 'Remove this item from your wishlist?',
                    ok: 'Remove',
                    onOk: function(){
                        let event = new Event('remove-from-wishlist');
                        event.data = {product: product};
                        document.dispatchEvent(event);
                        this.close();
                    },
                    onCancel: function(){
                        wishlistIcon.classList.add('active');
                        this.close();
                    }
                }).open();
            }
        };
        
        let checkout = function(e) {
            e.preventDefault();
            
            let cart = localStorage.getObject('cart') || {};
            if(Object.keys(cart).length === 0) {
                Lazy.dialog({
                    title: 'Checkout',
                    message: 'No items to checkout.',
                    ok: 'Shop',
                    onOk: function(){
                        window.location.href = '#shop';
                        this.close();
                    },
                    onCancel: function(){
                        this.close();
                    }
                }).open();
                return;
            }
            
            let username = localStorage.getItem('username') || false;
            if(!username) {
                Lazy.dialog({
                    title: 'Checkout',
                    message: 'Login to Checkout',
                    ok: 'Login',
                    onOk: function(){
                        window.location.href = '#login';
                        this.close();
                    },
                    onCancel: function(){
                        this.close();
                    }
                }).open();
                return;
            }
            
            Lazy.overlay('#checkout', {
                header: 'title',
                closeButton: false,
                closable: false,
                title: 'Checkout',
                footer: 'cancel',
                ok: 'Checkout',
                onOk: function(){
                    if( ! checkoutValidator.validate() ) { return; }
                    document.dispatchEvent(new Event('checkout'));
                    this.close();
                },
                onCancel: function(){
                    this.close();
                }
            }).open();
        };
        
        let renderRemoveFromWishlist = function(product) {
            
            let products = Array.from(listProducts.querySelectorAll('li'));
            Array.from(products).find((li) => {
                if( li?.data?.id === product.id ) {
                    li.querySelector('.btn-add-to-wishlist').classList.remove('active');
                }
            });
            
            let items = Array.from(tbodyWishlist.querySelectorAll('tr'));
            Array.from(items).find((item) => {
                if( item?.data?.id === product.id ) {
                    item.remove();
                }
            });
            
            let cartProducts = Array.from(tbodyCart.querySelectorAll('tr'));
            Array.from(cartProducts).find((tr) => {
                if( tr?.data?.id === product.id ) {
                    tr.querySelector('.btn-add-to-wishlist').classList.remove('active');
                }
            });
            
            productInfoModal.close();
        };
        
        let renderTotalPrice = function(total) {
            document.querySelector('#total-price').innerText = total;
        };
        
        let logout = function() {
            document.dispatchEvent(new Event('logout'));
        };
        
        let renderLogin = function(username) {
            [].forEach.call(document.querySelectorAll('.username'), un => {
                un.innerText =  username;
            });
            document.querySelector('#main-navigation').style.display = '';
            document.querySelector('#header-profile').style.display = 'flex';
            document.querySelector('#header-buttons').style.display = 'none';
            document.querySelector('#btn-wishlist').style.display = '';

            [].forEach.call(document.querySelectorAll('#table-cart .btn-add-to-wishlist'), btn => {
                btn.style.display = 'inline-block';
            });

            [].forEach.call(document.querySelectorAll('#list-products .btn-add-to-wishlist'), btn => {
                btn.style.display = 'inline-block';
            });
            
            [].forEach.call(document.querySelectorAll('main > section'), section => {
                section.classList.add('scroll');
            });
            
            window.location.href = '#shop';
        };
        
        let renderLogout = function() {
            [].forEach.call(document.querySelectorAll('.username'), un => {
                un.innerText =  '{{ Username }}';
            });
            document.querySelector('#main-navigation').style.display = 'none';
            document.querySelector('#header-profile').style.display = 'none';
            document.querySelector('#header-buttons').style.display = 'flex';
            document.querySelector('#sub-header-controls a[href="#wishlist"]').style.display = 'none';
            
            [].forEach.call(document.querySelectorAll('#table-cart .btn-add-to-wishlist'), btn => {
                btn.style.display = 'none';
            });
            
            [].forEach.call(document.querySelectorAll('#list-products .btn-add-to-wishlist'), btn => {
                btn.style.display = 'none';
            });
            
            [].forEach.call(document.querySelectorAll('main > section'), section => {
                section.classList.remove('scroll');
            });
            
            window.location.href = '#login';
        };

        init();
        
        /* 
         * ---------------------------------------------------------------------
         * Public Members
         * ---------------------------------------------------------------------
         */

        return {
            clearCart: () => clearCart(),
            clearWishlist: () => clearWishlist(),
            renderLogin: username => renderLogin(username),
            renderProduct: product => renderProduct(product),
            renderProductInfo: product => renderProductInfo(product),
            markUpListCategory: category => markUpListCategory(category),
            markUpOptionCategory: category => markUpOptionCategory(category),
            renderCategories: category => renderCategories(category),
            renderCategorize: () => renderCategorize(),
            renderDropdownCategories: category => renderDropdownCategories(category),
            renderAddToCart: product => renderAddToCart(product),
            renderAddToWishlist: product => renderAddToWishlist(product),
            renderAddToOrder: product => renderAddToOrder(product),
            renderRemoveFromCart: product => renderRemoveFromCart(product),
            renderRemoveFromWishlist: product => renderRemoveFromWishlist(product),
            renderUpdateCart: () => renderUpdateCart(),
            renderUpdateWishlist: () => renderUpdateWishlist(),
            renderTotalPrice: total => renderTotalPrice(total),
            renderLogout: () => renderLogout()
        };
        
    }());
    
});