/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */


{//---------------------scope---------------------


    let totalProductAmount = 0;
    let totalCost = 0;
    let checkoutApiArray = [];
    let orderSummary = document.querySelector('.order-summary');
    let items = document.querySelector('.items');
    let total = document.querySelector('.total');
    let PlaceOrderButton = document.querySelector('.PlaceOrderButton');
    let requesting = false;

    window.addEventListener('load', async e => {

        if (!addedProduct.length) // If There is no product return back to shop page
        {
            orderSummary.innerHTML = `
        <div class="item">
        <h2 style="color:red">There is No Product</h2>
        </div>
        `;
            setTimeout(() => {
                window.location.replace('/shop')
            }, 2000);
            return
        }


        let checkSpam = false;
        for (let i = 0; i < addedProduct.length; i++) {
            let { id, prod, quantity, df_price, df_size } = addedProduct[i];
            if (!id) checkSpam = true;
            if (typeof prod !== 'object') checkSpam = true;
            if (!quantity) checkSpam = true;
            if (!df_price) checkSpam = true;
            if (!df_size) checkSpam = true;
        }


        if (checkSpam) {
            addToStorage([]);
            window.location.reload();
            return;
        } //Spaming is proved

        addedProduct.forEach(element => {
            let { prod, id, df_price, quantity, df_size } = element;

            function addbr(t = '') {
                if (t.length > 150) t = t.substring(0, 150) + '...';
                let newtext = '';
                for (let i = 0; i < t.length; i++) {
                    if (i % 35 === 0 && i !== 0) newtext += '-<br>-';
                    newtext += t.at(i);
                }
                return newtext;
            }

            items.innerHTML += (`
            <div class="item">
                <img src="${prod.thumb}"  alt="Product Image">
                    <p>${prod.name.length > 40 ? addbr(prod.name) : prod.name}</p>
                    <span>$${df_price * quantity}.00</span>
            </div> `);

            totalProductAmount += df_price * quantity;

            checkoutApiArray.push(
                (function (id, size, quantity) {
                    if (Number(id).toString() === 'NaN') throw new Error('not valid id')
                    if (Number(quantity).toString() === 'NaN') throw new Error('not valid quantity')
                    if (typeof size !== 'string') throw new Error('not valid string')
                    return {
                        id,
                        size,
                        quantity
                    }
                })(id, df_size, quantity)
            );
        });
        totalCost = totalProductAmount;
        total.innerHTML = totalCost;

    })



    function v(htmlElementSelector) {
        let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
        let el = document.querySelector(htmlElementSelector);
        if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
        let value = el.value;
        if (!value) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('<')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('>')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes("'")) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('"')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('`')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('{')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('}')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('[')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes(']')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        return value
    }


    document.querySelectorAll('input').forEach(
        function (el) {
            function removeOutline(event) {
                event.target.style.outline = 'none';
            }
            el.addEventListener('keypress', removeOutline);
            el.addEventListener('change', removeOutline);
        }
    );

    PlaceOrderButton.addEventListener('click', async function (event) {
        event.preventDefault();
        if (requesting === true) return alert('Wait till order is placed successfully...');
        try {
            let object = {
                reciver: {
                    fname: v(`[placeholder="First Name"]`),
                    lname: v(`[placeholder="Last Name"]`),
                    email: v(`[placeholder="Reciever Email"]`),
                    phone: v(`[placeholder="Phone Number"]`)
                },
                location: {
                    city: v(`[placeholder="City"]`),
                    country: selectElValue(`[id="countrySelect"]`),
                    district: v(`[placeholder="District"]`),
                    road_no: v(`[placeholder="Road No / Village / Street"]`),
                    zipcode: v(`[placeholder="zipcode/postcode"]`)
                },
                notes: v(`[placeholder="Notes"]`),
                items: addedProduct.map(
                    function (element) {
                        return ({
                            quantity: element.quantity,
                            sizeAndPrice: {
                                size: element.df_size,
                                price: element.df_price
                            },
                            id: element.id
                        });
                    }
                )
            }
            PlaceOrderButton.style.opacity = 0.7;
            requesting = true;
            let response = await fetch(window.location.origin + '/api/l-api/order/create', {
                method: 'POST',
                body: JSON.stringify(object),
                headers: {
                    'Content-Type': "application/json"
                }
            });
            PlaceOrderButton.style.opacity = 1;
            requesting = false;
            let popup_box = document.querySelector('.bg_popup');
            let popup = document.querySelector('.bg_popup').querySelector('.popup');
            let popup_title = popup.querySelector('b');
            let popup_description = popup.querySelector('span');
            let popup_btn = popup.querySelector('button');
            if (response.status === 201) {
                popup_box.style.display = 'flex';
                popup_title.innerHTML = 'Order Placed SuccessFully';
                popup_description.innerHTML = 'We have recived your order , We are going to inform you about how you can pay us and what is the shipping cost in your country';
                popup_btn.innerHTML = 'Ok, Thanks';
                popup_btn.addEventListener('click', function (event) {
                    event.preventDefault();
                    window.location.replace('/home');
                });
                setTimeout(() => window.location.replace('/home'), 10000);
                return;
            } else {
                let json = await response.json().catch(e => ({ error: "failed to parse json" }));
                console.log(json);
                popup_box.style.display = 'flex';
                popup_title.innerHTML = 'Failed Placed the Order';
                popup_description.innerHTML = 'Because of an unknown server error , not allowed to request , the order was no placed , so please try again  ';
                popup_btn.innerHTML = 'Ok';
                popup_btn.addEventListener('click', function (event) {
                    event.preventDefault();
                    window.location.reload();
                });

            }
            return;
        } catch (error) {
            console.log({ error });
        }
    })



    function selectElValue(seletor) {
        let element = document.querySelector('select');
        if (element.tagName !== 'SELECT') throw 'Please choose a select html element';
        if (!element.selectedOptions[0].value || element.selectedOptions[0].value?.trim() === '') {
            element.style.border = '2px solid red';
            element.addEventListener('change', function removeBorder(e) {
                e.target.style.border = 'none';
                e.target.removeEventListener('change', removeBorder);
            });
            throw 'please select a country';
        }
        return element.selectedOptions[0].value;
    }



}