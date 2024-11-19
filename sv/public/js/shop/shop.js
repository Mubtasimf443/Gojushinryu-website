/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */
const productContainer=document.querySelector(`[class="product-container"]`);
let productDataArray=[];


window.addEventListener('load',async (e) => {
    LoadProducs();
   
});

productContainer.addEventListener('click', e => {
    console.log(e.target);
    if (e.target.className==='add-to-cart') {
        e.preventDefault();
        e.stopPropagation();
        addToCard(e);
    }
})


//function



async function LoadProducs(params) {
    let h2=  document.createElement('h2');
    h2.innerHTML='Loading Products' ;
    productContainer.appendChild(h2);
    await fetch(window.location.origin+ '/api/api_s/find-product')
    .then(res =>res.json())
    .then(
     ({ success ,product,error }) => {
         if (error)  {
             h2.innerHTML='Failded To load Data';
             h2.style.color='red';
             return
         }
         if(success) {
             h2.remove()
             productDataArray=[...product];
             product.forEach((el ,index) => {
             let {
             name ,
             id ,
             cetegory,
             thumb,
             description,
             selling_style,
             size_and_price ,
             price ,
             size
             } =el;

             let df_size,df_price;
             let priceComponent=(function name(params) {
                 if (selling_style ==='per_price') {
                    df_price=price;
                    df_size=size;
                     return "$"+df_price 
                 } else {       
                    df_price=size_and_price[0].price;
                    df_size=size_and_price[0].size;
                     return '$'+ df_price;
                 }
             })();
             let prod=`
             <a
             href="${window.location.origin}/shop/equipments/${id}"
             class="product-card">
             <img src="${thumb}" alt="Martial Art Equiment  no ${index}" class="product_img">
             <h5>${name}</h5>
             <p>${description.length >50 ? description.substring(0,50) :description}</p>
             <div class="price">${priceComponent}</div>
             <button
             df-size="${df_size}"
             df-price="${df_price}"
             prod-id="${id}"
              class="add-to-cart">Add to Cart</button>
             </a>`
             productContainer.innerHTML =productContainer.innerHTML+prod;
 
             });
 
         }
     })
     .catch(e => console.log(e));
}


async function addToCard(e) {
    let id= e.target.getAttribute('prod-id');
    let check=addedProduct.find(el=> el.id == id);
    if (check) {
        addedProduct =addedProduct.map(el => {
            if (el.id == id) {
                el.quantity += 1;
                return el
            }
            else return el
        }) 
        return window.location.assign('/shop/cart')
    }
    if (!check) {

    let prod=productDataArray.find(el => el.id ==id);
    if (!prod) { return}
    addedProduct.push({
        prod:prod,
        quantity:1,
        id,
        df_price:Number(e.target.getAttribute('df-price')),
        df_size:e.target.getAttribute("df-size")
    });
    log(
        Number(e.target.getAttribute('df-price'))
    )
    addToStorage(addedProduct)
    .then(e=> {
     shopAddtoCartNumberofProduct()
    })
    return
}
 }
 