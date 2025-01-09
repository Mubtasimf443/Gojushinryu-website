
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
    let
        container = document.querySelector(`[id="Testimonials-conatiner"]`),
        imageInput = container.querySelector('#upload_testimonial_images'),
        images = false,
        btn = container.querySelector(`[uploadTestimonialsButton]`),
        testimonialsArray = [],
        imageUploading=false,
        imageID=false,
        requesting =false;

    function value(params) {
        let val = container.querySelector(params).value;
        if (!val) {
            container.querySelector(params).style.outline = '2px solid red'
            throw 'error'
        }
        if (val.toString().trim() === '') {
            container.querySelector(params).style.outline = '2px solid red'
            throw 'error'
        }
        return val
    }


    container.querySelector(`[name_of_Appreciator]`).addEventListener('change', e => e.target.style.outline === 'none')
    container.querySelector(`[Appreciation]`).addEventListener('change', e => e.target.style.outline === 'none')
    container.querySelector(`[Positon_of_Appreciator]`).addEventListener('change', e => e.target.style.outline === 'none')





    imageInput.addEventListener('change',async function (e) {
        if (imageUploading) return;
        if ( e.target.files.length===0) return;

        const element = e.target.files[0];
        if (element.type === 'image/png' || element.type === 'image/jpg' || element.type === 'image/jpeg' || element.type === 'image/webp') {
            try {
                let form = new FormData();
                form.append('img', element);
                let label = container.querySelector(`[for="upload_testimonial_images"]`);
                label.style.background = `url('${window.location.origin}/img/gif.gif')`;
                label.style.backgroundSize = 'contain';
                label.style.backgroundPosition = 'center center';
                label.style.backgroundRepeat = 'no-repeat';
                label.style.height = '200px'
                imageUploading=true;
                let res= await fetch(`${window.location.origin}/api/api_s/upload-image-for-25-minutes`,{
                    method:'POST',
                    body:form
                });
                res=await res.json().catch(e => ({error :"failed to parse json"}));
                if (res.success && res.image_id && res.link) {
                    imageID = res.image_id;
                    label.style.background = `url('${res.link}')`;
                    label.style.backgroundSize = 'contain';
                    label.style.backgroundPosition = 'center center';
                    label.style.backgroundRepeat = 'no-repeat';
                    label.style.height = '200px';
                }
            } catch (error) {
                console.log(error);
            } finally {
                imageUploading=false;
            }
        }       
    });



    btn.addEventListener('click',async function (event) {
        try {
            if (requesting) return;
            event.preventDefault();
            let appreciator, appreciation, appreciation_position;
            appreciator = value(`[name_of_Appreciator]`);
            appreciation_position = value(`[Positon_of_Appreciator]`);
            appreciation = value(`[Appreciation]`);
    
            console.log({
                appreciation: appreciation.length,
                appreciator,
                appreciation_position
            })
            
            if (!appreciator) namedErrorCatching('[name_of_Appreciator]', 'appreciator is emty string or undefined');
            if (!appreciation_position) namedErrorCatching('[Positon_of_Appreciator]', 'appreciation_position is emty string or undefined');
            if (!appreciation) namedErrorCatching('[Appreciation]', 'appreciation is emty string  or undefined');

            if (appreciator.trim().length  > 100 || appreciator.trim().length < 4) namedErrorCatching('[name_of_Appreciator]', 'appreciator length is too big or short, minumum length should be 4 and max should be 100');
            if (appreciation_position.trim().length > 100 || appreciation_position.trim().length < 4) namedErrorCatching('[Positon_of_Appreciator]', 'appreciation_position length is too big or short, minumum length should be 4 and max should be 100');
            if (appreciation.trim().length > 2500 || appreciation.trim().length < 50) namedErrorCatching('[Appreciation]', 'appreciation length is too big or short, minumum length should be 50 and max should be 2500');
    
            if (!imageID) return alert('please an image of appreciator');

            requesting=true;
            event.target.style.opacity=.7;
            let res=await fetch(window.location.origin+'/api/api_s/testimonials-second-api', {
                method:'POST',
                headers :{
                    "content-type":'application/json'
                },
                body:JSON.stringify({
                    appreciator,
                    appreciation_position,
                    appreciation,
                    appreciator_image_url_id :imageID
                })
            });
            if (res.status===201) {
                event.target.style.background = 'green';
                event.target.innerHTML='success';
                setTimeout(() => window.location.reload(), 2000);
            } 
            if (res.status!==201) {
                console.log((await res.json().catch( e => "failed to parse json data")))
            }
        } catch (error) {
            console.error(error);
        } finally{
            requesting=false;
            event.target.style.opacity=1;
        }
        
    })
    
    setRomoveMentionText(`[name_of_Appreciator]`);
    setRomoveMentionText(`[Positon_of_Appreciator]`);
    setRomoveMentionText(`[Appreciation]`);
    function setRomoveMentionText(selector,text) {
        container.querySelector(selector).onkeypress = function(event) { 
            event.target.parentNode.querySelector('.mention').innerHTML =(text !== undefined ? text : null);  
        }
       
    }
    function namedErrorCatching(selector,mention ){
        container.querySelector(selector).parentNode.querySelector('.mention').innerHTML=(mention ? mention :null);
        throw ({error :mention});
    }
    



    {//table
        let seen = false;
        let observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !seen) {
                seen = true;
                fetch(window.location.origin + '/api/api_s/testimonials')
                    .then(function (res) {
                        if (res.status === 200) {
                            res.json().then(function (data) {
                                data = data.data;
                                for (let i = 0; i < data.length; i++) {
                                    testimonialsArray.push(data[i])
                                    let { appreciator_image_url, appreciator, appreciation, appreciation_position, date } = data[i];
                                    let tr = document.createElement('tr'), table = container.querySelector('table');
                                    tr.setAttribute('t_id', date)
                                    tr.innerHTML = `
                             <td><img src="${appreciator_image_url}" alt=""></td>
                             <td>${appreciator}</td>
                             <td>${appreciation_position}</td>
                             <td><button edit appreciator_date="${date}" >View</button></td>
                             <td><button delete appreciator_date="${date}" class="Delete">Delete</button></td>
                            `;
                                    table.appendChild(tr);
                                    function editTestimonials(event) {
                                        let popup = container.querySelector('.popup_c');
                                        popup.style.display = 'flex';
                                        let id = event.target.getAttribute('appreciator_date');
                                        id = Number(id);
                                        let details = testimonialsArray.find(el => el.date === id);
                                        popup.setAttribute('appreciator_date', id)
                                        popup.querySelector(`[placeholder="Appreciator Name"]`).value = details.appreciator
                                        popup.querySelector(`[placeholder="Appreciator Job Position"]`).value = details.appreciation_position
                                        popup.querySelector(`[placeholder="Appreciation"]`).value = details.appreciation
                                    }
                                    function deleteTestimonials(event) {
                                        let id = event.target.getAttribute('appreciator_date');
                                        id = Number(id);
                                        event.target.style.opacity = .7;
                                        fetch(window.location.origin + '/api/api_s/testimonials', {
                                            method: 'DELETE',
                                            body: JSON.stringify({
                                                id
                                            }),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                            .then(function (res) {
                                                if (res.status === 200) {
                                                    alert('Testimonial deleted');
                                                    container.querySelector('table').querySelectorAll('tr').forEach(function (element) {
                                                        if (element.getAttribute('t_id') == id) element.remove()
                                                    })
                                                }
                                            })

                                    }
                                    tr.querySelector(`[edit]`).addEventListener('click', editTestimonials)
                                    tr.querySelector(`[delete]`).addEventListener('click', deleteTestimonials)
                                }
                            })
                        }
                    })
            }
        })
        observer.observe(container)

    }
}


