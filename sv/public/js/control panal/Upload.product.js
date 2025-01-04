/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let ThumbUrl = '';
    let productImageUrlArrays = [];
    let uploadingStatus = false;
    let uploadProductConatiner = document.querySelector('#upload-Product-conatiner');
    let productThumbInput = uploadProductConatiner.querySelector('#upload_sec_event_tumb_img_inp_for_uploading_the_products')
    let productImageUploadInput = uploadProductConatiner.querySelector('[id="upload_sec_product_image_inp_for_uploading_the_products"]')
    let uploadTheProductBtn = uploadProductConatiner.querySelector('[uploadTheProductBtn]');
    let inp_for_product_name = uploadProductConatiner.querySelector('[inp_for_product_name]')
    let inp_for_product_des = uploadProductConatiner.querySelector('[inp_for_product_des]')
    let inp_for_product_cetegory_select = uploadProductConatiner.querySelector('[inp_for_product_cetegory_select]')
    let sizeAndPrice=[];
    /*****************************  image upload **********************************/

    //function 

    function v(htmlElementSelector) {
        let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
        let el = uploadProductConatiner.querySelector(htmlElementSelector);
        if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
        let value = el.value;
        if (!value) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        return value
    }


    //thumb
    productThumbInput.addEventListener('change', e => {
        if (
            e.target.files[0].type !== 'image/png'
            && e.target.files[0].type !== 'image/jpg'
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');
        try {
            let thumbInputLabel = uploadProductConatiner.querySelector(`[for="${productThumbInput.id}"]`);
            thumbInputLabel.style.backgroundImage = 'url("' + window.location.origin + '/img/gif.gif' + '")';
            thumbInputLabel.style.backgroundSize = '200px';
            thumbInputLabel.style.backgroundPosition = 'center center';
            thumbInputLabel.style.backgroundRepeat = 'no-repeat';
            thumbInputLabel.style.height = '250px';

            let form = new FormData()
            form.append('img', e.target.files[0])
            fetch(window.location.origin + '/api/api_s/upload-image-for-25-minutes', {
                method: 'POST',
                body: form
            })
                .then(data => data.json()
                    .then(({ success, error, link }) => {
                        if (error) {
                            thumbInputLabel.innerHTML = '<b>Try Again</b>';
                            thumbInputLabel.style.backgroundImage = 'url("' + window.location.origin + '/img/error1.png' + '")';
                            return alert(error);
                        }
                        if (success) {
                            thumbInputLabel.style.backgroundImage = 'url("' + link + '")';
                            thumbInputLabel.style.backgroundSize = 'contain';
                            thumbInputLabel.style.backgroundPosition = 'center center';
                            thumbInputLabel.style.backgroundRepeat = 'no-repeat';
                            thumbInputLabel.innerHTML = '<b>Change The image</b>';
                            ThumbUrl = link;
                            console.log('ThumbUrl', ThumbUrl);

                            setTimeout(() => {
                                window.location.reload();
                            }, 2600000);
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        thumbInputLabel.style.backgroundImage = 'url("' + window.location.origin + '/img/error1.png' + '")';
                    }))
                .catch(e => {
                    thumbInputLabel.style.backgroundImage = 'url("' + window.location.origin + '/img/error1.png' + '")';

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
        let imageContainer = document.querySelector('#product_upload_container_product_images_contaioner');
        let label = productImageUploadInput.parentElement;
        let insertElement = document.createElement('label')
        // label.remove();
        let id = Date.now()
        insertElement.id = id;
        insertElement.style.backgroundImage = 'url("' + window.location.origin + '/img/gif.gif' + '")';
        insertElement.style.backgroundSize = 'contain';
        insertElement.style.backgroundPosition = 'center center';
        insertElement.style.backgroundRepeat = 'no-repeat';
        imageContainer.appendChild(insertElement);
        let form = new FormData();
        form.append('img', e.target.files[0]);
        let fetchOptions = {
            method: 'POST',
            body: form
        };
        fetch(window.location.origin + '/api/api_s/upload-image-for-25-minutes', fetchOptions)
            .then(res => res.json())
            .then(({ error, success, link }) => {
                let insertedElement = document.querySelector(`[id="${id}"]`);
                if (error) {
                    insertedElement.style.backgroundImage = 'url("' + window.location.origin + '/img/error1.png' + '")';
                    alert(error);
                    setTimeout(() => {
                        insertElement.remove();
                    }, 3000);
                }
                if (success) {
                    insertedElement.style.backgroundImage = 'url("' + link + '")';
                    productImageUrlArrays.push(link);
                    console.log('productImageUrlArrays', productImageUrlArrays);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2600000);
                }
            })
            .catch(e => console.log(e))
    });




    uploadTheProductBtn.addEventListener('click', async e => {
        if (uploadingStatus) return alert('Product is already uploading  ,Please Wait Until upload finish');
        
        let name = inp_for_product_name.value;
        let description = inp_for_product_des.value;
        let cetegory = inp_for_product_cetegory_select.selectedOptions[0].value;
        let thumb = ThumbUrl;
        let images = productImageUrlArrays;
     
        if (sizeAndPrice.length ===0) return alert('please give the info of size and price');
        if (!name || name?.trim() === '') return alert('please give the info of name ');
        if (!description || description?.trim() === '') return alert('please give the info of description ');
        if (!cetegory || cetegory?.trim() === '') return alert('please give the info of cetegory ');
        if (thumb.trim()==='') return alert('please upload thumbneil of the product');
        if (images.length=== 0) return alert('please upload images of the product');
        

        console.log(size_and_price);


        let jsonObject = await JSON.stringify({
            name,
            description,
            cetegory,
            thumb,
            images,
            SizeAndPrice: sizeAndPrice.map(
                function(el) {
                    return ({
                        size :el.size ,
                        price :el.price
                    });
                }
            )
        })
        uploadTheProductBtn.style.opacity = .7;
        uploadingStatus = true;
        let url = window.location.origin + '/api/api_s/upload-product';

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonObject
        })
            .then(res => res.json())
            .then(({ error, success }) => {
                if (error) return alert(error)
                if (success) {
                    uploadTheProductBtn.innerText = 'Success';
                    uploadTheProductBtn.style.color = '#fff';
                    uploadTheProductBtn.style.border = '2px solid green';
                    uploadTheProductBtn.style.background = 'green';
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            })
            .catch(e => console.log(e))
            .finally(e => {
                uploadTheProductBtn.style.opacity = 1;
                uploadingStatus = false;
            })
    })

    // size and price 
    {
        let sizeAndPriceContainer=uploadProductConatiner.querySelector('.size_price_container');

        function organizeTable(array = [/* {no:1,size :"",price :""}*/]) {
            if (array.length ===0) return ;
            
            let table=sizeAndPriceContainer.querySelector('table');
            let trs=table.querySelectorAll('tr');
            trs.forEach(
                function (tableRow, index) {
                    if (tableRow.getAttribute('is_head')==='yes') return;
                    else return tableRow.remove();
                }
            );
            for (let i = 0; i < array.length; i++) {
                let tr=document.createElement('tr');
                tr.setAttribute('size_price_tr_no',array[i].no )
                tr.innerHTML=`
                <td>${array[i].no}</td>
                <td class="size_in_size_and_price_table " ><input type="text" value="${array[i].size}" disabled> </td>
                <td class="price_in_usd_in_size_and_price_table"> <input type="number" value="${array[i].price}" disabled></td>
                <td><button sizeAndPriceNo="${array[i].no}" class="edit_size_and_price_of_table" btn_mode="edit" >Edit</button></td>
                <td><button sizeAndPriceNo="${array[i].no}" class="delete_size_and_price_of_table">Delete</button></td>
                `;
                table.appendChild(tr);
                tr.querySelectorAll(`[sizeAndPriceNo="${array[i].no}"]`).forEach(
                    function (btn,index) {
                        if (index===0) { //edit button
                            function editButton(event) {
                                event.preventDefault();
                                let btn= event.target;
                                if (btn.getAttribute('btn_mode') === 'edit') {
                                    let tr = table.querySelector(`[size_price_tr_no="${btn.getAttribute('sizeAndPriceNo')}"]`);
                                    let inputs= tr.querySelectorAll('input');
                                    inputs.forEach(
                                        function (element) {
                                            element.disabled=false;
                                        }
                                    );
                                    btn.setAttribute('btn_mode', 'save');
                                    btn.innerHTML='Save';
                                    return;
                                } 
                                if (btn.getAttribute('btn_mode') === 'save') {
                                    let tr = table.querySelector(`[size_price_tr_no="${btn.getAttribute('sizeAndPriceNo')}"]`);
                                    let inputs= tr.querySelectorAll('input');
                                    if (String(Number(inputs[1].valueAsNumber)) === 'NaN') {
                                        return alert('price must be a number')
                                    }
                                    inputs.forEach(
                                        function (element) {
                                            element.disabled=true;
                                        }
                                    );
                                    
                                    btn.setAttribute('btn_mode', 'edit');
                                    btn.innerHTML='Edit';
                                    sizeAndPrice = sizeAndPrice.map(
                                        function (element) {
                                            if (element.no == btn.getAttribute('sizeAndPriceNo')) {
                                                element.size =inputs[0].value;
                                                element.price =Number(inputs[1].valueAsNumber);
                                                return element;
                                            } else return element;
                                        }
                                    )
                                    return;
                                }
                            }
                            btn.addEventListener('click' , editButton)
                        }
                        if (index===1) {
                            btn.addEventListener('click', function (e) {
                                let btn = e.target;
                                sizeAndPrice = sizeAndPrice.filter(
                                    function (element) {
                                        if (element.no != btn.getAttribute('sizeAndPriceNo')) return element;
                                    }
                                )
                                console.log(sizeAndPrice);
                                sizeAndPrice = sizeAndPrice.map(
                                    function (element,index) {
                                    element.no=index+1;
                                    return element;
                                })
                                organizeTable(sizeAndPrice);
                            });
                            
                        }
                    }
                )

                tr.querySelector(`[class="price_in_usd_in_size_and_price_table"]`)
                    .querySelector('input')
                    .addEventListener('keypress', function (e) {
                        if (e.key === 'Enter') {
                            let tr = e.target.parentNode.parentNode;
                            let no = tr.getAttribute('size_price_tr_no');
                            let inputs= tr.querySelectorAll('input');
                            let size =inputs[0].value,price=inputs[1].valueAsNumber;
                            if (!size || !price) return;
                            inputs.forEach(element => (element.disabled=true));
                            for (let i = 0; i < sizeAndPrice.length; i++) {
                                if (sizeAndPrice[i].no == no) {
                                    sizeAndPrice[i].size =size ;
                                    sizeAndPrice[i].price=price;
                                }
                            }
                            organizeTable(sizeAndPrice);
                            return console.log({sizeAndPrice});
                        }
                    })
            }
            return;
        }

        // add size and price 
        {
            function setUpAddsizeAndPriceFunctio(event) {
                if (event) event.preventDefault();
                let box = sizeAndPriceContainer.querySelector('.add_size_price');
                let
                    input1 = box.children[0],
                    input2 = box.children[1];
                let
                    size = input1.value?.trim(),
                    price = input2.valueAsNumber;
                if (!size) {
                    return alert('size in null');
                }
                if (!price) {
                    return alert('price in null');
                }
                if (price.toString() === 'NaN') return alert('unknown error,please try chrome browser to resolve it');
                sizeAndPrice.push({
                    no: sizeAndPrice.length + 1,
                    size,
                    price
                });
                organizeTable(sizeAndPrice);
                input1.value = null;
                input2.value = null;
            }
            sizeAndPriceContainer.querySelector('.add_size_price').querySelectorAll('input').forEach(
                function(el,index){
                    if (index===1) {
                        el.addEventListener('keypress' , function (e) {
                            if (e.key ==='Enter') {
                                setUpAddsizeAndPriceFunctio()
                            }
                        })
                    }
                }
            );
            sizeAndPriceContainer.querySelector('.add_size_price_btn').addEventListener('click',setUpAddsizeAndPriceFunctio);
        }
        
    }

}
