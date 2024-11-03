
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
let mainContainer=document.querySelector(`[targetedElement="share_media_href"]`);

{  //video
    let vConatiner=mainContainer.querySelector('[share_video_container]')
    let videoInput=vConatiner.querySelector(`[type="file"]`);
    let video=false;
    videoInput.addEventListener('change',videoChageEvent)

    function videoChageEvent(e) {
        if (e.target.files[0].type !== 'video/mp4') return
        if (!video) {
            video=e.target.files[0];
            let url =URL.createObjectURL(video);
            let v=document.createElement('video');
            v.src=url;
            vConatiner.querySelector('.video_inp_div').appendChild(v);
            v.play();
            v.controls=true;
            v.loop=true;
            return
        }
        if (video!==false) {
            video=e.target.files[0];
            let url =URL.createObjectURL(video);
            let v=document.createElement('video');
            v.src=url;
            vConatiner.querySelector('.video_inp_div').querySelector('video').remove();
            vConatiner.querySelector('.video_inp_div').appendChild(v);
            v.play();
            v.loop=true;
            v.controls=true;
            return
        }
    }
}

 
{ //images
    let imgConatiner=mainContainer.querySelector('[share_image_container]');
    let imgInput=imgConatiner.querySelector(`[type="file"]`);
    let img=[];
    imgInput.addEventListener('change',imgChange);
    function imgChange(e) {
        if (
            e.target.files[0].type !== 'image/png'
            && e.target.files[0].type !== 'image/jpg'
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return
        if (img.find(el => el.name === e.target.files[0].name)) return
        if (img.length >= 5) return

        img.push(e.target.files[0]);
        let label=document.createElement('label');
        let url=URL.createObjectURL(e.target.files[0]);
        let btn=document.createElement('button');
        label.style.position='relative';
        label.style.background=`url(${url})`;
        label.style.backgroundSize=`cover`;
        label.style.backgroundPosition=`center`;
        label.style.backgroundRepeat=`no-repeat`;
        label.setAttribute('image_name', e.target.files[0].name);
        btn.style.position='absolute';
        btn.innerHTML='&times;'
        btn.style.background='rgba(0,0,0,0.1)';
        btn.style.borderRadius='50%';
        btn.style.height='30px';
        btn.style.width='30px';
        btn.style.color='#fff';
        btn.style.fontSize='19px';
        btn.style.top='7px';
        btn.style.right='8px';
        btn.style.border='none';
        btn.setAttribute('parent_image_name', e.target.files[0].name);
        label.append(btn);
        imgConatiner.querySelector('[class="upload_sec_env_img_inp_box"]').appendChild(label);
        label.querySelector('button').addEventListener('click',
            function (e) {
                e.preventDefault();
                let imgName=e.target.getAttribute('parent_image_name');
                img=img.filter(el=> el.name !== imgName);
                let selector=`[image_name="${imgName}"]`;
                let label=imgConatiner.querySelector('[class="upload_sec_env_img_inp_box"]').querySelector(selector);
                if (label) label.remove();
            }
        )
        return     
    }
}