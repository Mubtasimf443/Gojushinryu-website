/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let ThumbUrl;
    let ImageUrlArrays =[];
    let sellingCountry ='both';
    let sellingStyle ='per_price';
    let  uploadProductConatiner = document.querySelector('#upload-Product-conatiner');
    let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    let price_style_select =uploadProductConatiner.querySelector('[price_style_select]')
    let prosizeUploadContainern =uploadProductConatiner.querySelector('[prosizeUploadContainern]')
    let prosizeUploader =uploadProductConatiner.querySelector('[prosizeUploader]');
    
    // let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    // let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    // let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    // let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    // let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    // let CountrySelect_select =uploadProductConatiner.querySelector('[CountrySelect_select]')
    // document.addEventListener('selectionchange')
     
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
            uploadProductConatiner.children[11].style.display='none';
            
            
         } 
    });
    console.log(
        uploadProductConatiner.children[10],
        uploadProductConatiner.children[11]

        );

    prosizeUploader.addEventListener('click',e => document.getElementById('edit_product_size_popup').style.display='flex')


    uploadProductConatiner.addEventListener('click' ,(e) =>{
        if (e.target.className === 'fa-solid fa-pen') {
            let parent =e.target.parentNode.parentNode ;
            let id =parent.id ;
            alert(parent.id)
            let popupForm= document.querySelector('#edit_product_size_popup_for_updating');
            let inputs=popupForm.querySelectorAll('input');
            inputs[0].value= parent.querySelector('b').innerHTML;
            inputs[1].value= parent.children[1].children[1].innerText;
            inputs[2].value= parent.children[2].children[1].innerText;
            popupForm.querySelector('button')
            .addEventListener('click' , function func(e) {
            try {
                parent = document.querySelector(`[id="${id}"`) ;
                parent.querySelector('b').innerHTML=inputs[0].value;
                parent.querySelectorAll('.p-box')[0].children[1].innerHTML =inputs[1].value ;
                parent.querySelectorAll('.p-box')[1].children[1].innerHTML =inputs[2].value ;
                inputs[0].value='';
                inputs[1].value='';
                inputs[2].value=''; 
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
        let INR =inputs[2].valueAsNumber;

        prosizeUploader.remove();
        let div =document.createElement('div');
        div.innerHTML = ` 
         <b>${ title}</b>
        <span class="p-box"> 
      <span>  USD  </span>
     <span> ${ USD } </span>
        </span>
        <span class="p-box">
      <span>  INR </span>
        <span>  ${INR} </span>
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
        inputs[2].value='';
        document.getElementById('edit_product_size_popup').style.display='none';
    })
    



    //trash
    // CountrySelect_select.addEventListener('change',
    //     e => {
    //       sellingCountry= e.target.selectedOptions[0].value
    //       if (sellingCountry === 'both') {
    //         uploadProductConatiner.children[11].style.display ='flex';
    //         uploadProductConatiner.children[10].style.display ='flex';
    //      }   
    //      if (sellingCountry === 'canada') {
    //         uploadProductConatiner.children[11].style.display ='flex';
    //         uploadProductConatiner.children[10].style.display ='none';
    //      }  
    //      if (sellingCountry === 'india') {
    //         uploadProductConatiner.children[11].style.display ='none';
    //         uploadProductConatiner.children[10].style.display ='flex';
    //      }   
         

    //     }) ;
}
