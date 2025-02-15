/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allah,  By your Marcy Ya Allah
*/
{
    let container = document.querySelector('#Saminar_container');
    let saminars = [];
    let seen = false;
    let api = window.location.origin + '/api/api_s/saminars';
    let updatingSaminars=false;
    let deletingSaminars=false;
    let creatingSaminars=false;
    let observer = new IntersectionObserver(async function (entries) {
        if (seen || !entries[0].isIntersecting) return;
        let response = await fetch(api);
        if (response.status === 200) saminars = (await response.json())?.data || [];
        LoadSaminars();
    });
    observer.observe(container);
    function LoadSaminars() {
        container.querySelector('tbody').innerHTML=null;
        saminars.forEach(function(el) {
            let tr=document.createElement('tr');
            {
                let td=document.createElement('td');
                let img=document.createElement('img');
                img.src=el.imageUrl;
                img.alt='Saminar'
                td.append(img)
                tr.append(td)
            }
            {
                let td=document.createElement('td');
                td.innerHTML=el.title;
                tr.append(td)
            }
            {
                let td=document.createElement('td');
                td.innerHTML=el.date;
                tr.append(td)
            }
            {
                let td=document.createElement('td');
                td.innerHTML=el.time;
                tr.append(td)
            }
            {
                let td=document.createElement('td');
                let b1=document.createElement('button');
                let b2=document.createElement('button');
                b1.innerText='Update';
                b2.innerText='Delete';
                b1.classList.add('upt-btn');
                b2.classList.add('del-btn');
                td.classList.add('btns');
                b1.setAttribute('sid', el._id);
                b1.addEventListener('click', function (e) {
                    e.preventDefault();
                    let id = el._id;
                    let saminar = saminars.find(el =>  el._id === id);
                    if (!saminar) return alert('Unknown error 2');
                    let f = container.querySelector('form');
                    f.querySelector('#saminar_name').value=saminar.title;
                    f.querySelector('#saminar_info').value = saminar.description;
                    f.querySelector('#saminar_location').value=saminar.location;
                    container.querySelector('.popup').classList.remove('hidden');
                    container.querySelector('.popup').classList.add('active');
                    container.querySelector('.popup').querySelector('form').setAttribute('mode', 'update');
                    container.querySelector('.popup').querySelector('[type="submit"]').innerHTML = 'Update';
                    container.querySelector('.popup').querySelector('form').setAttribute('sid', id);
                });
                b2.setAttribute('sid', el._id);
                b2.addEventListener('click',async function (e) {
                    try {
                        if (deletingSaminars) return;
                        deletingSaminars = true;
                        e.preventDefault();
                        let id = el._id;
                        e.target.style.opacity = .65;
                        if ((await fetch(api + '/' + id, { method: 'delete' })).status === 204) {
                            saminars=saminars.filter(function (el) {
                                if (el._id !== id) return el;
                            });
                            LoadSaminars();
                        }
                    } catch (error) {
                        console.log(error);
                    } finally{
                        deletingSaminars=false;
                        e.target.style.opacity = 1;
                    }
                    
                });
                td.append(b1);
                td.append(b2);
                tr.append(td);
            }
            container.querySelector('tbody').appendChild(tr);
        });
    }


    document.querySelector('#add-saminar-button').addEventListener('click',function(e=new Event('click')){
        e.preventDefault();
        container.querySelector('.popup').classList.remove('hidden');
        container.querySelector('.popup').classList.add('active');
        container.querySelector('.popup').querySelector('form').setAttribute('mode', 'create');
        container.querySelector('.popup').querySelector('[type="submit"]').innerHTML='create';
    })
    container.querySelector('.close-popup').addEventListener('click',closePopup);
        function closePopup(e=new Event('click')){
            e.preventDefault();
            container.querySelector('.popup').classList.add('hidden');
            container.querySelector('.popup').classList.remove('active');
            container.querySelector('.popup').querySelectorAll('textarea').forEach(function (el) {
                el.value=null
            });
            container.querySelector('.popup').querySelectorAll('input').forEach(function (el) {
                if (el.type==='file') {
                    let inp=document.createElement('input');
                    inp.type ='file';
                    inp.accept='image/*';
                    inp.id='saminar_image';
                    el.replaceWith(inp);
                    return
                } else {
                    el.value=null
                }
            });
            container.querySelector('.popup').querySelector('form').setAttribute('mode', 'create')
        }
    container.querySelector('form').addEventListener('submit',async function (event) {
        try {
            event.preventDefault();
            let f = container.querySelector('form');
            let title =f.querySelector('#saminar_name').value;
            let files =f.querySelector('#saminar_image').files;
            let description =f.querySelector('#saminar_info').value;
            let date =f.querySelector('#saminar_date').value;
            let time =f.querySelector('#saminar_time').value;
            let location =f.querySelector('#saminar_location').value;
            if (f.getAttribute('mode') ==='create') {
                if (files.length === 0) {
                    return alert('Please add a Image File')
                }
                if (files[0].type.includes('image/')) {
                    try {
                        event.target.style.opacity =.6;
                        let f = new FormData();
                        f.append('img', files[0]);
                        f.append('title', title);
                        f.append('description', description);
                        f.append('date', date);
                        f.append('time', time);
                        f.append('location', location);
                        let response = await fetch(api, { method: 'POST', body: f });
                        if (response.status === 201) {
                            alert('saminar created successfully');
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        event.target.style.opacity =1;
                        closePopup();
                        return;
                    }
                }
                return;
            }
            let sid= container.querySelector('form').getAttribute('sid');
            if (!sid) return  alert('Unkown error 1');
            if (files.length === 0) {
                try {
                    fetch(api + '/' + sid, {
                        method :'put', 
                        headers :{'content-type':'application/json'},
                        body: JSON.stringify({ title, description, date, time, location })
                    })
                } catch (error) {
                    console.log(error);
                } finally {
                    closePopup()
                    return;
                }
                
            }
            if (files[0].type.includes('image/')) {
                try {
                    let f = new FormData();
                    f.append('img', files[0]);
                    f.append('title', title);
                    f.append('description', description);
                    f.append('date', date);
                    f.append('time', time);
                    f.append('location', location);
                    fetch(api+'/'+sid, { method: 'put', body: f })
                } catch (error) {
                    console.log(error);
                } finally {
                    closePopup();
                    return;
                }
            }
        } catch (error) {
            console.log(error);
        }
    })

}