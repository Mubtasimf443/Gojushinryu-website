/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let ThumbUrl ='';
    let productImageUrlArrays =[];
    let sellingCountry ='both';
    let sellingStyle ='per_price';
    let uploadingStatus=false;
    let uploadProductConatiner = document.querySelector('#upload-Product-conatiner');
    let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    let price_style_select =uploadProductConatiner.querySelector('[price_style_select]')
    let prosizeUploadContainern =uploadProductConatiner.querySelector('[prosizeUploadContainern]')
    let prosizeUploader =uploadProductConatiner.querySelector('[prosizeUploader]');
    let productThumbInput =uploadProductConatiner.querySelector('#upload_sec_event_tumb_img_inp_for_uploading_the_products')
    let productImageUploadInput  =uploadProductConatiner.querySelector('[id="upload_sec_product_image_inp_for_uploading_the_products"]')
    let uploadTheProductBtn =uploadProductConatiner.querySelector('[uploadTheProductBtn]') ;
    let inp_for_product_name =uploadProductConatiner.querySelector('[inp_for_product_name]')
    let inp_for_product_des =uploadProductConatiner.querySelector('[inp_for_product_des]')
    let inp_for_product_cetegory_select =uploadProductConatiner.querySelector('[inp_for_product_cetegory_select]')
    let inp_for_product_amount =uploadProductConatiner.querySelector('[inp_for_product_amount]')
    let price_pp/*Per price */ =uploadProductConatiner.querySelector('[inp_for_product_price_canada]')
    let inp_for_product_delivary_india =uploadProductConatiner.querySelector('[inp_for_product_delivary_india]')
    let inp_for_product_delivary_canada =uploadProductConatiner.querySelector('[inp_for_product_delivary_canada]')
    // let inp_for_product_des =uploadProductConatiner.querySelector('[inp_for_product_des]')

    /*****************************  image upload **********************************/
  
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
   
    return value
}


    //thumb
    productThumbInput.addEventListener('change',e => {
        if (
            e.target.files[0].type !== 'image/png' 
            && e.target.files[0].type !== 'image/jpg' 
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');
        try {
        let thumbInputLabel =uploadProductConatiner.querySelector(`[for="${productThumbInput.id}"]`);
        thumbInputLabel.style.backgroundImage='url("'+ window.location.origin +'/img/gif.gif' +'")';
        thumbInputLabel.style.backgroundSize = '200px';
        thumbInputLabel.style.backgroundPosition = 'center center';
        thumbInputLabel.style.backgroundRepeat = 'no-repeat';
        thumbInputLabel.style.height ='250px';

        let form =new FormData()
        form.append('img', e.target.files[0])
        fetch(window.location.origin +'/api/api_s/upload-image-for-25-minutes',{
            method :'POST',
            body :form
          })
          .then(data => data.json()
          .then(({success ,error,link})=> {
            if (error) { 
                thumbInputLabel.innerHTML ='<b>Try Again</b>';
                thumbInputLabel.style.backgroundImage='url("'+ window.location.origin +'/img/error1.png' +'")';
                return alert(error);
            }
            if (success) {
            thumbInputLabel.style.backgroundImage='url("'+link+'")';
            thumbInputLabel.style.backgroundSize = 'contain';
            thumbInputLabel.style.backgroundPosition = 'center center';
            thumbInputLabel.style.backgroundRepeat = 'no-repeat';
            thumbInputLabel.innerHTML ='<b>Change The image</b>';
            ThumbUrl=link;
            console.log('ThumbUrl',ThumbUrl);
            
            setTimeout(() => {
                window.location.reload();
            }, 2600000);
            }
          })
          .catch(e =>{console.log(e);
            thumbInputLabel.style.backgroundImage='url("'+ window.location.origin +'/img/error1.png' +'")';
          }))
          .catch(e => {
            thumbInputLabel.style.backgroundImage='url("'+ window.location.origin +'/img/error1.png' +'")';

        })

        } catch (error) {
            console.log(error);
            
        }
        
    })


   //images
    productImageUploadInput.addEventListener('change', (e) => {
        if (
            e.target.files[0].type !== 'image/png' 
            && e.target.files[0].type !== 'image/jpg' 
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');
        let imageContainer =document.querySelector('#product_upload_container_product_images_contaioner');
        let label =productImageUploadInput.parentElement;
        let insertElement= document.createElement('label')
       // label.remove();
        let id =Date.now()
        insertElement.id=id;
        insertElement.style.backgroundImage='url("'+ window.location.origin +'/img/gif.gif' +'")';
        insertElement.style.backgroundSize = 'contain';
        insertElement.style.backgroundPosition = 'center center';
        insertElement.style.backgroundRepeat = 'no-repeat';
        imageContainer.appendChild(insertElement);
        let form =new FormData();
        form.append('img', e.target.files[0] );
        let fetchOptions ={
            method :'POST',
            body :form
        };
        fetch(window.location.origin +'/api/api_s/upload-image-for-25-minutes',fetchOptions)
        .then(res => res.json())
        .then(({error,success,link}) => {
            let insertedElement  =document.querySelector(`[id="${id}"]`);
            if (error) {
            insertedElement.style.backgroundImage='url("'+ window.location.origin +'/img/error1.png' +'")';
            alert(error);
            setTimeout(() => {
                insertElement.remove();
            }, 3000);
            }
            if (success) {
                insertedElement.style.backgroundImage='url("'+ link +'")';
                productImageUrlArrays.push(link);
                console.log('productImageUrlArrays',productImageUrlArrays);
                setTimeout(() => {
                    window.location.reload();
                }, 2600000);
            }
        })
        .catch(e => console.log(e))
    });


    //price stayle change events
    price_style_select.addEventListener('change', (e) => {

        sellingStyle= e.target.selectedOptions[0].value ;
        if (sellingStyle === 'per_price') {
            uploadProductConatiner.children[6].style.display ='flex';
            uploadProductConatiner.children[7].style.display ='none';
            uploadProductConatiner.children[8].style.display ='none';
            uploadProductConatiner.children[10].style.display='flex';
            uploadProductConatiner.children[11].style.display='flex';

         } 
         if (sellingStyle === 'per_size') {
            uploadProductConatiner.children[6].style.display ='none';
            uploadProductConatiner.children[7].style.display ='flex';
            uploadProductConatiner.children[8].style.display ='flex';
            uploadProductConatiner.children[10].style.display='none';
            // uploadProductConatiner.children[11].style.display='none';
            
            
         } 
    });
    

    //product size uploader event
    prosizeUploader.addEventListener('click',e => document.getElementById('edit_product_size_popup').style.display='flex')


    //uplaod product event listener
    uploadProductConatiner.addEventListener('click' ,(e) =>{
        if (e.target.className === 'fa-solid fa-pen') {
            let parent =e.target.parentNode.parentNode ;
            let id =parent.id ;
            alert(parent.id)
            let popupForm= document.querySelector('#edit_product_size_popup_for_updating');
            let inputs=popupForm.querySelectorAll('input');
            inputs[0].value= parent.querySelector('b').innerHTML;
            inputs[1].value= parent.children[1].children[1].innerText;
            popupForm.querySelector('button')
            .addEventListener('click' , function func(e) {
            try {
                parent = document.querySelector(`[id="${id}"`) ;
                parent.querySelector('b').innerHTML=inputs[0].value;
                parent.querySelectorAll('.p-box')[0].children[1].innerHTML =inputs[1].value ;
                inputs[0].value='';
                inputs[1].value='';
                popupForm.style.display='none';
                popupForm.querySelector('button').removeEventListener('click' ,func)
            } catch (error) {
                console.log(error);
                
            }
            
            })
            popupForm.style.display='flex'
        }
    }) 
        
    //product size edit Popup
    document.querySelector('#edit_product_size_popup')
    .querySelector('.popup-save-btn')
    .addEventListener('click', e => {
        let inputs= document.querySelector('#edit_product_size_popup').querySelectorAll('input');
        let title =inputs[0].value;
        let USD =inputs[1].valueAsNumber;
        prosizeUploader.remove();
        let div =document.createElement('div');
        div.setAttribute('product_size_el_container_box' ,'')
        div.innerHTML = ` 
         <b>${ title}</b>
        <span class="p-box"> 
      <span>  Price  </span>
     <span> ${ USD } </span>
        </span>
       
        <div class="btn-box">
        <i class="fa-solid fa-trash"></i>
        <i class="fa-solid fa-pen"></i>
        </div>
        ` ;
        div.id =Date.now();
        prosizeUploadContainern.appendChild(div);
        prosizeUploadContainern.appendChild(prosizeUploader) ;
        div.querySelector('[class="fa-solid fa-trash"]').addEventListener('click',e => div.remove())
     
        inputs[0].value='';
        inputs[1].value='';
        document.getElementById('edit_product_size_popup').style.display='none';
    })
    
    uploadTheProductBtn.addEventListener('click', async e => {
        let err;
        if (uploadingStatus) return alert('Product is already uploading  ,Please Wait Until upload finish');
        let name = inp_for_product_name.value;
        let description = inp_for_product_des.value;
        let cetegory = inp_for_product_cetegory_select.selectedOptions[0].value;
        let delivery_charge_in_india = inp_for_product_delivary_india.valueAsNumber;
        let delivery_charge_in_canada = inp_for_product_delivary_canada.valueAsNumber;
        let selling_style = sellingStyle;
        let size_pp = selling_style ==='per_price' ? v('[size_pp]') : '';
        let price =selling_style==='per_price'? v('[price_pp]'):'';
        let selling_country = CountrySelect_select.selectedOptions[0].value;
        let thumb =ThumbUrl;
        let images =productImageUrlArrays;
        let size_and_price =[];
        let testingArray= [
        name,
        description,
        cetegory,
        delivery_charge_in_india,
        delivery_charge_in_canada, 
        selling_country,
        selling_style,
       //  thumb,
      //  images.length
       ];
       let arrayTestStatus = await testingArray.findIndex(el => !el) ;
       if (arrayTestStatus !== -1) return alert('please check all the form');
       if (sellingStyle === 'per_price') {
        if (!size_pp) return alert('please enter the price in india')
        if (!price) return alert('In per price algorithm ,You have to write the amount of produuct')
       }

       if (sellingStyle === 'per_size') {
        try {
        await  uploadProductConatiner.querySelectorAll(`[product_size_el_container_box]`)
        .forEach(el => {
         let size= el.children[0].innerText;
         let price=el.children[1].children[1].innerText;
         if (!size) throw 'Size Do not have a title';
         if (!price) throw 'Size Do not have a Price ';
         size_and_price.push({
            size,
            price:price,
         })
        });
        if (!size_and_price.length) throw 'You have not added a size'
        } catch (error) {
            return alert(error)
        }
    }
    console.log(size_and_price);
    let jsonObject =await JSON.stringify({
        name,
        description,
        cetegory,
        thumb,
        images,
        price,
        size:size_pp,
        selling_style,
        selling_country,
        size_and_price,
        delivery_charge_in_canada,
        delivery_charge_in_india
    })
    let fetchOptions={
        method :"POST",
        headers:{
            "Content-Type":"application/json"
                },
        body:jsonObject
    }
    uploadTheProductBtn.style.opacity=.7;
    uploadingStatus =true;
    let url= window.location.origin + '/api/api_s/upload-product';
    
    fetch(url ,{
        method :"POST",
        headers:{
            "Content-Type":"application/json"
           },
        body:jsonObject
    })
    .then(res => res.json())
    .then(({error,success}) => {
        if (error) return alert(error)
        if (success) {
            uploadTheProductBtn.innerText ='Success';
            uploadTheProductBtn.style.color='#fff';
            uploadTheProductBtn.style.border='2px solid green';
            uploadTheProductBtn.style.background='green';
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    })
    .catch(e => console.log(e))
    .finally(e => {
        uploadTheProductBtn.style.opacity=1;
        uploadingStatus =false;
    })
    })













    
}
