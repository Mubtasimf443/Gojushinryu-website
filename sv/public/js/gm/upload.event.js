/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/




{

    //dom
    let eventUploadSection = document.querySelector('.event_upload_sec');
    let thumbInput = eventUploadSection.querySelector('#upload_sec_event_tumb_img_inp');
    let thumbInputLabel = eventUploadSection.querySelector('[for="upload_sec_event_tumb_img_inp"]');
    let imgInputLabel = eventUploadSection.querySelector('[for="upload_sec_env_img_inp"]')
    let imgInput = eventUploadSection.querySelector('#upload_sec_env_img_inp');
    //values
    let thumb;
    let images = [];
    let btn = eventUploadSection.querySelector('[uplaod_event_btn]');


    thumbInput.addEventListener('change', async e => {
        if (e.target.files[0].type !== 'image/png'
            && e.target.files[0].type !== 'image/jpg'
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');
        thumb = e.target.files[0];
        let url = await URL.createObjectURL(thumb);
        thumbInputLabel.style.background = 'url(' + url + ')';
        thumbInputLabel.style.backgroundSize = 'cover';
        thumbInputLabel.style.backgroundPosition = 'center center';
        thumbInputLabel.style.backgroundRepeat = 'no-repeat';

    });

    imgInput.addEventListener('change', async e => {
        if (e.target.files[0].type !== 'image/png'
            && e.target.files[0].type !== 'image/jpg'
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');
        if (images.length === 10) return


        let imageExist = images.findIndex(el => el.name === e.target.files[0].name)
        if (imageExist !== -1) return alert('image already added');
        images.push(e.target.files[0]);
        let url = await URL.createObjectURL(images[images.length - 1]);
        let parentNode = imgInput.parentNode;
        let img = document.createElement('img');
        img.src = url;
        img.style.width = '150px';
        img.style.height = '150px';
        img.style.borderRadius = '7px';
        img.style.backgroundSize = 'cover'
        img.style.backgroundPosition = 'top center';
        imgInputLabel.remove();
        parentNode.appendChild(img);
        parentNode.appendChild(imgInputLabel)

    })


    let notUplaoding = true;
    btn.addEventListener('click', async e => {

        e.preventDefault()
        if (!notUplaoding) return
        if (!thumb) return
        if (!images.length) return


        let title = v(`[placeholder="Write the event Title"]`)
        let description = v(`[placeholder="Write the event Description"]`);
        let eventDate = eventUploadSection.querySelector(`[placeholder="Write the event Date"]`).valueAsNumber;
        let organizerCountry = v(`[placeholder="Organizing Country"]`)
        let participatingCountry = vn(`[placeholder="Particapating Country"]`);
        let participatingAtletes = vn(`[placeholder="Organizing Atletes"]`)
        if (!eventDate) throw 'event date is null '


        let formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumb', thumb);
        formData.append('author', gmName)
        formData.append('gm_id', gmID)
        formData.append('eventDate', eventDate)
        formData.append('organizerCountry', organizerCountry)
        formData.append('participatingCountry', participatingCountry)
        formData.append('participatingAtletes', participatingAtletes)


        for (let i = 0; i < images.length; i++) formData.append(`images`, images[i]);
        
        try {

            notUplaoding = false;
            e.target.style.opacity = .7;

            let res = await fetch(window.location.origin + '/api/api_s/upload-event-api', {
                method: 'POST',
                body: formData
            });

            if (res.status === 201) {
                btn.style.background='green';
                btn.innerHTML='Success';
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }

            if (res.status !== 201) {
                btn.style.background='red';
                btn.innerHTML='Failed';
            }
        } catch (error) {
            console.error({ error });
        } finally {
            notUplaoding = true;
            e.target.style.opacity = 1
        }
    })
    //function
    function v(htmlElementSelector) {
        let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
        let el = eventUploadSection.querySelector(htmlElementSelector);
        if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
        let value = el.value;
        if (!value) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }

        if (value.includes('{')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        } if (value.includes('}')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }

        return value
    }

    function vn(selector) {
        let valueAsNumber=eventUploadSection.querySelector(selector).valueAsNumber;
        if (Number(valueAsNumber).toString() ==='NaN') {
            throw 'value is not a number'
        }
        return valueAsNumber;
    }


    function makeNull(htmlElementSelector) {
        eventUploadSection.querySelector(htmlElementSelector).value = null;
    }

}