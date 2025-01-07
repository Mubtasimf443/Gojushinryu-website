/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */
const productContainer = document.querySelector(`[class="product-container"]`);
let productDataArray = [];
const currency = `<span style="font-family:"Roboto"sans-serif;" class="currency">$</span>`;


window.addEventListener('load', () => LoadProducs());


productContainer.addEventListener('click', e => {
    console.log(e.target);
    if (e.target.className === 'add-to-cart') {
        e.preventDefault();
        e.stopPropagation();
        addToCard(e);
    }
})


//function



async function LoadProducs(params) {

    await fetch(window.location.origin + '/api/api_s/find-product')
        .then(res => res.json())
        .then(
            ({ success, product, error }) => {
                if (error) {
                    let h2 = document.createElement('h2');
                    h2.innerHTML = 'Loading Products';
                    productContainer.innerHTML = ``;
                    productContainer.appendChild(h2);
                    h2.innerHTML = 'Failded To load Data';
                    h2.style.color = 'red';
                    return;
                }
                if (success) {
                    productDataArray = [...product];
                    let insertionHtml = ``;
                    for (let index = 0; index < product.length; index++) {
                        const el = product[index];
                        let {
                            name,
                            id,
                            thumb,
                            description,
                            SizeAndPrice
                        } = el;
                        let
                            df_size = SizeAndPrice[0].size,
                            df_price = SizeAndPrice[0].price;
                        let prod = `
                        <a href="${window.location.origin}/shop/equipments/${id}" class="product-card">
                            <img src="${thumb}" alt="Martial Art Equiment  no ${index}" class="product_img">
                            <h5>${name?.length > 55 ?name.substring(0, 55):name }</h5>
                            <p>${description.length > 70 ? description.substring(0,70) : description}</p>
                            <div class="price">${currency}${df_price}</div>
                            <button df-size="${df_size}" df-price="${df_price}" prod-id="${id}" class="add-to-cart">Add to Cart</button>
                        </a>`;
                        insertionHtml = prod + insertionHtml;
                    }
                    productContainer.innerHTML = insertionHtml;


                }
            })
        .catch(e => console.log(e));
}


async function addToCard(e) {
    let id = e.target.getAttribute('prod-id');
    let check = addedProduct.find(el => el.id == id);
    if (check) {
        addedProduct = addedProduct.map(el => {
            if (el.id == id) {
                el.quantity += 1;
                return el
            }
            else return el
        })
        return window.location.assign('/shop/cart')
    }
    if (!check) {

        let prod = productDataArray.find(el => el.id == id);
        if (!prod) { return }
        addedProduct.push({
            prod: prod,
            quantity: 1,
            id,
            df_price: Number(e.target.getAttribute('df-price')),
            df_size: e.target.getAttribute("df-size")
        });
        log(Number(e.target.getAttribute('df-price')));
        addToStorage(addedProduct);
        shopAddtoCartNumberofProduct();
        return
    }
}
