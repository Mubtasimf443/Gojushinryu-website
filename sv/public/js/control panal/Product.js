/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    let container = document.querySelector(`[targetedElement="product_href"]`);
    let products = container.querySelector(`[class="products"]`);
    let popup = document.querySelector('#popup_product_action');
    let done = false;
    let productsList = [];
    let productOfPopup = undefined;
    let isProductOfPopupUpdated = false;
    let observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !done) {
            fetch(window.location.origin + '/api/api_s/find-product')
                .then(e => e.json())
                .then(e => {
                    let { error, success, product } = e;
                    if (error) console.error(error);
                    if (success) {
                        let prod = products.querySelector('.product');
                        prod.innerHTML = product.length + prod.innerHTML;
                        productsList = product;
                        for (let i = 0; i < product.length; i++) {
                            const { thumb, name, cetegory, id, SizeAndPrice } = product[i];
                            let div = document.createElement('div');
                            div.className = 'product';
                            div.innerHTML = (`
                                <img src="${thumb}">
                                <span class="name">${name}</span>
                                <button product_id="${id}" class="product_list_action" DELETE >DELETE</button>
                                <button product_id="${id}" class="product_list_action" UPDATE >Update</button>
                            `);

                            products.appendChild(div);
                            function removeProduct(e) {
                                let id = e.target.getAttribute('product_id');


                                let jsonObject = JSON.stringify({
                                    id: id
                                })


                                fetch(window.location.origin + '/api/api_s/delete-product', {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: jsonObject
                                })
                                    .then(e => e.json())
                                    .then(e => console.log(e))


                                document.querySelector(`[product_id="${id}"]`).parentElement.remove();
                            }

                            div.querySelector('[DELETE]').addEventListener('click', e => removeProduct(e));
                            div.querySelector('[UPDATE]').addEventListener('click', shopUpdatePopup);
                        }


                        done = true;
                    }
                })
        }
    })


    function shopUpdatePopup(event = new Event('click')) {
        event.preventDefault();

        popup.setAttribute('pid', event.target.getAttribute('product_id'));
        let product = productsList.find(function (p) {
            if (p.id == event.target.getAttribute('product_id')) return p;
        });

        if (!product) throw new Error("Can not Find Product");
        popup.querySelector('.thumb-label').style.backgroundImage = "url('" + product.thumb + "')";
        productOfPopup = product;
        for (let i = 0; i < product.images.length; i++) {
            const element = product.images[i];
            let div = document.createElement("div");
            let images = document.createElement("img");
            images.src = element;
            div.append(images);
            let span = document.createElement("button");
            span.className = "remove";
            span.setAttribute("data", element);
            span.setAttribute("pid", product.id);
            div.append(span);
            popup.querySelector(".imgs").appendChild(div);
            span.addEventListener('click', async function (e) {
                try {
                    e.preventDefault();
                    if (productOfPopup.images.length === 1) {
                        return alert("Can't remove last image");
                    }
                    if (confirm("Are you sure you want to remove this image from product?")) {
                        e.target.parentElement.style.opacity = .6;
                        let data = e.target.getAttribute('data');
                        let id = e.target.getAttribute('pid');
                        let response = await fetch(window.location.origin + '/api/api_s/product/image?id=' + id, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                image: data
                            })
                        });
                        if (response.status === 204) {
                            productsList = productsList.map(function (product) {
                                if (product.id === id) {
                                    product.images = product.images.filter(function (img) {
                                        if (img !== data) return img;
                                    });
                                }
                                return product;
                            });
                            productOfPopup.images = productOfPopup.images.filter(function (img) {
                                if (img !== data) return img;
                            });
                            e.target.parentElement.remove();
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
        popup.querySelector('[name="name"]').value = product.name;
        popup.querySelector('[placeholder="Details"]').value = product.description;
        popup.querySelector('[name="sizeDatails"]').value = product.sizeDetails;
        let select = popup.querySelector('select');
        console.log(select.options.length);

        for (let i = 0; i < select.options.length; i++) {
            const element = select.options[i];
            if (element.value.toLowerCase() === product.cetegory.toLowerCase()) {
                select.selectedIndex = i;
            }
        }
        for (let i = 0; i < product.SizeAndPrice.length; i++) {
            const { price, size } = product.SizeAndPrice[i];
            popup.querySelector('tbody').innerHTML += (`
                <tr style="background:inherit">
                <td>${size}</td>
                <td>${price}</td>
                <td><button deleteProductSize size_id="${i}">Delete</button></td>
                </tr>`
            );
        }
        popup.querySelectorAll(`[size_id]`).forEach(function (element) {
            element.addEventListener('click', function (e) {
                e.preventDefault();
                let size_id = e.target.getAttribute('size_id');
                if (productOfPopup.SizeAndPrice.length === 1) return alert('1 Product size is compulsory');
                productOfPopup.SizeAndPrice = productOfPopup.SizeAndPrice.filter((el, i) => i != size_id);
                popup.querySelector(`[size_id="${size_id}"]`).parentElement.parentElement.remove();
                isProductOfPopupUpdated = true;
            });
        })

        popup.style.display = 'flex';
    }
    observer.observe(products)
    popup.querySelector('.popup-close-btn').addEventListener('click', function (event = new CustomEvent('click')) {
        event.preventDefault();
        popup.style.display = 'none';
        popup.querySelectorAll('input').forEach(function (element) { element.value = null; })
        popup.querySelectorAll('textarea').forEach(function (element) { element.value = null; })
        popup.querySelector('.imgs').innerHTML = '';
        popup.querySelector('.thumb-label').style.backgroundImage = '';
        popup.querySelector('tbody').innerHTML = '';
        productOfPopup = undefined;
        isProductOfPopupUpdated = false;
    });

    popup.querySelector('[placeholder="Details"]').addEventListener('input', function (e) {
        e.preventDefault();
        if (e.target.value.trim().length === 0) return alert('You must add product details ');
        productOfPopup.description = e.target.value;
        isProductOfPopupUpdated = true;
    });

    popup.querySelector('[name="sizeDatails"]').addEventListener('input', function (e) {
        e.preventDefault();
        if (e.target.value.trim().length === 0) return alert('You must add product size details ');
        productOfPopup.sizeDetails = e.target.value;
        isProductOfPopupUpdated = true;
    });

    popup.querySelector('[name="name"]').addEventListener('input', function (e) {
        e.preventDefault();
        if (e.target.value.trim().length === 0) return alert('You must add product name ');
        productOfPopup.name = e.target.value;
        isProductOfPopupUpdated = true;
    });

    popup.querySelector('select').addEventListener('change', function (e) {
        productOfPopup.cetegory = popup.querySelector('select').selectedOptions[0].value;
        isProductOfPopupUpdated = true;
    });


    popup.querySelector(`[id="product-popup-image-input"]`).addEventListener('change', async function (event) {
        try {

            if (productOfPopup.images.length === 10) {
                return alert('You can add a maximum of 10 images');
            }
            let file = event.target.files[0];
            if (file.type.includes('image/') === false) {
                return alert('Please select an image file');
            }
            let div = document.createElement("div");
            let images = document.createElement("img");
            images.src = '/img/spinner.svg';
            let randomNumber = Date.now().toString();
            images.setAttribute('data', randomNumber);
            div.append(images);
            popup.querySelector('.imgs').appendChild(div);
            let form = new FormData();
            form.append('img', file);
            let response = await fetch(window.location.origin + '/api/api_s/product/image?id=' + productOfPopup.id, {
                method: 'post',
                body: form
            });
            if (response.ok) {
                let image = (await response.text()).trim();
                productOfPopup.images.push(image);
                images.src = image;
            }
        } catch (error) {
            console.error(error);
        }
    })

    popup.querySelector(`[id="product-popup-thumb-image-input"]`).addEventListener('change', async function (event) {
        try {
            if (confirm('Are you sure you want change the thumbnail ?')) {
                let file = event.target.files[0];
                if (file.type.includes('image/') === false) {
                    return alert('Please select an image file');
                }
                let form = new FormData();
                form.append('img', file);
                let response = await fetch(window.location.origin + '/api/api_s/product/thumb?id=' + productOfPopup.id, {
                    method: 'put',
                    body: form
                });
                if (response.ok) {
                    let image = (await response.text()).trim();
                    popup.querySelector('.thumb-label').style.backgroundImage = "url('" + image + "')";
                }
            }
        } catch (error) {
            console.error(error);
        }
    });


    popup.querySelector('.popup-Update-btn').addEventListener('click', async function (event) {
        try {
            if (isProductOfPopupUpdated === false || !productOfPopup) return alert('Product was not updated');
            event.preventDefault();
            event.target.style.opacity = .6;
            let response = await fetch(window.location.origin + '/api/api_s/product?id=' + productOfPopup.id, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productOfPopup)
            });
            productsList= productsList.filter(function (element) {
                if (element.id === productOfPopup.id ) {
                    return productOfPopup;
                }
                return element;
            });
            popup.querySelectorAll('input').forEach(function (element) { element.value = null; })
            popup.querySelectorAll('textarea').forEach(function (element) { element.value = null; })
            popup.querySelector('.imgs').innerHTML = '';
            popup.querySelector('.thumb-label').style.backgroundImage = '';
            popup.querySelector('tbody').innerHTML = '';
            productOfPopup = undefined;
            isProductOfPopupUpdated = false;
            popup.style.display = 'none';
            
        } catch (error) {
            console.error(error);
        } finally {
            event.target.style.opacity = 1;
        }
    });


    popup.querySelector('form').addEventListener('submit', function (event) {
        try {
            event.preventDefault();
            let form = event.target;
            let size= popup.querySelector('form').querySelector(`[name="size"]`);
            let price =  popup.querySelector('form').querySelector(`[name="price"]`);
            if (size.value.trim().length === 0 ) return alert('size is not specified');
            if (isNaN(price.valueAsNumber) || price.valueAsNumber < 1) return alert('size is not specified');
            productOfPopup.SizeAndPrice.push({ size: size.value, price: price.valueAsNumber });
            popup.querySelector('tbody').innerHTML += (`
                <tr style="background:inherit">
                <td>${size.value}</td>
                <td>${price.valueAsNumber}</td>
                <td><button deleteProductSize size_id="${productOfPopup.SizeAndPrice.length -1 }">Delete</button></td>
                </tr>`
            );
            size.value = null;
            price.value = null;
            isProductOfPopupUpdated=true;
            return;
        } catch (error) {
            console.error(error);
        }
    })

}
