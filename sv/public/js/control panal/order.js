
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let container = document.querySelector(`[class="order-list-box"]`);
    let orders = container.querySelector('table')
    let seen = false;
    let popup = document.querySelector('#popup_order_action')
    let OrderData = [];
    var fetchTimeOut;
    let observer = new IntersectionObserver(entries => {
        if (seen) return
        seen = true;
        fetch(window.location.origin + '/api/api_s/find-order')
            .then(e => e.json())
            .then(async data => {
                array = data.data;
                if (!array) return
                OrderData = array;
                for (let i = 0; i < array.length; i++) {
                    let { paymentInfo, order_status, reciever, buyer, shiping_items, reciever_address, amountData, adminApproved , date} = array[i];
                    let div = document.createElement('tr');
                    div.className = 'order';
                    div.innerHTML = (`
                        <td>
                            ${i + 1}
                        </td>
                        <td>
                            ${reciever.fname}
                        </td>
                        <td>
                            ${new Date(date).toLocaleDateString() }
                        </td>
                        <td>
                            ${amountData.total ?? amountData.total_product_price}.00$
                        </td>
                        <td>
                            ${order_status}
                        </td>
                        <td>
                           <span style="color:${paymentInfo?.payment_status === true ? 'green' : 'red'}">${paymentInfo?.payment_status === true ? 'Paid' : 'Not-Paid' }  </span>
                        </td>
                        <td>
                            <button order_index="${i}">
                                View
                            </button>
                        </td>
                    `);



                    orders.appendChild(div)


                    div.querySelector('button').addEventListener('click', async function (e) {
                        e.preventDefault();
                        let index = e.target.getAttribute('order_index');
                        let { reciever, id, reciever_notes, shiping_items, reciever_address, amountData, _id, order_status } = OrderData[Number(index)];
                        popup.style.display = 'flex';

                        { //set popup value
                            sipv(`[placeholder="R.Name"]`, reciever.name);
                            sipv(`[placeholder="R.Number"]`, reciever.phone);
                            sipv(`[placeholder="R.Email"]`, reciever.email);
                            sipv(`[placeholder="Buyer Email"]`, buyer.email)
                            sipv(`[placeholder="country"]`, reciever_address.country)
                            sipv(`[placeholder="district"]`, reciever_address.district)
                            sipv(`[placeholder="city"]`, reciever_address.city)
                            sipv(`[placeholder="street"]`, reciever_address.road_no)
                            sipv(`[placeholder="postcode"]`, reciever_address.zipcode)
                            sipv(`[placeholder="Order Id"]`, id)
                            sipv(`[placeholder="TotalProductPrice"]`, amountData.total_product_price);
                        }
                 
                      
                      
                        // sipv(`[placeholder="total shipping"]`, shipping_cost);
                        // sipv(`[placeholder="total"]`, total);
                        
                        sipv(`[placeholder="tax"]`,( Number(amountData.total_product_price) * (global_gst_rate / 100)).toFixed(2) );
                        popup.querySelector('[placeholder="notes"]').value = reciever_notes;
                        popup.querySelector('select').setAttribute('order-id', _id);
                        popup.querySelector('select').setAttribute('order-id-no',id);

                        function setupSelect(status) {
                            let select=popup.querySelector('select');
                            let options={
                                pending :select.querySelector(`[value="Pending"]`),
                                cancel :select.querySelector(`[value="Cancelled"]`),
                                completed :select.querySelector(`[value="Completed"]`),
                                paymentNeeded :select.querySelector(`[value="Payment Needed"]`),
                                inDelivery :select.querySelector(`[value="In Delivery"]`),
                                inProcess :select.querySelector(`[value="In Process"]`),
                            }
                            function changeOptionDisplay(showArray = [], hideArray = [], index) {
                                let array = [options.pending, options.paymentNeeded, options.inProcess, options.inDelivery, options.completed, options.cancel];
                                showArray.forEach(function (el) { array[el - 1].removeAttribute('style') });
                                hideArray.forEach(function (el) { array[el - 1].setAttribute('style', "display: none;") });
                                if (index !== undefined) select.selectedIndex = index;
                            }

                            if (status === 'Pending') {
                                select.disabled=false;
                                changeOptionDisplay([1,2,6], [3,4,5], 0);

                                select.addEventListener('change', function changeSelect1(event) {
                                    let select=event.target;
                                    if (select.selectedOptions[0].value === 'Cancelled') {
                                        let cancelReason =popup.querySelector(`[class="cancel_notes"]`).value;
                                        if (!cancelReason || cancelReason?.trim() === '') {
                                            popup.querySelector(`[class="cancel_notes"]`).style.outline = '2px solid red';
                                            popup.querySelector('select').selectedIndex=0;
                                            alert('Please give a cancel reason what will be send to the buyer email');
                                            return;
                                        }
                                        let params = (new URLSearchParams({ id: select.getAttribute('order-id-no'), cancelReason: cancelReason })).toString();
                                        select.disabled=true;
                                        fetch(window.location.origin +`/api/api_s/order/cancel?${params}`, {method :"DELETE"}).then(res => console.log(`${res.status} :${res.statusText}`));
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.cancelReason = cancelReason;
                                                    el.order_status = "Cancelled";
                                                    el.isCancelled = true;
                                                    return el;
                                                }
                                                else return el;
                                            }
                                        );
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect1);
                                        return;
                                    };
                                    if (select.selectedOptions[0].value === "Payment Needed"){
                                        let
                                            shipping = popup.querySelector(`[placeholder="total shipping"]`).valueAsNumber,
                                            tax = popup.querySelector(`[placeholder="tax"]`).valueAsNumber;
                                        function markasred(){
                                            popup.querySelector(`[placeholder="total shipping"]`).style.outline='2px solid red';
                                            popup.querySelector(`[placeholder="tax"]`).style.outline='2px solid red';
                                            function unred(e) {
                                                e.target.style.outline='none';
                                                e.target.removeEventListener('keypress', unred);
                                                e.target.removeEventListener('change', unred);
                                            }
                                            popup.querySelector('[placeholder="total shipping"]').addEventListener('keypress', unred);
                                            popup.querySelector('[placeholder="tax"]').addEventListener('keypress', unred);
                                            popup.querySelector('[placeholder="total shipping"]').addEventListener('change', unred);
                                            popup.querySelector('[placeholder="tax"]').addEventListener('change', unred);
                                            
                                        }
                                        if (shipping === undefined || tax === undefined) {
                                            popup.querySelector('select').selectedIndex=0;
                                            markasred();
                                            alert('Please give the shipping and tax');
                                            return;
                                        }

                                        if (typeof shipping !== 'number' ||typeof tax !== 'number' ){
                                            popup.querySelector('select').selectedIndex=0;
                                            markasred();
                                            alert('shipping tax must be a number ');
                                            return;
                                        }

                                        if (shipping?.toString() === "NaN" || tax?.toString() === "NaN") {
                                            popup.querySelector('select').selectedIndex=0;
                                            markasred();
                                            alert('Shipping and tax must be a number');
                                            return;
                                        }
                                        
                                        if (shipping < 0 || tax < 0 ){
                                            popup.querySelector('select').selectedIndex=0;
                                            markasred();
                                            alert('Shipping and tax can not be -1 or less');
                                            return;
                                        }

                                        
                                        let params = (new URLSearchParams({shipping, tax ,id : popup.querySelector('select').getAttribute('order-id-no') })).toString();
                                        fetch(window.location.origin +`/api/api_s/order/order_status/payment_needed?${params}`, {method :"PUT"}).then(res => console.log(`${res.status} :${res.statusText}`));

                                        OrderData = OrderData.map(
                                            function(el){
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.order_status ='Payment Needed';
                                                    return el;
                                                }
                                                else return el;
                                            }
                                        )
                                        console.log({OrderData});
                                        popup.style.display ='none';
                                        popup.querySelector('select').disabled=true;
                                        select.removeEventListener('change', changeSelect1);
                                        return;
                                    }

                                })

                            }
                            if (status === 'Payment Needed') {
                                select.disabled=true;
                                changeOptionDisplay([1,2,3,4,5,6], [], 1)
                                

                                select.addEventListener('change', function changeSelect2(event){
                                    let select=event.target;
                                    if (select.selectedOptions[0].value === 'Cancelled') {
                                        let cancelReason =popup.querySelector(`[class="cancel_notes"]`).value;
                                        if (!cancelReason || cancelReason?.trim() === '') {
                                            popup.querySelector(`[class="cancel_notes"]`).style.outline = '2px solid red';
                                            popup.querySelector('select').selectedIndex=0;
                                            alert('Please give a cancel reason what will be send to the buyer email');
                                            return;
                                        }
                                        let params=(new URLSearchParams({id :select.getAttribute('order-id-no')  , cancelReason : cancelReason})).toString();
                                        select.disabled=true;
                                        fetch(window.location.origin +`/api/api_s/order/cancel?${params}`, {method :"DELETE"}).then(res => console.log(`${res.status} :${res.statusText}`));
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.cancelReason = cancelReason;
                                                    el.order_status = "Cancelled";
                                                    el.isCancelled = true;
                                                    return el;
                                                }
                                                else return el;
                                            }
                                        );
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect2);
                                        popup.querySelector('select').disabled=true;
                                        return;
                                    };

                                    if (select.selectedOptions[0].value === "In Process") {
                                        let params = (new URLSearchParams({ id: select.getAttribute('order-id-no') })).toString();
                                        fetch(window.location.origin +`/api/api_s/order/order_status/in_process?${params}`, {method :'PUT'});
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.order_status = "In Process";
                                                    return el;
                                                }
                                                else return el;
                                            }
                                        );
                                        popup.querySelector('select').disabled=true;
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect2);
                                    }
                                    if (select.selectedOptions[0].value === "In Delivery") {
                                        let params = (new URLSearchParams({ id: select.getAttribute('order-id-no') })).toString();
                                        fetch(window.location.origin +`/api/api_s/order/order_status/in_delivery?${params}`, {method :'PUT'});
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.order_status = "In Delivery";
                                                    return el;
                                                } else return el;
                                            }
                                        );
                                        popup.querySelector('select').disabled=true;
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect2)
                                    }
                                    if (select.selectedOptions[0].value === "Completed") {
                                        let params = (new URLSearchParams({ id: select.getAttribute('order-id-no') })).toString();
                                        
                                        fetch(window.location.origin +`/api/api_s/order/order_status/completed?${params}`, {method :'PUT'});
                                        
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.order_status = "Completed";
                                                    return el;
                                                } else return el;
                                            }
                                        );
                                        popup.querySelector('select').disabled=true;
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect2)
                                    }
                                });
                            }
                            if (status === "In Process") {
                                select.disabled=false;
                                changeOptionDisplay([3,4,5,6], [1,2], 3);

                                /*
                                options.inProcess.removeAttribute('style');
                                options.inDelivery.removeAttribute('style');
                                options.completed.removeAttribute('style');
                                options.cancel.removeAttribute('style');
                                popup.querySelector('select').selectedIndex= 3;
                                */
                                
                                select.addEventListener('change', function changeSelect3(event){
                                    let select=event.target;
                                    if (select.selectedOptions[0].value === "Completed") {
                                        let params = (new URLSearchParams({ id: select.getAttribute('order-id-no') })).toString();
                                        
                                        fetch(window.location.origin +`/api/api_s/order/order_status/completed?${params}`, {method :'PUT'});
                                        
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.order_status = "Completed";
                                                    return el;
                                                } else return el;
                                            }
                                        );
                                        popup.querySelector('select').disabled=true;
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect3)
                                    }
                                    if (select.selectedOptions[0].value === "In Delivery") {
                                        let params = (new URLSearchParams({ id: select.getAttribute('order-id-no') })).toString();
                                        fetch(window.location.origin +`/api/api_s/order/order_status/in_delivery?${params}`, {method :'PUT'});
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.order_status = "In Delivery";
                                                    return el;
                                                } else return el;
                                            }
                                        );
                                        popup.querySelector('select').disabled=true;
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect3)
                                    }
                                    if (select.selectedOptions[0].value === 'Cancelled') {
                                        let cancelReason =popup.querySelector(`[class="cancel_notes"]`).value;
                                        if (!cancelReason || cancelReason?.trim() === '') {
                                            popup.querySelector(`[class="cancel_notes"]`).style.outline = '2px solid red';
                                            popup.querySelector('select').selectedIndex=0;
                                            alert('Please give a cancel reason what will be send to the buyer email');
                                            return;
                                        }
                                        let params=(new URLSearchParams({id :select.getAttribute('order-id-no')  , cancelReason : cancelReason})).toString();
                                        select.disabled=true;
                                        fetch(window.location.origin +`/api/api_s/order/cancel?${params}`, {method :"DELETE"}).then(res => console.log(`${res.status} :${res.statusText}`));
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.cancelReason = cancelReason;
                                                    el.order_status = "Cancelled";
                                                    el.isCancelled = true;
                                                    return el;
                                                }
                                                else return el;
                                            }
                                        );
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect3);
                                        popup.querySelector('select').disabled=true;
                                        return;
                                    };

                                })
                            }  
                            if (status === "In Delivery") {
                                select.disabled=false;
                                changeOptionDisplay([5,6], [1,2,3,4,], 4);

                                /*
                                options.completed.removeAttribute('style');
                                options.cancel.removeAttribute('style');
                                popup.querySelector('select').selectedIndex= 4;
                                */

                                select.addEventListener('change', function changeSelect4(event){
                                    let select=event.target;
                                    if (select.selectedOptions[0].value === "Completed") {
                                        let params = (new URLSearchParams({ id: select.getAttribute('order-id-no') })).toString();
                                        
                                        fetch(window.location.origin +`/api/api_s/order/order_status/completed?${params}`, {method :'PUT'});
                                        
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.order_status = "Completed";
                                                    return el;
                                                } else return el;
                                            }
                                        );
                                        popup.querySelector('select').disabled=true;
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect4)
                                    }
                                    if (select.selectedOptions[0].value === 'Cancelled') {
                                        let cancelReason =popup.querySelector(`[class="cancel_notes"]`).value;
                                        if (!cancelReason || cancelReason?.trim() === '') {
                                            popup.querySelector(`[class="cancel_notes"]`).style.outline = '2px solid red';
                                            popup.querySelector('select').selectedIndex=0;
                                            alert('Please give a cancel reason what will be send to the buyer email');
                                            return;
                                        }
                                        let params=(new URLSearchParams({id :select.getAttribute('order-id-no')  , cancelReason : cancelReason})).toString();
                                        select.disabled=true;
                                        fetch(window.location.origin +`/api/api_s/order/cancel?${params}`, {method :"DELETE"}).then(res => console.log(`${res.status} :${res.statusText}`));
                                        OrderData = OrderData.map(
                                            function (el) {
                                                if (el.id == popup.querySelector('select').getAttribute('order-id-no')) {
                                                    el.cancelReason = cancelReason;
                                                    el.order_status = "Cancelled";
                                                    el.isCancelled = true;
                                                    return el;
                                                }
                                                else return el;
                                            }
                                        );
                                        popup.style.display ='none';
                                        select.removeEventListener('change', changeSelect4);
                                        popup.querySelector('select').disabled=true;
                                        return;
                                    };
                                });
                            }
                            if (status === 'Completed'){
                                select.disabled=true;
                                for (let i = 0; i < popup.querySelector('select').selectedOptions.length; i++) {
                                    popup.querySelector('select').selectedOptions[0].style.display='none';
                                }
                                options.completed.removeAttribute('style');
                                popup.querySelector('select').selectedIndex=2;
                            }
                            if (status === 'Cancelled'){
                                select.disabled=true;
                                for (let i = 0; i < popup.querySelector('select').selectedOptions.length; i++) {
                                    popup.querySelector('select').selectedOptions[0].style.display='none';
                                }
                                options.cancel.removeAttribute('style');
                                popup.querySelector('select').selectedIndex=5;
                            }
                        }


                        setupSelect(order_status)
                       

                        let popupquantity = 0;
                        // popup.querySelector('table').childNodes.forEach(function(el,ind) {
                        //     alert(ind);
                        //     if (ind === 0) return;
                        //     el.remove();
                        // });
                       
                        // let childrenLength =.children.length;

                        // for (let i = 0; i < childrenLength; i++) {
                        //     popup.querySelector('table').children[i]?.tagName === 'TR' && popup.querySelector('table').children[1].remove();  
                        // }

                        let tbody=popup.querySelector('table').querySelector('tbody');
                        popup.querySelector('table').querySelector('tbody').remove();
                        
                        popup.querySelector('table').innerHTML=null;
                        popup.querySelector('table').appendChild(tbody);

                        for (let i = 0; i < shiping_items.length; i++) {
                            let {
                                name,
                                quantity,
                                price,
                                size,
                                total,
                                _id,
                                id,
                                url,
                                thumb
                            } = shiping_items[i];
                            let tr = document.createElement('tr');
                            tr.innerHTML =( `
                                <td><span>${i + 1 < 10 ? '0' + (i + 1) : i + 1}</span></td>
                                <td> <img src="${thumb}"></td>
                                <td><span>  ${name}</span> </td>
                                <td><span> ${quantity}</span></td>
                                <td><span> ${size}</span></td>
                                <td><span> ${price}.00$</span></td>
                                `);
                            popup.querySelector('table').appendChild(tr)
                            popupquantity += shiping_items[i].quantity;
                        }
                        sipv(`[placeholder="quantity"]`, popupquantity)
                    })


                }

            })



    })


    observer.observe(orders)



    function MakePriceString(number) {
        if (Number(number).toString().toLocaleLowerCase === 'nan') {
            log({ number });
            throw 'error ,number is a nan'
        }
        let string = number.toString();
        let DotIndex = string.indexOf('.')

        if (DotIndex === -1) return string + '.00';
        let length = string.length;
        let lastLength = length - 1 - DotIndex;
        if (lastLength === 1) return string + '0';
        if (lastLength === 2) return string + '';
        if (lastLength > 2) {
            //    for (let i = DotIndex+2; i < string.length; i++) {
            //     log({i,string})
            //     string=string.slice(0,string.length-1) ;
            //     length = string.length ;
            //    } 

            string = string.slice(0, DotIndex + 4);
            let lastEl = string[string.length - 1];
            log({ lastEl })
            if (Number(lastEl) > 5) {
                string = string.slice(0, DotIndex + 3);
                lastEl = string.at(string.length - 1);
                string = string.slice(0, DotIndex + 2)
                return string + (Number(lastEl) + 1)
            }
            if (Number(lastEl) <= 5) {
                string = string.slice(1, DotIndex + 3)
                return string;
            }
        }


    }

    function sipv(selector, value) { /*set input value*/popup.querySelector(selector).setAttribute('value', value) }
    function v(selector) {
        let el = popup.querySelector(selector);
        if (!el) throw 'selector has no value //selector :' + selector;
        let value = el.value;
        if (!value) {
            el.style.border = '2px solid red';
            el.setAttribute('it is emty')
            throw 'value can not be null'
        } else return value
    }


}