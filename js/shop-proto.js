/* 
 * =============================================================================
 * Author: Mark Angelo Angulo
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', function (){

    ShopProto = (function() {
        
        const RESOURCES = '../../resources/module-assets/shop/';
        const MOBILE = window.matchMedia("(max-width: 767px)");
        const PREFIX = Lazy.getConfig('prefix');
        
        /* 
         * ---------------------------------------------------------------------
         * Private Members
         * ---------------------------------------------------------------------
         */
        
        let init = function() {
            bindings();
            addProducts();
            addCategories();
            checkLogin();
            restrictPages();
            getCart();
            getWishlist();
        };
        
        let bindings = function() {
            
            // login
            Lazy.don('login', event => login(event));
            
            // search
            Lazy.on('click', '#btn-search-products', event => search(event));
            Lazy.on('keyup', '#input-search-products', event => clearSearch(event));
            
            // order
            Lazy.on('order', '#products-sort', event => order(event));
            Lazy.on('order', '#btn-product-sort', event => order(event));
            
            // categorize 
            Lazy.don('categorize', event => categorize(event));
            
            // product info 
            Lazy.don('product-info', event => productInfo(event));
            
            // add to wishlist
            Lazy.don('add-to-wishlist', event => addToWishlist(event));
            Lazy.don('remove-from-wishlist', event => removeFromWishlist(event));
            
            // add to cart
            Lazy.don('add-to-cart', event => addToCart(event));
            Lazy.don('remove-from-cart', event => removeFromCart(event));
            
            // quantity
            Lazy.don('change', '#table-cart input[name="quantity"]', event => changeQuantity(event));
            
            // checkout
            Lazy.don('checkout', event => checkout(event));

            // logout
            Lazy.don('logout', event => logout(event));
        };

        let checkLogin = function() {
            let username = localStorage.getItem('username') || false;
            if( username ) {
                event = new Event('login');
                event.data = {username: username};
                login(event);
            }
        };
        
        let restrictPages = function() {
            let privatePages = ['wishlist', 'profile'];
            let restrict = function() {
                let loggedIn = localStorage.getItem('username') ? true : false;
                const url = new URL(window.location.href);
                const page = url.hash.substr(1);
                if( !loggedIn && privatePages.includes(page) ) {
                    window.location.href = '#login';
                }
            };
            restrict();
            window.onpopstate = restrict;
        };
        
        let getCart = function() {
            let cart = localStorage.getObject('cart') || {};
            let empty = Object.keys(cart).length > 0 ? 'none' : '';
            document.querySelector('#table-cart .empty').style.display = empty;
            for(let key in cart) {
                let product = data.products.find(item => item.id == key);
                product.quantity = cart[key];
                ShopUi.renderAddToCart(product);
            }
            calculateTotal();
            ShopUi.renderUpdateCart();
        };
        
        let getWishlist = function() {
            let wishlist = localStorage.getObject('wishlist') || {};
            let empty = Object.keys(wishlist).length > 0 ? 'none' : '';
            document.querySelector('#table-wishlist .empty').style.display = empty;
            for(let key in wishlist) {
                let product = data.products.find(item => item.id == key);
                product.quantity = wishlist[key];
                ShopUi.renderAddToWishlist(product);
            }
            ShopUi.renderUpdateWishlist();
        };
        
        let productInfo = function(e) {
            let product = e.data.product;
            ShopUi.renderProductInfo(product);
        };
        
        let calculateTotal = function() {
            let cart = localStorage.getObject('cart') || {};
            let total = 0;
            for(let key in cart) {
                let product = data.products.find(item => item.id == key);
                total += parseInt(product.price) * parseInt(cart[key]);
            };
            ShopUi.renderTotalPrice(total);
            return total;
        };
        
        let changeQuantity = function(e) {
            let id = e.target.closest('tr').data.id;
            let quantity = e.target.value;
            if( quantity == '' ) {
                e.target.value = 1;
                quantity = 1;
            }
            let cart = localStorage.getObject('cart') || {};
            cart[id] = quantity;
            localStorage.setObject('cart', cart);
            calculateTotal();
            ShopUi.renderUpdateCart();
        };
        
        let login = function(e) {
            let username = e.data.username;
            localStorage.setItem('username', username);
            ShopUi.renderLogin(username);
        };
        
        let order = function(e) {
            let sort = document.querySelector('#products-sort').value;
            let order = e.target.classList.contains('descending') ? 'desc' : 'asc';
            let dataSort = {};
            dataSort[`data.${sort}`] = order;
            Lazy.sort('#list-products', ':scope > li', dataSort);
        };
        
        let search = function(e) {
            let search = document.querySelector('#input-search-products').value;
            let results = Lazy.filter('#list-products', ':scope > li', {
                search: search,
                searchAttributes: ['data.name', 'data.description']
            });
            let empty = results === 0 ? 'flex' : 'none';
            document.querySelector('#list-products .empty').style.display = empty;
            window.location.href = '#shop';
        };
        
        let categorize = function(e) {
            let productCategories = data['product_categories'];
            let categories = e.data.categories;
            let ids = categories.reduce((acc, key) => acc.concat(productCategories[key] || []), []);
            
            let results;
            if(categories.length > 0) {
                let filters = {'data.id': ids};
                results = Lazy.filter('#list-products', ':scope > li', {
                    filters: filters
                });
            }
            else {
                results = Lazy.filter('#list-products', ':scope > li', {
                    search: '',
                    searchAttributes: ['data.name']
                });
            }
            
            let empty = results === 0 ? 'flex' : 'none';
            document.querySelector('#list-products .empty').style.display = empty;
            ShopUi.renderCategorize();
        };
        
        let clearSearch = function(e) {
            // Delaying the function execute
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
            this.timer = window.setTimeout(function() {
                let search = document.querySelector('#input-search-products').value;
                if( search == '') {
                    let results = Lazy.filter('#list-products', ':scope > li', {
                        search: search,
                        searchAttributes: ['data.name', 'data.description']
                    });
                    let empty = results === 0 ? 'flex' : 'none';
                    document.querySelector('#list-products .empty').style.display = empty;
                }
            }, 500); 
        };
        
        let addProducts = function() {
            let products = data['products'];
          
            // add products
            document.querySelector('#list-products .empty').style.display = 'none';
            [].forEach.call(products, function (product) {
                ShopUi.renderProduct(product);
            });
        };
        
        let addCategories = function() {
            
            let categories = data['categories'];
            let hierarchies = data['hierarchies'];

            document.querySelector('#product-categories .empty').style.display = 'none';
            for(let key in hierarchies) {
                let category = categories.find(cat => cat.id == key);
                let li = ShopUi.markUpListCategory(category);
                
                let optGroup = document.createElement('optgroup');
                optGroup.setAttribute('label', category['name']);
                
                let subCategories = hierarchies[key];
                if(subCategories) {
                    let ul = document.createElement('ul');
                    [].forEach.call(subCategories, function(sub){
                        let subCategory = categories.find(category => category.id == sub);
                        let subLi = ShopUi.markUpListCategory(subCategory);
                        let option = ShopUi.markUpOptionCategory(subCategory);
                        option.data = subCategory;
                        subLi.data = subCategory;
                        optGroup.append(option);
                        ul.append(subLi);
                    });
                    li.append(ul);
                }
                
                ShopUi.renderDropdownCategories(optGroup);
                ShopUi.renderCategories(li);
            }
        };
        
        let addToCart = function(e) {
            let product = e.data.product;
            let cart = localStorage.getObject('cart') || {};
            document.querySelector('#table-cart .empty').style.display = 'none';
            if(!cart[product.id]) {
                product.quatity = 1;
                ShopUi.renderAddToCart(product);
            }
            cart[product.id] = cart[product.id] ? cart[product.id] + 1 : 1;
            localStorage.setObject('cart', cart);
            calculateTotal();
            ShopUi.renderUpdateCart();
        };
        
        let addToWishlist = function(e) {
            let product = e.data.product;
            let wishlist = localStorage.getObject('wishlist') || {};
            wishlist[product.id] = wishlist[product.id] ? wishlist[product.id] + 1 : 1;
            document.querySelector('#table-wishlist .empty').style.display = 'none';
            localStorage.setObject('wishlist', wishlist);
            ShopUi.renderAddToWishlist(product);
            ShopUi.renderUpdateWishlist();
        };
        
        let removeFromCart = function(e) {
            let product = e.data.product;
            let cart = localStorage.getObject('cart') || {};
            delete cart[product.id];
            if( Object.keys(cart).length === 0) {
                document.querySelector('#table-cart .empty').style.display = '';
            }
            localStorage.setObject('cart', cart);
            calculateTotal();
            ShopUi.renderRemoveFromCart(product);
            ShopUi.renderUpdateCart();
        };
        
        let removeFromWishlist = function(e) {
            let product = e.data.product;
            let wishlist = localStorage.getObject('wishlist') || {};
            delete wishlist[product.id];
            if( Object.keys(wishlist).length === 0) {
                document.querySelector('#table-wishlist .empty').style.display = '';
            }
            localStorage.setObject('wishlist', wishlist);
            ShopUi.renderRemoveFromWishlist(product);
            ShopUi.renderUpdateWishlist();
        };
        
        let checkout = function(e) {
            let cart = localStorage.getObject('cart') || {};
            let empty = Object.keys(cart).length > 0 ? 'none' : '';
            document.querySelector('#table-orders .empty').style.display = empty;
            for(let key in cart) {
                let product = data.products.find(item => item.id == key);
                product.quantity = cart[key];
                ShopUi.renderAddToOrder(product);
            }
            localStorage.setObject('cart', {});
            calculateTotal();
            ShopUi.clearCart();
            ShopUi.renderUpdateCart();
            window.location.href = '#profile'; 
        };
        
        let logout = function(e) {
            localStorage.removeItem('username');
            localStorage.removeItem('cart');
            localStorage.removeItem('wishlist');
            ShopUi.clearCart();
            ShopUi.clearWishlist();
            ShopUi.renderUpdateCart();
            ShopUi.renderUpdateWishlist();
            ShopUi.renderLogout();
        };
        
        let publicFunction = function() {
            return 'I am a public function';
        };

        init();
        
        /* 
         * ---------------------------------------------------------------------
         * Public Members
         * ---------------------------------------------------------------------
         */

        return {
            publicFunction: () => publicFunction()
        };
        
    }());
    
});
