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

window.addEventListener('load',async e => {
    
    if (!addedProduct.length) {
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


    let checkSpam; 
    await addedProduct.forEach(el => {
        let {id,prod,quantity,df_price,df_size} =el
        if (!id) return checkSpam=true;
        if (typeof prod !== 'object') return checkSpam=true;
        if (!quantity) return checkSpam=true;
        if (!df_price) return checkSpam=true;
        if (!df_size) return checkSpam=true;
    })
    if (checkSpam) {
        addToStorage([]);
        window.location.reload()
    }
   
    addedProduct.forEach(({prod  ,id,df_price,quantity,df_size}) => {
        items.innerHTML=items.innerHTML+`
        <div class="item">
        <img src="${prod.thumb}" alt="Product Image">
        <p>${prod.name}</p>
        <span>$${df_price*quantity}.00</span>
        </div>
        `;
        totalProductAmount+=df_price*quantity;
        totalshipping=(function ({prod,totalshipping}) {
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
    let first_name =await v('[placeholder="First Name"]');
    let last_name =await v('[placeholder="Last Name"]');
    let country =await document.getElementById('countrySelect').selectedOptions[0].value;
    let district =await v('[placeholder="District"]') ;
    let city =await v('[placeholder="City"]');
    let postcode =await v('[placeholder="Zip Code"]');
    let phone =await v('[placeholder="Phone Number"]');
    let notes=await v('[placeholder="Notes"]');
    let jsonObject= await JSON.stringify({
        first_name,
        last_name,
        phone,
        country,
        city,
        district,
        postcode,
        notes,
        items:checkoutApiArray,
    });
    // log(jsonObject)
    if (method!=='paypal'&&method!=='visa')  throw new Error('Error ');
    fetch(window.location.origin +'/api/l-api/paypal-checkout', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:jsonObject
    })
    .then(e => e.json())
    .then(({link,error}) => {
        if (error) return alert(error);
        if (link) window.location.assign(link)
    })
    .catch(e =>log(e) )

}









}