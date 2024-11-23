
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
    let container=document.querySelector(`[id="Testimonials-conatiner"]`);
    let imageInput =container.querySelector('#upload_testimonial_images');
    let images=false;
    let btn=container.querySelector(`[uploadTestimonialsButton]`)
    let testimonialsArray=[];

    function value(params) {
        let val=container.querySelector(params).value;
        if (!val) {
            container.querySelector(params).style.outline='2px solid red'
            throw 'error'
        }
        if (val.toString().trim()==='') {
            container.querySelector(params).style.outline='2px solid red'
            throw 'error'
        }
        return val
    }


    container.querySelector(`[name_of_Appreciator]`).addEventListener('change', e => e.target.style.outline==='none')
    container.querySelector(`[Appreciation]`).addEventListener('change', e => e.target.style.outline==='none')
    container.querySelector(`[Positon_of_Appreciator]`).addEventListener('change', e => e.target.style.outline==='none')


    imageInput.addEventListener('change', function (e) {
        if (
            e.target.files[0].type !== 'image/png' 
            && e.target.files[0].type !== 'image/jpg' 
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
        ) return alert('Your uploaded file was not an images');
        images= e.target.files[0];
        let url =URL.createObjectURL(images);
        let label=container.querySelector(`[for="upload_testimonial_images"]`)
        label.style.background =`url(${url})`;
        label.style.backgroundSize = 'contain';
        label.style.backgroundPosition = 'center center';
        label.style.backgroundRepeat = 'no-repeat';
        label.style.height='200px'
    });



    btn.addEventListener('click', function (event) {
        event.preventDefault();
        let appreciator, appreciation,appreciation_position;
        appreciator=value(`[name_of_Appreciator]`);
        appreciation_position=value(`[Positon_of_Appreciator]`);
        appreciation=value(`[Appreciation]`);
        if (!images) return alert('please give a image');
        let form=new FormData();
        form.append('appreciator', appreciator)
        form.append('appreciation_position', appreciation_position)
        form.append('appreciation', appreciation);
        form.append('images',images);
        btn.style.opacity=0.65;
        btn.style.transition='all .7s ease';
        fetch(window.location.origin+'/api/api_s/testimonials', {
            method :'POST',
            body :form
        })
        .then(function (res) {
            if (res.status===201) {
                btn.style.background='green';
                btn.innerHTML='Success';
                setTimeout(() => {
                    window.location.reload()
                }, 2000); 
                return;
            }
        })
        .catch(function (error) {
            btn.style.background='red';
            btn.innerHTML='Error';
        })
        .finally(function () {
            btn.style.opacity=1;
        })
    })


    {//table
        let seen=false;
        let observer =new IntersectionObserver(entries=> {
            if (entries[0].isIntersecting && !seen) {
                seen=true;
                fetch(window.location.origin+'/api/api_s/testimonials')
                .then(function (res) {
                   if (res.status===200) {
                       res.json().then(function(data) {
                         data=data.data;
                         for (let i = 0; i < data.length; i++) {
                            testimonialsArray.push(data[i])
                            let {appreciator_image_url,appreciator,appreciation,appreciation_position,date } = data[i];
                            let tr=document.createElement('tr'),table=container.querySelector('table');
                            tr.setAttribute('t_id',date )
                            tr.innerHTML=`
                             <td><img src="${appreciator_image_url}" alt=""></td>
                             <td>${appreciator}</td>
                             <td>${appreciation_position}</td>
                             <td><button edit appreciator_date="${date}" >View</button></td>
                             <td><button delete appreciator_date="${date}" class="Delete">Delete</button></td>
                            `;
                            table.appendChild(tr);
                            function editTestimonials(event) {
                                let popup=container.querySelector('.popup_c');
                                popup.style.display='flex';
                                let id=event.target.getAttribute('appreciator_date');
                                id=Number(id);
                                let details=testimonialsArray.find(el=>el.date===id);
                                popup.setAttribute('appreciator_date',id)
                                popup.querySelector(`[placeholder="Appreciator Name"]`).value=details.appreciator
                                popup.querySelector(`[placeholder="Appreciator Job Position"]`).value=details.appreciation_position
                                popup.querySelector(`[placeholder="Appreciation"]`).value=details.appreciation
                            }
                            function deleteTestimonials(event) {
                                let id=event.target.getAttribute('appreciator_date');
                                id=Number(id);
                                event.target.style.opacity=.7;
                                fetch(window.location.origin+'/api/api_s/testimonials', {
                                    method:'DELETE', 
                                    body :JSON.stringify({
                                        id 
                                    }),
                                    headers :{
                                        'Content-Type':'application/json'
                                    }
                                })
                                .then(function (res) {
                                    if (res.status===200) {
                                        alert('Testimonial deleted');
                                        container.querySelector('table').querySelectorAll('tr').forEach(function (element) {
                                            if (element.getAttribute('t_id')==id) element.remove()
                                        })
                                    } 
                                })
                                
                            }
                            tr.querySelector(`[edit]`).addEventListener('click',editTestimonials )
                            tr.querySelector(`[delete]`).addEventListener('click',deleteTestimonials)
                         }
                       })                    
                   } 
                })
            }
        })
        observer.observe(container)
    
    }
}


