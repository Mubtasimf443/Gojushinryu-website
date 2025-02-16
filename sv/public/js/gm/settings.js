/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{
    let containar = document.querySelector('.settings-section');
    let imageInp = containar.querySelector('#s-sec-profile-input');

    imageInp.addEventListener('change', async e => {
        if (e.target.files[0].type !== 'image/png'
            && e.target.files[0].type !== 'image/jpg'
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Only Image are alowed');
        if (confirm('Do You really want to change the Image ?')) {
            thumb = e.target.files[0];
            let url = await URL.createObjectURL(thumb);
            let thumbInputLabel = e.target.parentNode;
            thumbInputLabel.style.background = 'url(' + url + ')';
            thumbInputLabel.style.backgroundSize = 'cover';
            thumbInputLabel.style.backgroundPosition = 'center center';
            thumbInputLabel.style.backgroundRepeat = 'no-repeat';
            let form = new FormData();
            form.append('image', thumb);
            try {
                document.querySelector(`[alt="Grand Master Image"]`).src = '/img/spinner.svg';
                let response = await fetch(window.location.origin + '/api/api_s/grand-master-image-change', {
                    method: 'put',
                    body: form
                });
                if (response.ok) {
                    document.querySelector(`[alt="Grand Master Image"]`).src = url;
                    alert('Image has been updated successfully');
                    return;
                } else {
                    alert('Failed to update Image, Please try again');
                    document.querySelector(`[alt="Grand Master Image"]`).src ='/img/avatar.png';
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    })



    containar.querySelector(`[save_settings]`).addEventListener('click', async function (e) {
        try {
            e.target.style.opacity = .7;
            let userData = {};
            userData.name = v(`[id="s-sec-name-inp"]`)
            userData.bio = v(`[id="s-sec-bio-inp"]`)
            userData.organization = v(`[id="s-sec-organization-inp"]`)
            userData.username = v(`[id="s-sec-user-id-inp"]`)
            userData.password = v(`[id="s-sec-pass-inp"]`);
            let res = await fetch(window.location.origin + '/api/api_s/update-grand-master', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            console.log({
                status: res.status,
                statusText: res.statusText
            });
            if (res.status === 200) {
                res = await res.json();
                console.log({ res });
            }
        } catch (error) {
            console.error({ error });
        } finally {
            e.target.style.opacity = 1;
        }
    })



    //function
    const v = (htmlElementSelector) => {
        let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
        let el = containar.querySelector(htmlElementSelector);
        if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
        let value = el.value;

        if (!value) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('<')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        if (value.includes('>')) {
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
        if (value.includes('[')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        } if (value.includes(']')) {
            el.style.outline = '2px solid red';
            throw new Error(simbolerror);
        }
        return value
    }


}