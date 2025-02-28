/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/

{
    let container = document.querySelector('#Allient-grand-master-container');

    let AddGrandMasterBtn = container.querySelector('#btnAddGrandMaster');
    const modal = container.querySelector("#addGrandMasterModal");
    const modalClose = modal.querySelector("#modalClose");
    let Masters = [];
    let unSeen = true;
    let observer = new IntersectionObserver(async function (entries) {
        try {
            if (entries[0].isIntersecting && unSeen) {
                unSeen = false;
                let response = await fetch(window.location.origin + '/api/api_s/allience-grand-master');
                if (response.status === 200) {
                    Masters = await response.json();
                    organizeTable()
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
    observer.observe(container)

    function organizeTable() {
        let tableBody = container.querySelector('tbody');
        tableBody.innerHTML=null;
        for (let i = 0; i < Masters.length; i++) {
            const master = Masters[i];
            const row = document.createElement("tr");
            row.innerHTML = (`
                    <td><img src="${master.image}" alt="${master.name}" width="50" height="50"></td>
                    <td>${master.name}</td>
                    <td><img src="${master.organizationLogo}" alt="Organization Logo" width="50" height="50"></td>
                    <td><button class="btn btn-update" gmid="${master._id}">Update</button></td>
                    <td><button class="btn btn-delete" gmid="${master._id}">Delete</button></td>
                    `);
            tableBody.appendChild(row);
        }
        tableBody.querySelectorAll('button').forEach(function (element) {
            element.addEventListener('click', async function (event) {
                event.preventDefault();
                if (event.target.classList.contains("btn-update")) {
                    let modal=container.querySelector(`#updateGrandMasterModal`);
                    let master = Masters.find(element => element._id == event.target.getAttribute('gmid'));
                    modal.querySelector('#allient-grand-master-name').value=master.name;
                    modal.querySelector('#allient-grand-master-title').value=master.title;
                    modal.querySelector(`[for="update-allient-grand-master-Image"]`).querySelector('img').src=master.image;
                    modal.querySelector(`#grand-master-Image-url`).value=master.image;
                    modal.querySelector(`[for="update-allient-grand-master-orgLogo"]`).querySelector('img').src=master.organizationLogo;
                    modal.querySelector(`#orgLogoUrl`).value=master.organizationLogo;
                    modal.querySelector(`#orgLink`).value= master.OrganizationLink;
                    modal.querySelector(`#grandMasterInfo`).value= master.info;
                    modal.setAttribute('gmid', event.target.getAttribute('gmid'));
                    modal.style.display='flex';
            
                    return;
                } else {
                    let id = event.target.getAttribute('gmid');
                    let isDeleted = (await fetch(window.location.origin + '/api/api_s/allience-grand-master/' + id, { method: 'delete' })).status === 200;
                    if (isDeleted) {
                        let btn = tableBody.querySelector(`[gmid="${id}"]`).parentNode.parentElement.remove();
                        return;
                    } else return alert('failed remove grand master from allience page');

                }
            })
        })

    }


    AddGrandMasterBtn.addEventListener('click', function (event = new CustomEvent('click')) {
        event.preventDefault();
        modal.style.display = 'flex';
    });

    modalClose.addEventListener('click', function (event = new CustomEvent('click')) {
        event.preventDefault();
        {
            let urlInput = modal.querySelector(`[id="grand-master-Image-url"]`);
            let img = modal.querySelector(`[for="allient-grand-master-Image"]`).querySelector('img');
            urlInput.value = '';
            img.src = '/img/avatar.png';
        }
        {
            let urlInput = modal.querySelector(`[id="orgLogoUrl"]`);
            let img = modal.querySelector(`[for="allient-grand-master-orgLogo"]`).querySelector('img');

            urlInput.value = '';
            img.src = '/img/org.png';
        }
        modal.style.display = 'none';
    });

    modal.querySelector('#allient-grand-master-Image').addEventListener('change', async function (event) {
        try {
            let urlInput = modal.querySelector(`[id="grand-master-Image-url"]`);
            if (event.target.files.length === 0) {
                urlInput.value = '';
                modal.querySelector(`[for="allient-grand-master-Image"]`).querySelector('img').src = '/img/avatar.png';
            }
            let form = new FormData();
            form.append('img', event.target.files[0]);
            modal.querySelector(`[for="allient-grand-master-Image"]`).querySelector('img').src = '/img/spinner.svg'
            let response = await fetch('/api/api_s/allience-grand-master/image', { method: 'post', body: form });
            if (response.status === 200) {
                let url = await response.text();
                modal.querySelector(`[for="allient-grand-master-Image"]`).querySelector('img').src = url;
                urlInput.value = url;
            } else {
                urlInput.value = '';
                modal.querySelector(`[for="allient-grand-master-Image"]`).querySelector('img').src = '/img/avatar.png';
                alert('Failed to Upload Image')
            }
        } catch (error) {
            console.log(error);
        }
    });


    modal.querySelector('#allient-grand-master-orgLogo').addEventListener('change', async function (event) {
        let urlInput = modal.querySelector('#orgLogoUrl');
        let img = modal.querySelector(`[for="allient-grand-master-orgLogo"]`).querySelector('img');

        try {
            if (event.target.files.length === 0) {
                urlInput.value = '';
                img.src = '/img/avatar.png';
            }
            let form = new FormData();
            form.append('img', event.target.files[0]);
            img.src = '/img/spinner.svg'
            let response = await fetch('/api/api_s/allience-grand-master/image', { method: 'post', body: form });
            if (response.status === 200) {
                let url = await response.text();
                img.src = url;
                urlInput.setAttribute('value', url);
                return;
            } else {
                urlInput.value = '';
                img.querySelector('img').src = '/img/avatar.png';
                alert('Failed to Upload Image')
            }
        } catch (error) {
            console.log(error);
            urlInput.value = '';
            img.src = '/img/org.png';
        }
    });

    modal.querySelector('form#addGrandMasterForm').addEventListener('submit', async function (event) {
        try {
            event.preventDefault();
            if (!confirm('Do You want to add Grand Master Info on Allience Page?')) return;
            let form = modal.querySelector('form#addGrandMasterForm');
            let name = form.querySelector('#allient-grand-master-name').value;
            let title = form.querySelector('#allient-grand-master-title').value;
            let image = form.querySelector('#grand-master-Image-url').value;
            let organizationLogo = form.querySelector('#orgLogoUrl').value;
            let OrganizationLink = form.querySelector('#orgLink').value;
            let info = form.querySelector('textarea').value;

            let response = await fetch('/api/api_s/allience-grand-master/', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ name, title, image, organizationLogo, OrganizationLink, info })
            });
            if (response.status === 201) {
                alert('Grand Master Added To Allience Page SuccessFully');
                console.log({Masters});
                let _id = await response.text();
                Masters.push({_id ,name, title, image, organizationLogo, OrganizationLink, info  });
                organizeTable();
                console.log({Masters});

                try {
                    let urlInput = modal.querySelector(`[id="grand-master-Image-url"]`);
                    let img = modal.querySelector(`[for="allient-grand-master-orgLogo"]`).querySelector('img');
                    urlInput.value = '';
                    img.src = '/img/avatar.png';
                } catch (error) { console.error(error) }
                try {
                    let urlInput = modal.querySelector(`[id="orgLogoUrl"]`);
                    let img = modal.querySelector(`[for="allient-grand-master-Image"]`).querySelector('img')
                    urlInput.value = '';
                    img.src = '/img/org.png';
                } catch (error) { console.error(error) }
                modal.style.display = 'none';

                return;
            } else {
                console.log((await response.json()));
                return alert('Failed to add Grand Master Because of an Unknown error, Please make sure all the feilds are valid');
            }
        } catch (error) {
            return alert('Failed to add Grand Master Because of an Unknown error, Please make sure all the feilds are valid');
        }
    });

    {
        const modal = container.querySelector("#updateGrandMasterModal");
        const modalClose = modal.querySelector("#modalClose");
        const form = modal.querySelector("form");
        modalClose.addEventListener('click', function (event = new CustomEvent('click')) {
            event.preventDefault();
            {
                let urlInput = modal.querySelector(`[id="grand-master-Image-url"]`);
                let img = modal.querySelector(`[for="update-allient-grand-master-Image"]`).querySelector('img');
                urlInput.value = '';
                img.src = '/img/avatar.png';
            }
            {
                let urlInput = modal.querySelector(`[id="orgLogoUrl"]`);
                let img = modal.querySelector(`[for="update-allient-grand-master-orgLogo"]`).querySelector('img');
    
                urlInput.value = '';
                img.src = '/img/org.png';
            }
            modal.style.display = 'none';
        });

        form.querySelector('#update-allient-grand-master-Image').addEventListener('change', async function (event) {
            try {
                let urlInput = form.querySelector(`[id="grand-master-Image-url"]`);
                let previousUrl = urlInput.value;
                if (event.target.files.length === 0) {
                    urlInput.value = previousUrl;
                    form.querySelector(`[for="update-allient-grand-master-Image"]`).querySelector('img').src = previousUrl;
                }
                let f = new FormData();
                f.append('img', event.target.files[0]);
                form.querySelector(`[for="update-allient-grand-master-Image"]`).querySelector('img').src = '/img/spinner.svg';
                let response = await fetch('/api/api_s/allience-grand-master/image', { method: 'post', body: f });
                if (response.status === 200) {
                    let url = await response.text();
                    form.querySelector(`[for="update-allient-grand-master-Image"]`).querySelector('img').src = url;
                    urlInput.value = url;
                } else {
                    urlInput.value = previousUrl;
                    form.querySelector(`[for="update-allient-grand-master-Image"]`).querySelector('img').src = previousUrl;
                    alert('Failed to Upload Image');
                }
            } catch (error) {
                console.log(error);
            }
        });
    

        form.querySelector('#update-allient-grand-master-orgLogo').addEventListener('change', async function (event) {
            let urlInput = form.querySelector('#orgLogoUrl');
            let img = form.querySelector(`[for="update-allient-grand-master-orgLogo"]`).querySelector('img');
            let previousUrl = urlInput.value;
            try {
                if (event.target.files.length === 0) {
                    urlInput.value = previousUrl
                    img.src =previousUrl;
                }
                let f = new FormData();
                f.append('img', event.target.files[0]);
                img.src = '/img/spinner.svg';
                let response = await fetch('/api/api_s/allience-grand-master/image', { method: 'post', body: f });
                if (response.status === 200) {
                    let url = await response.text();
                    img.src = url;
                  
                    urlInput.value=url;
                    return;
                } else {
                    urlInput.value = previousUrl;
                    img.querySelector('img').src = previousUrl;
                    alert('Failed to Upload Image')
                }
            } catch (error) {
                console.log(error);
                urlInput.value = previousUrl;
                img.src = previousUrl;
            }
        });
    
        form.addEventListener('submit', async function (event) {
            try {
                event.preventDefault();
                if (!confirm('Do You want Upload Grand Master Info to Allience Page?')) return;
            
                let name = form.querySelector('#allient-grand-master-name').value;
                let title = form.querySelector('#allient-grand-master-title').value;
                let image = form.querySelector('#grand-master-Image-url').value;
                let organizationLogo = form.querySelector('#orgLogoUrl').value;
                let OrganizationLink = form.querySelector('#orgLink').value;
                let info = form.querySelector('textarea').value;
                let gmid= modal.getAttribute('gmid');
                let response = await fetch('/api/api_s/allience-grand-master/' + gmid, {
                    method: 'put',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ name, title, image, organizationLogo, OrganizationLink, info })
                });
                if (response.status === 201) {
                    alert('Grand Master Updated To Allience Page SuccessFully');

                    Masters = Masters.map(function (element) {
                        if (element._id == gmid) {
                            return ({ _id:gmid, name, title, image, organizationLogo, OrganizationLink, info });
                        } else return element;
                    })
                    organizeTable();

                    modal.style.display = 'none';
                    try {
                        let urlInput = modal.querySelector(`[id="grand-master-Image-url"]`);
                        let img = modal.querySelector(`[for="allient-grand-master-orgLogo"]`).querySelector('img');
                        urlInput.value = '';
                        img.src = '/img/avatar.png';
                    } catch (error) { console.error(error); }
                    try {
                        let urlInput = modal.querySelector(`[id="orgLogoUrl"]`);
                        let img = modal.querySelector(`[for="allient-grand-master-Image"]`).querySelector('img')
                        urlInput.value = '';
                        img.src = '/img/org.png';
                    } catch (error) { console.error(error); }


                    return;
                } else {
                    console.log((await response.json()));
                    return alert('Failed to Update Grand Master Because of an Unknown error, Please make sure all the feilds are valid');
                }
            } catch (error) {
                return alert('Failed to Update Grand Master Because of an Unknown error, Please make sure all the feilds are valid');
            }
        });

    }
}