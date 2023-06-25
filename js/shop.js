/* 
 * =============================================================================
 * Author: Mark Angelo Angulo
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', function (){

    Shop = (function() {
        
        const moduleResources = './';
        
        /* 
         * ---------------------------------------------------------------------
         * Private Members
         * ---------------------------------------------------------------------
         */
        
        let init = function() {
			initializeServiceWorker();
            bindings();
        };
        
        let bindings = function() {
            
        };
        
        let initializeServiceWorker = function() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./sw-shop.js').then(function(reg) {
                    console.log('Successfully registered service worker', reg);
                }).catch(function(err) {
                    console.warn('Error whilst registering service worker', err);
                });
            }
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