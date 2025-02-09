
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success

*/


{
    let mainContainer = document.querySelector(`[targetedElement="share_media_href"]`);

    function makeItred(selector) {
        selector.style.border = '2px solid red';
        selector.addEventListener('change', e => selector.style.border = 'none');
    }


    {  //video
        let vConatiner = mainContainer.querySelector('[share_video_container]')
        let videoInput = vConatiner.querySelector(`[type="file"]`);
        let video = false;
        videoInput.addEventListener('change', videoChageEvent)
        let btn = vConatiner.querySelector(`[uploadshareblePostBtn]`);
        let tags_textarea = vConatiner.querySelector(`[tags_textarea]`);
        let uploading = false;
        let tags = [];
        btn.addEventListener('click', uploadVideo);

        async function uploadVideo() {
            if (uploading) return
            let title = vConatiner.querySelector(`[title_of_the_post]`).value;
            let description = vConatiner.querySelector(`[description_of_the_post]`).value;
            if (!video) return alert('video is not uplaoded');
            if (!title) return makeItred(vConatiner.querySelector(`[title_of_the_post]`));
            if (!description) return makeItred(vConatiner.querySelector(`[description_of_the_post]`));
            if (tags.length === 0) return makeItred(vConatiner.querySelector(`[tags_textarea]`));
            let form = new FormData();
            form.append('title', title);
            form.append('description', description);
            form.append('video', video);
            form.append('tags', tags);
            btn.style.transition = 'all .6s ease';
            try {
                btn.style.opacity = 0.65;
                uploading = true;
                let res = await fetch(window.location.origin + '/api/media-api/upload-video', {
                    method: 'POST',
                    body: form
                });
                if (res.status === 201) {
                    btn.style.background = 'green';
                    btn.style.borderColor = 'green';
                    btn.innerHTML = 'Complete';
                    // setTimeout(() => window.location.reload(), 2000);
                }
                if (res.status !== 201) throw 'Error in creating a post'
            } catch (error) {
                btn.style.background = 'red';
                btn.innerHTML = 'Failed';
                btn.style.borderColor = 'red';
            } finally {
                uploading = false;
                btn.style.opacity = 1;
            }

        }
        function videoChageEvent(e) {
            if (e.target.files[0].type !== 'video/mp4') return
            if (!video) {
                video = e.target.files[0];
                let url = URL.createObjectURL(video);
                let v = document.createElement('video');
                v.src = url;
                vConatiner.querySelector('.video_inp_div').appendChild(v);
                v.play();
                v.controls = true;
                v.loop = true;
                return
            }
            if (video !== false) {
                video = e.target.files[0];
                let url = URL.createObjectURL(video);
                let v = document.createElement('video');
                v.src = url;
                vConatiner.querySelector('.video_inp_div').querySelector('video').remove();
                vConatiner.querySelector('.video_inp_div').appendChild(v);
                v.play();
                v.loop = true;
                v.controls = true;
                return
            }
        }
        tags_textarea.addEventListener('keypress',
            async function (e) {
                if (e.key === 'Enter') {
                    let value = tags_textarea.value.replace(`
`, '');
                    if (tags.findIndex(e => e === value) !== -1) return tags_textarea.value = null;
                    if (!value) return tags_textarea.value = null;
                    if (value.trim() === '') return tags_textarea.value = null;
                    tags.push(value);
                    tags_textarea.value = null;
                    let li = document.createElement('li');
                    li.innerHTML = value;
                    li.id = Math.floor(Math.random() * 325378584);
                    vConatiner.querySelector('.tags_div').querySelector('ul').appendChild(li);
                    function removeTags(target, value) {
                        tags = tags.filter(tag => {
                            if (tag !== value) return tag
                        });
                        target.remove();
                        console.log({ tags });

                    }
                    li.addEventListener('click', e => removeTags(e.target, value))
                    console.log(tags);
                    tags_textarea.value = '';
                }
            }
        )
    }

    { //images
        let imgConatiner = mainContainer.querySelector('[share_image_container]');
        let imgInput = imgConatiner.querySelector(`[type="file"]`);
        let img = [];
        let btn = imgConatiner.querySelector(`[uploadshareblePostBtn]`);
        imgInput.addEventListener('change', imgChange);
        btn.addEventListener('click', imageUpload)
        let uploading = false;


        async function imageUpload() {
            if (uploading) return;
            let text = imgConatiner.querySelector(`[type="text"]`).value;
            if (!text) {
                console.log('emty text');
                makeItred(imgConatiner.querySelector(`[type="text"]`));
                return
            }
            if (typeof text !=='string') throw 'text is not a string';
            if (text?.length < 5 || text?.length > 1000) return alert('caption is too big or too short');
            if (img.length === 0) {
                if (confirm('Do You Only want to post Text to your social Media Accounts ?')) {
                    async function uploadText(message) {
                        try {
                            btn.style.transition = 'all .6s ease';
                            btn.style.opacity = .65;
                            uploading = true;
                            let res = await fetch(window.location.origin + '/api/media-api/upload/text', {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                method: 'POST',
                                body: JSON.stringify({
                                    message
                                })
                            });
                            if (res.status === 201) {
                                btn.style.background = 'green';
                                btn.style.borderColor = 'green';
                                btn.innerHTML = 'Complete';
                                setTimeout(() => window.location.reload(), 2000);
    
                            } else {
                                throw (await res.json().catch(e => ('failed to parse json')));
                            }
                        } catch (error) {
                            console.log(error);
                            btn.style.background = 'red';
                            btn.innerHTML = 'Failed';
                            btn.style.borderColor = 'red';
                        } finally {
                            btn.style.opacity = 1;
                            uploading = false;
                        }
                    }
                    return uploadText(text);
                } else return;
            }
            let form = new FormData();
            for (let i = 0; i < img.length; i++) form.append('images', img[i]);
            form.append('message', text);
            btn.style.transition = 'all .6s ease';
            try {
                uploading = true;
                btn.style.opacity = 0.65;
                let res = await fetch(window.location.origin + '/api/media-api/upload-images', {
                    method: 'POST',
                    body: form
                });
                if (res.status === 201) {
                    btn.style.background = 'green';
                    btn.style.borderColor = 'green';
                    btn.innerHTML = 'Complete';
                    setTimeout(() => window.location.reload(), 2000);
                }
                if (res.status !== 201) {
                    throw 'Error in creating a post'
                }
            } catch (error) {
                btn.style.background = 'red';
                btn.innerHTML = 'Failed';
                btn.style.borderColor = 'red';
            } finally {
                uploading = false;
                btn.style.opacity = 1;
            }
        }


        function imgChange(e) {
            if (img.find(el => el.name === e.target.files[0].name)) return
            if (img.length >= 10) return
            let files = [];
            for (let i = 0; i < e.target.files.length; i++) {
                if (e.target.files[i].type.toString().includes('image/') === true) {
                    let name = e.target.files[i].name;
                    let check = img.find(
                        function (element) {
                            if (element?.name === name) return element
                        }
                    );
                    if (check === undefined) {
                        if (img.length < 10) {
                            files.push(e.target.files[i]);
                            img.push(e.target.files[i]);
                        }
                    }
                }
            }

            for (let i = 0; i < files.length; i++) {
                let label = document.createElement('label');
                let url = URL.createObjectURL(files[i]);
                let btn = document.createElement('button');
                label.style.position = 'relative';
                label.style.background = `url(${url})`;
                label.style.backgroundSize = `cover`;
                label.style.backgroundPosition = `center`;
                label.style.backgroundRepeat = `no-repeat`;
                label.setAttribute('image_name', files[i].name);
                btn.style.position = 'absolute';
                btn.innerHTML = '&times;'
                btn.style.background = 'rgba(0,0,0,0.1)';
                btn.style.borderRadius = '50%';
                btn.style.height = '30px';
                btn.style.width = '30px';
                btn.style.color = '#fff';
                btn.style.fontSize = '19px';
                btn.style.top = '7px';
                btn.style.right = '8px';
                btn.style.border = 'none';
                btn.setAttribute('parent_image_name', e.target.files[i].name);
                label.append(btn);
                imgConatiner.querySelector('[class="upload_sec_env_img_inp_box"]').appendChild(label);
                label.querySelector('button').addEventListener('click',
                    function (e) {
                        e.preventDefault();
                        let imgName = e.target.getAttribute('parent_image_name');
                        img = img.filter(el => el.name !== imgName);
                        let selector = `[image_name="${imgName}"]`;
                        let label = imgConatiner.querySelector('[class="upload_sec_env_img_inp_box"]').querySelector(selector);
                        if (label) label.remove();
                    }
                )
            };
        }
    }


}