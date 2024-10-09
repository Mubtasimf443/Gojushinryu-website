/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    let container = document.querySelector(`[targetedElement="product_href"]`);
    let products = container.querySelector(`[class="products"]`);
    
    let done =false;
    let observer =new IntersectionObserver(entries => {

        if (entries[0].isIntersecting && !done) {
            fetch(window.location.origin + '/api/api_s/find-product')
            .then(e => e.json())
            .then(e => {
                let {error,success,product} =e;
                if (error) console.error(error);
                if (success) {
                    
                    let prod= products.querySelector('.product');
                    prod.innerHTML=product.length +prod.innerHTML;
                    
                    for (let i = 0; i < product.length; i++) {
                        const {thumb,name,selling_style ,cetegory,id} = product[i];
                        let div = document.createElement('div');
                        div.className='product';
                        let price =''
                        
                        if (selling_style==='per_price') {
                            price=product[i].price +'.00'
                        }

                        if (selling_style!=='per_price') {
                            price =product[i].size_and_price[0].price + '.00';
                        }

                        div.innerHTML=
                        `
                        <img src="${thumb}">
                        <span class="name">${name}</span>
                        <span class="price">${price}$</span>
                        <span class="cetegory">
                        ${cetegory}
                        </span>
                        <button
                        product_id="${id}"
                        class="product_list_action">DELETE</button>
                        `  

                    
                        products.appendChild(div) ;
                        
                            
                        function removeProduct(e) {
                            let id = e.target.getAttribute('product_id');


                            let jsonObject = JSON.stringify({
                                id :id
                            })


                            fetch(window.location.origin +'/api/api_s/delete-product' ,{
                                method:'DELETE',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                body :jsonObject
                            })
                            .then(e => e.json())
                            .then(e => console.log(e))


                            document.querySelector(`[product_id="${id}"]`).parentElement.remove();
                        }

                        div.querySelector('button').addEventListener('click',e => removeProduct(e) )
                    }


                    done=true;
                }
            })
        }
    })


    observer.observe(products)


}