/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
 */

{




let table =document.querySelector('table');
let TotalProductAmount=0;
let totalProductQuantity=0;
let checkoutButton=document.querySelector('.checkout-btn');

window.addEventListener('load',e=>setUpTable(e));
checkoutButton.addEventListener('click', e=>window.location.assign('/shop/checkout'))


//function 
const setUpTable= async e => {
    TotalProductAmount=0;totalProductQuantity=0;
    (e=> {
        try {
            table.querySelectorAll('.data_storer').forEach(el=> el? el.remove() :log())
            return true
        } catch (error) {
            return false
        }
    })();

    if (addedProduct.length === 0) {
       table.innerHTML=`<h2>There is no product added to cart</h2>`;
       return setTimeout(() => {
           window.location.replace('/shop')
       }, 2000);
   }
   await addedProduct.forEach((el ,index)=> {
      
       let { prod ,quantity ,id, df_size, df_price}=el;
       let {name,selling_style,thumb}=prod;
       
       TotalProductAmount += quantity * df_price;
       totalProductQuantity += quantity;
       if (TotalProductAmount.toString() === 'NaN') {
           addedProduct = addedProduct.filter((el, i) => {
               if (i !== index) return el
               return false
           });
           setTimeout(() => {
               window.location.reload();
           }, 2000);
           return
       }
       let tr = document.createElement('tr');
       tr.className='data_storer'
       tr.innerHTML=(`
          <td>${index+1}</td>
          <td> <img src="${thumb}" alt="add to cart product Image"> </td>
          <td>${name}</td>
          <td>${df_size}</td>
          <td class="row-center">
          <button prod-id="${id}" class="plus"><i class="fa-solid fa-plus"></i></button>
          &nbsp; ${quantity} &nbsp;
          <button prod-id="${id}" class="minus"><i class="fa-solid fa-minus"></i></button>
          </td>
          <td>${df_price}</td>

          <td>$${(TotalProductAmount).toFixed(2)}</td>
          `);
       table.appendChild(tr)
   });


   document.querySelector('#total-price').innerHTML=(TotalProductAmount).toFixed(2);//total Price
   document.querySelector('#total-items').innerHTML=totalProductQuantity;//total Quantity

   await document.querySelectorAll('.plus').forEach(el => {
    el.addEventListener('click', async e=> {
        let prodId=el.getAttribute('prod-id');
        addedProduct = await addedProduct.map(e => {
            let {id} =e;
            let status=prodId != id;
            log(status)
            if (status) return e
            e.quantity +=1;
            return e
        });
        addToStorage(addedProduct)

        return setUpTable()
    });
   });
   await document.querySelectorAll('.minus').forEach(el => {
    el.addEventListener('click', e=>{
        let prodId=el.getAttribute('prod-id');
        addedProduct =addedProduct.filter(e => {
            let {id} =e;
            if (prodId !=id) return e
            e.quantity-=1;
            if (!e.quantity) return false
            return e
        });
        addToStorage(addedProduct)

        return setUpTable()
    });
   })
   
}










}