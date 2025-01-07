/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */

let log = e => console.log(e);
var addedProduct = [];
const StorageName = 'add-to-cart-products';



window.addEventListener('load', function () {
    addedProduct = loadAddedProducts();
    shopAddtoCartNumberofProduct()
})

//function

function loadAddedProducts(params) {
    let prod = localStorage.getItem(StorageName);
    if (!prod) {
        log('!prod')
        shopAddtoCartNumberofProduct();
        return [];
    }
    prod = JSON.parse(prod);
    if (!Array.isArray(prod)) {
        log('!prod instanceof Array')
        shopAddtoCartNumberofProduct();
        return [];
    }

    return prod
}

function addToStorage(value) { localStorage.setItem(StorageName, JSON.stringify(value)) };
function shopAddtoCartNumberofProduct() { document.querySelector(`#added-to-cart-product`).innerText = addedProduct.length };