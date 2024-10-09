/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{



    //dom
    let courseSection=document.querySelector(`[id="couses-list-and-uplaod-container"]`);
    let thumbInput= courseSection.querySelector(`[id="course-thumb-inp"]`);
    let imagesInput =courseSection.querySelector(`[id="_images_inp"]`);
    let dateInput=courseSection.querySelector(`[id="dateInput"]`);
    let upload_course_btn=  courseSection.querySelector(`[upload_course_btn]`);
    let table =courseSection.querySelector('table')
    let cousesData={
        thumb:"",
        images:[]
    };
    let uploadingCourse=false
    thumbInput.addEventListener('change', e => {
        if (
            e.target.files[0].type !== 'image/png' 
            && e.target.files[0].type !== 'image/jpg' 
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');

        let thumbInputLabel =courseSection.querySelector(`[for="${e.target.id}"]`);
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
          .then(data => data.json())
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
            cousesData.thumb=link;
            console.log('ThumbUrl',cousesData.thumb);
            
            setTimeout(() => {
                window.location.reload();
            }, 2600000);
            }
          })
          .catch(e =>{
            console.log(e);
            thumbInputLabel.style.backgroundImage='url("'+ window.location.origin +'/img/error1.png' +'")';
          })
          
    })


    imagesInput.addEventListener('change',(e) => {
        if (
            e.target.files[0].type !== 'image/png' 
            && e.target.files[0].type !== 'image/jpg' 
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');
        let imageContainer =courseSection.querySelector('[id="images_container"]');
        let label =courseSection.querySelector(`[for="_images_inp"]`);
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
            let insertedElement  =courseSection.querySelector(`[id="${id}"]`);
            if (error) {
            insertedElement.style.backgroundImage='url("'+ window.location.origin +'/img/error1.png' +'")';
            alert(error);
            setTimeout(() => {
                insertElement.remove();
            }, 3000);
            }
            if (success) {
                insertedElement.style.backgroundImage='url("'+ link +'")';
                cousesData.images.push(link);
                console.log('productImageUrlArrays',cousesData.images);
                setTimeout(() => {
                    window.location.reload();
                }, 2600000);
            }
        })
        .catch(e => {
            console.log(e) ;
            let insertedElement  =courseSection.querySelector(`[id="${id}"]`);
            insertedElement.style.backgroundImage='url("'+ window.location.origin +'/img/error1.png' +'")';
            setTimeout(() => {
                insertElement.remove();
            }, 3000);
        })
    })


    dateInput.addEventListener('keydown',e => {
        let target =e.target;
        let k=e.key;
        if (k !==',' && Number(k).toString()==='NaN') return setTimeout(() => {
                target.value=target.value.replace(k,'')   
            }, 100); 
        
    })



    upload_course_btn.addEventListener('click',async e => {
        if (uploadingCourse) return
        try {
           
          
            if (!cousesData.thumb)  return  thumbInput.style.outline='2px solid red'
            if (!cousesData.images.length)  return thumbInput.style.outline='2px solid red'
            cousesData.title=await v(`[name="Title"]`);
            cousesData.description=await v(`[name="Description"]`);
            cousesData.price=await v2(`[name="Price"]`);
            cousesData.dates=await v(`[id="dateInput"]`);
            cousesData.seniorStartTime= v(`[id="SeniorStartTime"]`);
            cousesData.seniorEndTime= v(`[id="SeniorEndTime"]`);
            cousesData.juniorStartTime= v(`[id="juniorStartTime"]`);
            cousesData.juniorEndTime= v(`[id="juniorEndTime"]`);
            cousesData.courseDuration=v(`[placeholder="6 Months"]`)
            let dates = cousesData.dates.split(',');
            cousesData.dates=[];
            cousesData.dates= dates.map(e => {
                e =Number(e);
                if (e >31 || e <0) {
                    alert('date can be bigger than 31 or less the 1')
                    throw 'Date is e >31 || e <0'
                }
                return e
            });
            let jsonObj =await JSON.stringify(cousesData);
            uploadingCourse=true;
            upload_course_btn.style.opacity=.65;
            fetch(window.location.origin +'/api/api_s/upload-course',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:jsonObj
            })
            .then(e => e.json())
            .then(data => {
                let {error,success}=data;
                log(data)
                if (error) return log(error);
                if (success) return window.location.reload();
            })
        .catch(r => log(e))
        .finally(e => uploadingCourse=false)

        } catch (error) {
            console.error(error)
        }
       
})


let tableDone =false;
let observer =new IntersectionObserver(enties => {
    if(enties[0].isIntersecting && !tableDone) {
        fetch(window.location.origin +'/api/api_s/courses')
        .then(res => res.json())
        .then(({courses}) => {
            for (let i = 0; i < courses.length; i++) {
                let {title,thumb,price,id} = courses[i];
                let tr= document.createElement('tr');
                tr.innerHTML=`
                <td><img src="${thumb}" alt=""></td>
                <td>
                <strong>
                ${title}
                </strong>
                </td>
                <td>
                <span class="price">${price}.00$</span>
                </td>
                <td> <button course_id="${id}" class="action">Action</button></td>
                `;
                table.appendChild(tr)
            }
        })
        .finally(e => tableDone =true)
    }
})

observer.observe(table)

const v=(htmlElementSelector) => {
    let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
    let el=courseSection.querySelector(htmlElementSelector);
    if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
    let value=el.value;
    if (!value) {
        el.style.outline='2px solid red';
        throw new Error('value is not present');
    }
   
    
    return value
}


const v2=(htmlElementSelector) => {
    let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
    let el=courseSection.querySelector(htmlElementSelector);
    if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
    let value=el.valueAsNumber;
    if (!value) {
        el.style.outline='2px solid red';
        throw new Error(simbolerror);
    }
    if (Number(value).toString().toLowerCase()==='nan') {
        el.style.outline='2px solid red';
        throw new Error('Error : not a number');
    }
    return value
}




}