/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */

let log= e => console.log(e);
var addedProduct=[];
const StorageName='add-to-cart-products';



window.addEventListener('load',async()=> {
    addedProduct= await loadAddedProducts()
    shopAddtoCartNumberofProduct()
})

//function

async function loadAddedProducts(params) {
    let prod =localStorage.getItem(StorageName);
    if (!prod) {
        log('!prod')
        shopAddtoCartNumberofProduct();
        return [];
    }
    prod =await JSON.parse(prod);
    if (prod instanceof Array === false) { 
        log('!prod instanceof Array')
        shopAddtoCartNumberofProduct();
        return [];
    }
   
    return prod
}

async function addToStorage(value) {
    let val= await JSON.stringify(value);
    localStorage.setItem(StorageName,val);
    return true
}

 
 let shopAddtoCartNumberofProduct= async () => {
     let num =addedProduct.length;
     document.querySelector(`#added-to-cart-product`).innerText=num;
     return
 };