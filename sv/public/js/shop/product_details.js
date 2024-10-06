/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */
{


let descriptionElment = document.querySelector(`[class="product-description"]`).querySelector('p');
let selectEl =document.querySelector('#size');
let priceEl =document.querySelector('.product-price');
let addToCardElement =document.querySelector(`[class="add-to-cart"]`);
var name ;
var description;
var cetegory;
var thumb;
var id;
var images;
var selling_style;
var selling_price;
var size_and_price;
let df_size;
let df_price;
let product;

selectEl.addEventListener("change",(e) => {
  let option= e.target.selectedOptions[0];
  df_size=option.value;
  df_price=option.getAttribute('price');
  priceEl.innerHTML='$'+df_price +'<sup>'+df_size+'</sup>';
})


window.addEventListener('load',async e =>{
    let json =await JSON.stringify({id});
    
    fetch(window.location.origin+'/api/api_s/give-product-details',{
        method :'Post',
        headers:{
            "Content-Type":"application/json",
        },
        body:json
    })
    .then(e=> e.json())
    .then(({prod,error}) =>
    {
        if (error) {
             console.log('error'+ error);
            return 
        }
        if (prod) {
            // log(prod)
          product =prod;
          images =prod.images;
          name =prod.name;
          id =prod.id;
          description =prod.description;
          selling_style =prod.selling_style;
          selling_price=prod.selling_price;
          size_and_price=prod.size_and_price;
          if (selling_style === 'per_price') {
            df_size = prod.size;
            df_price=selling_price;
            
            
          }
          if (selling_style !== 'per_price') {
            df_size=size_and_price[0].size;log('df_size' + df_size);
            df_price=size_and_price[0].price;
          }
          LoadUi();
        }
    }
    )
    .catch(e =>console.log(e) )
})

function LoadUi() {
   log(selling_style)
    descriptionElment.innerHTML = description;
    if (selling_style ==='per_price'){
     
        priceEl.innerHTML='$'+ selling_price;
    }
    if (selling_style !=='per_price'){
        priceEl.innerHTML='$'+ size_and_price[0].piu;
        size_and_price.forEach(({key,piu})=> {
            selectEl.innerHTML = selectEl.innerHTML + `<option value="${key}" price="${piu}" >${key}</option>`;
        });
        selectEl.style.display='flex';
    }
    

}

addToCardElement.addEventListener('click',e => {
 (async e => {
 if (addedProduct.length === 0) {
    addedProduct.push({//added products form header.js shop header
        prod :product,
        quantity :1,
        id :id ,
        df_size:df_size,
        df_price:Number(df_price)
    })
    addToStorage(addedProduct) // addToStorage form shop header.js 
    log('/added to emty array')
    return 
 }
 let check = addedProduct.findIndex(el => el.id ===id);
 if (check > -1) {
    addedProduct= addedProduct.map(el => {
        if (el.id !== id) return el
        if (el.id === id) {
            el.df_size = df_size;
            el.df_price=Number(df_price);
            el.quantity =el.quantity+1;
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
 if (check===-1) {
    addedProduct.push({//added products form header.js shop header
        prod :product,
        quantity :1,
        id :id ,
        df_size:df_size,
        df_price: Number(df_price)
    })
    log('/incluedes to big array')
    return addToStorage(addedProduct) // addToStorage form shop header.js
 }
})(e)
.then(e => setTimeout(() => {  window.location.assign('/shop/cart')}, 700) )
.catch(e => log(e))

}
);




}