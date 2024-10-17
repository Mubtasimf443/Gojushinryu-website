/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{
    let container =document.querySelector(`[id="upload-post-conatiner"]`);
    let thumbneilInput =container.querySelector(`#upload_post_thumb`)
    let imagesInput =container.querySelector('#upload_p_images_input');
    let uplaod_btn=document.querySelector(`[uplaod_btn]`);
    let images=[]
    let thumb=false;

    thumbneilInput.addEventListener('change', e => {
        try {
            if (e.target.files[0].type !== 'image/png' 
                && e.target.files[0].type !== 'image/jpg' 
                && e.target.files[0].type !== 'image/jpeg'
                && e.target.files[0].type !== 'image/webp') return alert('Only Image are alowed');
            thumb=e.target.files[0];
            let url =URL.createObjectURL(thumb);
            let thumbInputLabel =container.querySelector('[for="upload_post_thumb"]');
            thumbInputLabel.style.backgroundImage='url("'+url+'")';
            thumbInputLabel.style.backgroundSize = 'contain';
            thumbInputLabel.style.backgroundPosition = 'center center';
            thumbInputLabel.style.backgroundRepeat = 'no-repeat';
        } catch (error) {
            console.log({error});
        }      
    })






    imagesInput.addEventListener('change', e => {
        try {
            if (e.target.files[0].type !== 'image/png' 
                && e.target.files[0].type !== 'image/jpg' 
                && e.target.files[0].type !== 'image/jpeg'
                && e.target.files[0].type !== 'image/webp') return alert('Only Image are alowed');
            if (images.length === 10) return

            images.push(e.target.files[0])
            let url =URL.createObjectURL(images[images.length-1]);
            let thumbInputLabel=document.createElement('label');
            thumbInputLabel.style.backgroundImage='url("'+url+'")';
            thumbInputLabel.style.backgroundSize = 'cover';
            thumbInputLabel.style.backgroundPosition ='center center';
            thumbInputLabel.style.backgroundRepeat = 'no-repeat';
            document.querySelector(`[images__]`).appendChild(thumbInputLabel)
        } catch (error) {
            console.log({error});
        }      
    })




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

    let notUplaodingeApost=true
    async function UploadPost(e) {
        if (notUplaodingeApost) {
            e.preventDefault();
            if (!images.length) return
            if (!thumb) return
            let title,description;
            try {
                title=v(`[placeholder="title"]`);
                description=v(`[placeholder="description"]`);
            } catch (error) {
                return alert(error)
            }
            try {
                notUplaodingeApost =false;
                uplaod_btn.style.opacity=.6;
                let form=new FormData();
                form.append('title', title)
                form.append('description', description)
                form.append('thumb', thumb)
                for(let i=0;i <images.length;i++) form.append('images',images[i])
                let res = await fetch(window.location.origin + '/api/l-api/uplaod-post',{
                    // headers:{
                    //     'Content-Type':'application/json'
                    // },
                    method :'POST',
                    body :form
                })
                if (res.status ===201) setTimeout(() => window.location.reload(), 1000);
                if (res.status!==201) {
                    uplaod_btn.setAttribute('style', 'background:red;border:2px solid black');
                    uplaod_btn.innerHTML='Unknown error';
                }
            } catch (error) {
                log({error})
            } finally {
                notUplaodingeApost=true;
                uplaod_btn.style.opacity=1;
            }
        }
    }



  uplaod_btn.addEventListener('click',e => UploadPost(e))

}