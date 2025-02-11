/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */



let descriptionElment = document.querySelector(`[class="product-description"]`).querySelector('p');
let sizeDetailsElement=document.querySelector(`[class="product-size-details"]`).querySelector('p');
let selectEl = document.querySelector('#size');
let priceEl = document.querySelector('.product-price');
let addToCardElement = document.querySelector(`[class="add-to-cart"]`);
var name;
var description;
var cetegory;
var thumb;
var id;
var images;
var selling_style;
var selling_price;
var size_and_price;
let df_size, df_price, product,sizeDetails;


selectEl.addEventListener("change", (e) => {
    let option = e.target.selectedOptions[0];
    df_size = option.value;
    df_price = option.getAttribute('price');
    priceEl.innerHTML = '$' + Number(df_price).toFixed(2) + '<sup>' + df_size + '</sup>';
})


window.addEventListener('load', async function () {
    try {
        let res= await fetch(window.location.origin + `/api/api_s/get-product-from-query?id=${id}`)
        let response=await res.json();
        let error = response.error, prod = response.product;
        if (error) {
            console.log('error' + error);
            return;
        }
        if (prod) {
            product = prod;
            images = prod.images;
            name = prod.name;
            id = prod.id;
            description = prod.description;
            df_size = prod.SizeAndPrice[0].size;
            df_price = prod.SizeAndPrice[0].price;
            size_and_price=prod.SizeAndPrice;
            sizeDetails=prod.sizeDetails;
            LoadUi();
        }


    } catch (error) {
        console.error(error);
    }
})

function LoadUi() {
    descriptionElment.innerHTML = description;
    sizeDetailsElement.innerHTML= sizeDetails;
    // priceEl.innerHTML = '$' + df_price;
    priceEl.innerHTML = '$' + Number(size_and_price[0].price).toFixed(2) + '<sup>' + size_and_price[0].size + '</sup>';
    size_and_price.forEach(function (el) {
        selectEl.innerHTML += `<option value="${el.size}" price="${el.price}" >${el.size}</option>`;
    });
    selectEl.style.display = 'flex';
}




addToCardElement.addEventListener('click', e => {
    (async e => {
        if (addedProduct.length === 0) {
            addedProduct.push({//added products form header.js shop header
                prod: product,
                quantity: 1,
                id: id,
                df_size: df_size,
                df_price: Number(df_price)
            })
            addToStorage(addedProduct) // addToStorage form shop header.js 
            log('/added to emty array')
            return
        }
        let check = addedProduct.findIndex(el => el.id === id);
        if (check > -1) {
            addedProduct = addedProduct.map(el => {
                if (el.id !== id) return el
                if (el.id === id) {
                    el.df_size = df_size;
                    el.df_price = Number(df_price);
                    el.quantity = el.quantity + 1;
                    return el
                }
            });
            addToStorage(addedProduct) // addToStorage form shop header.js 
            log('/incluedes to inclueding array')

            // setTimeout(() => {
            //     window.location.replace("/shop/cart")
            // }, 1000);
            return

        }
        if (check === -1) {
            addedProduct.push({//added products form header.js shop header
                prod: product,
                quantity: 1,
                id: id,
                df_size: df_size,
                df_price: Number(df_price)
            })
            log('/incluedes to big array')
            return addToStorage(addedProduct) // addToStorage form shop header.js
        }
    })(e)
        .then(e => setTimeout(() => { window.location.assign('/shop/cart') }, 700))
        .catch(e => log(e))

}
);




