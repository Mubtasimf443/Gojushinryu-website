/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/



{
    let containar=document.querySelector('.gm-order-box');
    let orders=containar.querySelector('.orders');
    console.log(orders);
    
    let seen =false;


    let observer=new IntersectionObserver(async entries=> {
        if (seen) return
        if(!entries[0].isIntersecting) return
        try {
            seen =true;
            let res=await fetch(window.location.origin + '/api/api_s/get_user_orders');
            console.log({status :res.status});
            
            if (res.status===304){
                 orders.innerHTML=orders.innerHTML+`
                <h3>
                You have not purchase any thing
                </h3>
                `;
                return
            }

            res=await res.json();
            if (!res) return
            let {data} =res;
            console.log({res});
            
            for (let i = 0; i < data.length; i++) {
                let {shiping_items,total,order_status} = data[i];
                let div=document.createElement('div');
                div.className='order';
                let quantity=0;
                total =await MakePriceString(Number(total))
                for (let i = 0; i < shiping_items.length; i++) {
                    quantity += shiping_items[i].quantity;
                }

                let thumb =await fetch(window.location.origin+'/api/fast-api/find-product-image?id='+shiping_items[Math.floor(Math.random()*shiping_items.length)]._id)
                thumb =await thumb.text();

                div.innerHTML=
                `
                <div class="order-no">${i<9?'0'+(i+1):(i+1)}</div>
                <img src="${thumb}" alt="ordered product" class="order-image" >
                <div class="order-quantity">${quantity}</div>
                <div class="order-price">$${total}</div>
                <div ${
                    (() => {
                        if (order_status==='pending') return 'pending'
                        if (order_status==='processing') return 'ondelivery'
                        if (order_status==='completed') return 'completed'
                        if (order_status==='cancelled') return 'cancelled'
                    })()
                } class="order-status">
                ${order_status}
                </div>
                `
                orders.appendChild(div)
            }

        } catch (error) {
            console.error({error});
            
        } finally {

        }

        
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
    





























}