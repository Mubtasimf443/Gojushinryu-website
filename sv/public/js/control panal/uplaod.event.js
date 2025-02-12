/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/


{



        let container =document.querySelector(`[id="upload-event-conatiner"]`);
        let productThumbInput =container.querySelector('#upload_event_thumb_input')
        let productImageUploadInput =container.querySelector('[id="event_image_upload_input"]')
        let uploadEventButton =container.querySelector(`[uploadEventButton]`);
        let thumb ;
        let images = [];
    
        //thumb


        productThumbInput.addEventListener('change', async e => { 
            if (e.target.files[0].type !=='image/png'
                && e.target.files[0].type!== 'image/jpg'
                && e.target.files[0].type !== 'image/jpeg'
                && e.target.files[0].type !== 'image/webp'
            ) return alert('Only Image are alowed');
            thumb=e.target.files[0]
            let url = await URL.createObjectURL(thumb);
            let thumbInputLabel = container.querySelector(`[for="upload_event_thumb_input"]`);
            thumbInputLabel.style.background = 'url(' +url +')';
            thumbInputLabel.style.backgroundSize = 'cover';
            thumbInputLabel.style.backgroundPosition = 'center center';
            thumbInputLabel.style.backgroundRepeat = 'no-repeat';      
        })


        //images
        productImageUploadInput.addEventListener('change', async (e) => {
            if (e.target.files[0].type !== 'image/png' 
                && e.target.files[0].type !== 'image/jpg' 
                && e.target.files[0].type !== 'image/jpeg'
                && e.target.files[0].type !== 'image/webp'
            ) return alert('Only Image are alowed');
            if (images.length ===10) return
            images.push(e.target.files[0])
            let url =URL.createObjectURL(images[images.length -1])
            let insertElement= document.createElement('label')
            insertElement.style.backgroundImage='url("'+url+'")';
            insertElement.style.backgroundSize = 'contain';
            insertElement.style.backgroundPosition = 'center center';
            insertElement.style.backgroundRepeat = 'no-repeat';
            e.target.parentNode.appendChild(insertElement);
        });
  

    let notUplaoding=true;
    uploadEventButton.addEventListener('click', async e => {
        try {
            if (!thumb) throw new Error("thumb Date is undefined");
            if (images.length === 0) throw 'images length 0'
            e.preventDefault()
            if (!notUplaoding) return
            let title = v(`[placeholder="Write the Event Title"]`)
            let description = v(`[placeholder="Write the description of the event"]`);
            let
                eventDate = container.querySelector(`[placeholder="Event Date"]`).valueAsNumber,
                organizerCountry = v(`[placeholder="Organizing Country"]`);
                // participatingCountry = Number(v(`[placeholder="Particapating Country"]`)),
                // participatingAtletes = Number(v(`[placeholder="Particapating Atletes"]`));

            if (!eventDate) throw new Error("Event Date is undefined");

            console.log({ eventDate, title, description, thumb, images });

            let formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('organizerCountry', organizerCountry);
            formData.append('thumb', thumb);
            formData.append('eventDate', eventDate)
            
            for (let i = 0; i < images.length; i++) formData.append(`images`, images[i]);

            uploadEventButton.style.opacity = .6;
            
            let res = await fetch(window.location.origin + '/api/api_s/admin-event-upload-api', {
                method: 'POST',
                body: formData
            });
            
            if (res.status === 201) {
                alert('Event Uploaded SuccessFully')
                window.location.reload();
            }

            if (res.status === 401) {
                window.location.reload();
            }

            if (res.status !== 201) {
                alert('Event Upload Failed Because of Unknown reason, Try Again or Contact Developer');
            }
            
        } catch (error) {
            console.log({ error });
        } finally {
            uploadEventButton.style.opacity = 1;
        }
    })
    //function
    function v(htmlElementSelector) {
        let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
        let el = container.querySelector(htmlElementSelector);
        if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
        let value = el.value;
        if (!value) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        
        return value
    }























}