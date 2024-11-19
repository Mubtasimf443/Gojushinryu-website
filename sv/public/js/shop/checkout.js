/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */


{//---------------------scope---------------------


let totalProductAmount =0;
let totalshipping =0;
let totalCost =0;
let checkoutApiArray=[];
let Subtotal=document.querySelector('.Subtotal');
let orderSummary=document.querySelector('.order-summary');
let items=document.querySelector('.items');
let total=document.querySelector('.total');
let shipping=document.querySelector('.shipping');
let paypal_payment=document.querySelector(".paypal-payment")
let visa_payment=document.querySelector(".visa-payment")
let incheckOut=false;


window.addEventListener('load',async e => {
    
    if (!addedProduct.length) // If There is no product return back to shop page
        {
        orderSummary.innerHTML=`
        <div class="item">
        <h2 style="color:red">There is No Product</h2>
        </div>
        `;
        setTimeout(() => {
            window.location.replace('/shop')
        }, 2000);
        return
    } 


    let checkSpam=false; 
    for (let i = 0; i < addedProduct.length; i++) {
        let {id,prod,quantity,df_price,df_size} = addedProduct[i];
        if (!id)                       checkSpam=true;
        if (typeof prod !== 'object')  checkSpam=true;
        if (!quantity)                 checkSpam=true;
        if (!df_price)                 checkSpam=true;
        if (!df_size)                  checkSpam=true;
    }


    if (checkSpam) {
        addToStorage([]);
        window.location.reload();
        return;
    } //Spaming is proved
   
    addedProduct.forEach(element => {
        let {prod , id,df_price,quantity,df_size}=element;
        items.innerHTML=items.innerHTML+
        `
        <div class="item">
        <img src="${prod.thumb}" alt="Product Image">
        <p>${prod.name}</p>
        <span>$${df_price*quantity}.00</span>
        </div>
        `;
        totalProductAmount+=df_price*quantity;
        totalshipping=
        
        (function ({prod,totalshipping}) {
            if (prod.selling_style!=='per_price' && prod.selling_style!=='per_size') {
                setTimeout(() => {
                    addToStorage([]);
                    window.location.reload()
                }, 13000);
                throw new Error("You Have a very Big change at product model -- checkout.js");
                //if another freelancer comes and made change
            }
            return Number(prod.delivery_charge_in_canada )+totalshipping;
        })({prod,totalshipping})


            checkoutApiArray.push((function(id,size,quantity) {
            if (Number(id).toString()==='NaN') throw new Error('not valid id')
            if (Number(quantity).toString()==='NaN') throw new Error('not valid quantity')
            if (typeof size !== 'string') throw new Error('not valid string')
            return {
            id,
            size,
            quantity
            }
        })(id,df_size,quantity))
    });
    Subtotal.innerHTML=totalProductAmount;
    shipping.innerHTML=totalshipping;
    totalCost=totalProductAmount+totalshipping;;
    total.innerHTML=totalCost;
})


paypal_payment.addEventListener('click',e =>uploadToApi({method:'paypal'}))
visa_payment.addEventListener('click',e =>uploadToApi({method:'visa'}))


//function
function v(htmlElementSelector) {
    let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
    let el=document.querySelector(htmlElementSelector);
    if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
    let value=el.value;
    if (!value) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    if (value.includes('<')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    if (value.includes('>')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    if (value.includes("'")) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    if (value.includes('"')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    if (value.includes('`')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }if (value.includes('{')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }if (value.includes('}')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    if (value.includes('[')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }if (value.includes(']')) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    return value
}



async function uploadToApi({method}) {
    try {
        if (incheckOut) return
        let first_name = v('[placeholder="First Name"]');
        let last_name = v('[placeholder="Last Name"]');
        let district = v('[placeholder="District"]') ;
        let city = v('[placeholder="City"]');
        let postcode = v('[placeholder="Zip Code"]');
        let phone = v('[placeholder="Phone Number"]');
        let notes= v('[placeholder="Notes"]');
        let email =  v('[placeholder="Reciever Email"]');
        let street = v(`[placeholder="Road No / Village / Street"]`);
        
        let jsonObject=  {
            first_name,
            last_name,
            phone,
            email,
            country :document.getElementById(`countrySelect`).selectedOptions[0].value,
            city,
            district,
            street,
            postcode,
            notes,
            items:checkoutApiArray,
        };
        jsonObject=JSON.stringify(jsonObject);

        let url = window.location.origin + '/api/l-api/'+ ( method ==='paypal' ? 'paypal-checkout':'stripe-checkout'  );
        // log(jsonObject)
        if (method!=='paypal' && method!=='visa') throw new Error('Payment method is not correct ');

        if (method==='paypal') {
            paypal_payment.style.transition='all .5s ease';
            paypal_payment.style.opacity=.6;
        }
    
        if (method !=='paypal') {
            visa_payment.style.transition='all .5s ease';
            visa_payment.style.opacity=.6;
        }
    
        incheckOut =true;

        await fetch(url, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:jsonObject
        })
        .then(e => e.json())
        .then( data => {
            log(data)
            if (data.error) return console.error(data.error);
            if (data.link) window.location.assign(data.link)
        })
        .catch(e => { 
            alert('error! please try again ')
            localStorage.removeItem(`add-to-cart-products`);
            setTimeout(() => window.location.reload(), 1500)
        })
        .finally(e => {
            paypal_payment.style.opacity=1;
            visa_payment.style.opacity=1;
            incheckOut =false;
        })
    } catch (error) {
        console.log({error});
        
        alert({error});
    }
}

document.getElementById(`countrySelect`).onchange=function (event) {
    let country=document.getElementById(`countrySelect`).selectedOptions[0].value;
    if (country!=='canada' && country !=='india') {
        setTimeout(() => window.location.assign('/shop'), 2000);
        return alert('error , country should be canada or india')
    }
    (function changeShipping(country) {
        let newShipping =0;
        for (let i = 0; i < checkoutApiArray.length; i++) {
            let product=addedProduct.find(el => {
                if (el.id=== checkoutApiArray[i].id) return el
            });
            if (!product) {
                setTimeout(() => window.location.assign('/shop'), 2000);
                alert('error! please contact developer , because of unnormal change of checkout algorithm')
                return;
            }
            newShipping+= country === "canada" ? product.prod.delivery_charge_in_canada : product.prod.delivery_charge_in_india;
            totalshipping=newShipping;
            shipping.innerHTML=totalshipping;
        }
    })(country)
    
    
}






}