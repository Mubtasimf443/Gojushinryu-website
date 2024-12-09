/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/

{
    let container = document.querySelector('.customLinksContainer');
    let
        table =container.querySelector('table'),
        btn = container.querySelector('.Generate-link-btn'),
        courseBox = container.querySelector('.custom-link-course'),
        memberhsipBox = container.querySelector('.custom-link-memberships'),
        LinkType = container.querySelector('select[id="custom-link-select"]'),
        requesting = false,
        deleting=false,
        updating=false;

    //event lister
    btn.addEventListener('click',
        async function (event) {
            event.preventDefault();
            if (requesting) return
            let linkType = LinkType.selectedOptions[0].value;
            let
                expiringDate = valueNumber(`[custom-link-expiring-date]`),
                emails = getEmails(`[custom-link-reciever-email]`);
            if (linkType === 'Membership') {
                let
                    name = container.querySelector(`[membership_organization_name]`).selectedOptions[0].value,
                    price = valueNumber(`[membership_price]`),
                    type = container.querySelector(`[membership_type]`).selectedOptions[0].value;
                btn.style.opacity = .7;
                fetch(window.location.origin + '/api/l-api/custom-link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 'membership',
                        emails,
                        expiringDate,
                        membership: {
                            name,
                            price,
                            type
                        }
                    })
                })
                    .then(
                        function (response) {
                            console.log({ status: response.status })
                            return response.json();
                        }
                    )
                    .then(
                        function (response) {
                            console.log({ response });
                            setTimeout(() => window.location.reload(), 300);
                        }
                    )
                    .catch(
                        function (error) {
                            console.log({ error })
                        }
                    )
                    .finally(
                        function () {
                            btn.style.opacity = 1;
                            requesting = false;
                        }
                    )
            }
            if (linkType === 'Course') {
                let
                    name = container.querySelector('[course_name]').selectedOptions[0].value,
                    price = valueNumber(`[course_price]`);
                requesting = true;
                btn.style.opacity = .7;
                fetch(window.location.origin + '/api/l-api/custom-link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 'course',
                        emails,
                        expiringDate,
                        course: {
                            name,
                            price
                        }
                    })
                })
                    .then(
                        function (response) {
                            console.log({ status: response.status })
                            return response.json();
                        }
                    )
                    .then(
                        function (response) {
                            console.log({ response });
                            setTimeout(() => window.location.reload(), 300);
                        }
                    )
                    .catch(
                        function (error) {
                            console.log({ error })
                        }
                    )
                    .finally(
                        function () {
                            btn.style.opacity = 1;
                            requesting = false;
                        }
                    )
            }
        }
    )
    function value(select) {
        let dom = container.querySelector(select);
        if (!dom) throw 'selector ' + select + ' is not valid '
        if (!dom.value) {
            dom.style.outline = '2px solid red'
            throw 'value is null of ' + select
        }
        return dom.value
    }
    function valueNumber(select) {
        let dom = container.querySelector(select);
        if (!dom) throw 'selector ' + select + ' is not valid '
        if (!dom.value) {
            dom.style.outline = '2px solid red'
            throw 'value is null of ' + select
        }
        return dom.valueAsNumber
    }
    function getEmails(select) {
        let dom = container.querySelector(select);
        if (!dom) throw 'selector ' + select + ' is not valid '
        let value = dom.value;
        value = value ?? "";
        value = value.split(',');
        return value;
    }
    container.querySelector('#custom-link-select').addEventListener('change',
        function (event) {
            let value = event.target.selectedOptions[0].value;
            if (value === 'Membership') {
                courseBox.style.display = 'none';
                memberhsipBox.style.display = 'initial'
            }
            if (value === 'Course') {
                courseBox.style.display = 'initial';
                memberhsipBox.style.display = 'none'
            }
        }
    )
    courseBox.style.display = 'none';

    let tableSeen = false;
    let observer = new IntersectionObserver(
        function (entries) {
            if (entries[0].isIntersecting && !tableSeen) {
                tableSeen = true;
                fetch(window.location.origin + '/api/api_s/custom-link')
                    .then(
                        function (response) {
                            console.log({ status: response.status })
                            return response.json()
                        }
                    )
                    .then(
                        function (response) {
                            let links = response.links;
                            let inserTionHtml = ``;
                            for (let i = 0; i < links.length; i++) {
                                const {unique_id,expiringDate,linkActivated,custom_link_type } = links[i];
                                inserTionHtml+=`
                                <tr unique_id="${unique_id}" >
                                   <td>${custom_link_type === 'membership' ? links[i].membership.membership_name :links[i].course.name}</td>
                                   <td 
                                   links
                                   style="cursor: copy;text-wrap: wrap;" >${
                                    custom_link_type === 'membership' ? 
                                    window.location.origin+'/custom-links/memberships/'+unique_id
                                    :
                                    window.location.origin+'/custom-links/courses/'+unique_id
                                   }</td>
                                   <td>${new Date(expiringDate).toLocaleString().split(',')[0]}</td>
                                   <td>${custom_link_type === 'membership' ? links[i].membership.membership_price :links[i].course.price}</td>
                                   <td>
                                       <button unique_id="${unique_id}" status="${ linkActivated ? 1: 0 }" updatable style="background :${linkActivated ? 'green':'red'}">${linkActivated ? 'Enabled':'Disabled'}</button>
                                    </td>
                                    <td>
                                       <button unique_id="${unique_id}" delete style="background :red">Delete</button>
                                    </td>
                                </tr>`
                            };
                            table.innerHTML+=inserTionHtml;
                            table.querySelectorAll(`[links]`).forEach(
                                function(element) {
                                    element.onclick=function (event) {
                                        navigator.clipboard.writeText(event.target.innerHTML);
                                        alert('copied')
                                    }
                                }
                            );
                            table.querySelectorAll(`[delete]`).forEach(element => {
                                 element.addEventListener('click', function(event){
                                    if (deleting) return;
                                    deleting=true;
                                    event.preventDefault();
                                    let unique_id=event.target.getAttribute('unique_id');
                                    unique_id =unique_id?Number(unique_id):1234566//Demo Number
                                    event.target.style.opacity=.65;
                                    fetch(window.location.origin + '/api/api_s/custom-link',{
                                        method :'DELETE',
                                        headers :{
                                            'Content-Type': 'application/json'
                                        },
                                        body :JSON.stringify({
                                            unique_id
                                        })
                                    })
                                    .then(
                                        function(response) {
                                            if (response.status===200) table.querySelector(`tr[unique_id="${unique_id}"]`).remove()
                                            if (response.status===400) {
                                                event.target.innerHTML='Failed';
                                                event.target.style.background='red';
                                            }
                                        }
                                    )
                                    .catch(
                                        function(error){
                                            console.log({error});
                                        }
                                    )
                                    .finally(e=> {
                                        event.target.style.opacity=1;
                                        deleting=false
                                    })
                                 })
                            })
                            table.querySelectorAll(`[updatable]`).forEach(
                                function (element) {
                                    element.onclick=function(event){
                                        event.preventDefault();
                                        if (updating) return;
                                        updating=true;

                                        let
                                        unique_id = event.target.getAttribute('unique_id'),
                                        status = event.target.getAttribute('status');
                                        unique_id = unique_id ? Number(unique_id) : Date.now();
                                        status = status ? Number(status) : 1;
                                        let url =window.location.origin + '/api/api_s/custom-link/' + ( status ? "disable": 'enable'  );
                                        //if it it enable and status 1 then we need to disable it
                                        //if it it disable and status 0 then we need to enable it
                                        event.target.style.opacity=.65;
                                        fetch(url, {
                                            method :'PUT',
                                            headers :{
                                                'Content-Type': 'application/json'
                                            },
                                            body :JSON.stringify({
                                                unique_id
                                            })
                                        })
                                        .then(
                                            function(response){
                                                if (response.status===200) {
                                                    if (status) {
                                                        event.target.style.background='red';
                                                        event.target.innerHTML='Disabled';
                                                        event.target.setAttribute('status',0 )
                                                    }
                                                    if (!status) {
                                                        event.target.style.background='green';
                                                        event.target.innerHTML='Enabled';
                                                        event.target.setAttribute('status',1 )
                                                    }
                                                }
                                            }
                                        )
                                        .catch(
                                            function(error){
                                                console.log(error)
                                            }
                                        )
                                        .finally(
                                            function() {
                                                event.target.style.opacity=1;
                                                updating=false
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    )
                    .catch(
                        function (error) {
                            console.log({ error })
                        }
                    )
            }
        }
    );
    observer.observe(container)
}
