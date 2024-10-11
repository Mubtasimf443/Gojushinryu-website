
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let container=document.querySelector(`[class="order-list-box"]`);
    let orders=container.querySelector('table')
    let seen =false ;
    let popup=document.querySelector('#popup_order_action')
    let OrderData=[];
    var fetchTimeOut;
    let observer =new IntersectionObserver(entries => {
        if (seen) return
        seen =true;
        fetch(window.location.origin + '/api/api_s/find-order')
        .then(e => e.json() )
        .then(async data=> {
            console.log(data);
            array=data.data;
            if (!array) return 
            OrderData=array;
            for (let i = 0; i < array.length; i++) {
                let {date,shiping_items ,reciever,total,order_status}= array[i];
                total =await MakePriceString(Number(total))
                let div =document.createElement('tr');
                div.className='order';
                div.innerHTML=
                `
                <td>
                ${i+1}
                </td>
                <td>
                ${reciever.name} 
                </td>
                <td>
                ${date}
                </td>
                <td>
              ${total}$
                </td> 
                <td>
                ${order_status}
                </td>
                <td>
                <button order_index="${i}" >
                View
                </button>
                </td>
                `


                orders.appendChild(div)


                div.querySelector('button').addEventListener('click',async e => {
                    let index= e.target.getAttribute('order_index');
                    let {
                        reciever,
                        id,
                        reciever_notes,
                        shiping_items,
                        total,
                        shipping_cost,
                        total_product_price,
                        _id

                    } =OrderData[Number(index)];
                    popup.style.display='flex';

                    
                    //set popup value
                    sipv(`[placeholder="Reciever Name"]`,reciever.name)
                    sipv(`[placeholder="R. Number"]`,reciever.phone)
                    sipv(`[placeholder="Buyer Email"]`,reciever.name)
                    sipv(`[placeholder="country"]`,reciever.country)
                    sipv(`[placeholder="district"]`,reciever.district)
                    sipv(`[placeholder="city"]`,reciever.city)
                    sipv(`[placeholder="street"]`,reciever.street)
                    //sipv(`[placeholder="notes"]`,notes)
                    sipv(`[placeholder="postcode"]`,reciever.postcode)
                    sipv(`[placeholder="Order Id"]`,id)
                    sipv(`[placeholder="Product Value"]`,total_product_price)
                    sipv(`[placeholder="total shipping"]`,shipping_cost)
                    sipv(`[placeholder="total"]`,total)
                    popup.querySelector('[placeholder="notes"]').value=reciever_notes;
                    popup.querySelector('select').setAttribute('order-id',_id)


                    function setStatus(s,b,id) {
                        let select=popup.querySelector('select')
                        if (s ==='pending') select.selectedIndex=0
                        if (s ==='processing') select.selectedIndex=1
                        if (s ==='completed') select.selectedIndex=2
                        if (s==='cancelled') select.selectedIndex=3;
                        if (b) {
                            clearTimeout(fetchTimeOut);
                            fetchTimeOut = setTimeout(() => {
                                fetch(window.location.origin +'/api/api_s/update-order-status',{
                                    method:'PUT',
                                    headers:{
                                        'Content-Type':'application/json'
                                    },
                                    body:JSON.stringify({
                                        id :id,
                                        c_reason:(s !=='cancelled') ? '' : v('.cancel_notes') ,
                                        status:select.selectedOptions[0].value
                                    })
                                })
                            }, 1500);
                        }
                    }


                    let popupquantity=0;
                    for (let i = 0; i < shiping_items.length; i++) {
                        let {
                            item_name,
                            quantity,
                            per_price,
                            size,
                            shipping,
                            total_price,
                            _id,
                            status,
                        }=shiping_items[i];
                    
                        let image =await fetch(window.location.origin+ `/api/fast-api/find-product-image?id=${_id}` )
                        image =await image.text();
                        let tr =document.createElement('tr');
                        tr.innerHTML=                    `
                        <td>
                        <span> 
                        ${i+1}
                        </span>
                        </td>
                        <td><img src="${image}"></td>
                        <td><span>  ${item_name}</span> </td>
                        <td><span> ${quantity}</span></td>
                        <td><span> ${size}</span></td>
                        <td><span> ${per_price}.00$</span></td>
                        `
                        popup.querySelector('table').appendChild(tr)
                        popupquantity += shiping_items[i].quantity;


                       setStatus(status,false,_id)
                    }
                    sipv(`[placeholder="quantity"]`,popupquantity)

                    


                    popup.querySelector('select').addEventListener('change', e=> setStatus( 
                        e.target.selectedOptions[0].value ,
                        true,
                        e.target.getAttribute('order-id')
                    ))
                })


            }
            
        })



    })


observer.observe(orders)



 async function MakePriceString(number) {
    if (Number(number).toString().toLocaleLowerCase==='nan') {
        log({number});
        throw 'error ,number is a nan'
    }
    let string= number.toString();
    let DotIndex= string.indexOf('.')

    if (DotIndex===-1) return string +'.00';
    let length = string.length ;
    let lastLength= length-1 -DotIndex;
    if (lastLength ===1) return string  + '0';
    if (lastLength ===2) return string  + '';
    if (lastLength > 2) {
    //    for (let i = DotIndex+2; i < string.length; i++) {
    //     log({i,string})
    //     string=string.slice(0,string.length-1) ;
    //     length = string.length ;
    //    } 

       string=await string.slice(0,DotIndex+4) ;
       let lastEl= string[string.length-1];
       log({lastEl})
       if (Number(lastEl )>5) {
        string= string.slice(0,DotIndex +3);
         lastEl= string.at(string.length-1);
        string= string.slice(0,DotIndex +2)
        return string+(Number(lastEl) +1)
       }
       if (Number(lastEl )<=5) {
        string= string.slice(1,DotIndex +3)
        return string;
       }
    }


}





function sipv(selector,value) { //set input value
    popup.querySelector(selector).setAttribute('value',value)
}


function v(selector){
    let el =  popup.querySelector(selector);
    
    if (!el) throw 'selector has no value //selector :' +selector
    let value =el.value;
    if (!value) {
        el.style.border='2px solid red';
        el.setAttribute('it is emty')
        throw 'value can not be null'
    }
    return value
}


}