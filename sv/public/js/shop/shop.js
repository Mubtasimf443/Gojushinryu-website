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
        changeWindow(e);
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
             selling_price_canada ,
             selling_amount
             } =el;

             let df_size,df_price;
             let priceComponent=(function name(params) {
                 if (selling_style ==='per_price') {
                    df_price=selling_price_canada;
                    df_size=selling_amount;
                     return "$"+selling_price_canada 
                 } else {       
                    df_price=size_and_price[0].piu;
                    df_size=size_and_price[0].key;
                     return '$'+ df_price;
                 }
             })();
             let prod=`
             <a
             href="${window.location.origin}/shop/equipments/${id}"
             class="product-card">
             <img src="${thumb}" alt="Martial Art Equiment  no ${index}" class="product_img">
             <h2>${name}</h2>
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
        return
    }
    if (!check) {

    let prod=productDataArray.find(el => el.id ==id);
    if (!prod) return
    addedProduct.push({
        product :prod,
        quantity:1,
        id,
        df_price :e.target.getAttribute('df-price'),
        df_size:e.target.getAttribute("df-size")
    });
    addToStorage(addedProduct)
    .then(e=> {
     shopAddtoCartNumberofProduct()
    })
    return
}
 }
 

 async function changeWindow(e) {
    let id= e.target.getAttribute('prod-id');
    setTimeout(() => {
        window.location.replace(`/shop/equipments/${id}`)
    }, 3000);
 }