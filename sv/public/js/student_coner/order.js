/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/



{
    let containar = document.querySelector('.gm-order-box');
    let orders = containar.querySelector('.orders');
    console.log(orders);

    let seen = false;


    let observer = new IntersectionObserver(async entries => {
        if (seen) return
        if (!entries[0].isIntersecting) return
        try {
            seen = true;
            let res = await fetch(window.location.origin + '/api/api_s/get_user_orders');
            console.log({ status: res.status });

            if (res.status === 204) {
                orders.innerHTML = orders.innerHTML + `
                <h3>
                You have not purchase any thing
                </h3>
                `;
                return
            }

            res = await res.json();
            let data = res.data;

            for (let i = 0; i < data.length; i++) {
                let {total,status, quantity,thumb } = data[i];
                
                let div = document.createElement('div');
                div.className = 'order';

                total = MakePriceString(Number(total));

                div.innerHTML =`
                <div class="order-no">${i < 9 ? '0' + (i + 1) : (i + 1)}</div>
                   <img src="${thumb}" alt="ordered product" class="order-image" >
                   <div class="order-quantity">${quantity}</div>
                   <div class="order-price">$${total}</div>
                   <div   ${status} class="order-status">
                   ${status}
                </div>`;

                orders.appendChild(div)
            }

        } catch (error) {
            console.error({ error });

        } finally {

        }


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






























}