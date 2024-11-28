/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
    let containar=document.querySelector('#Country_Representative_container');
    
    let
    not_requesting_to_allow=true,
    seen=false,
    table =containar.querySelector('table'),
    representatives =[];

    
    let observer =new IntersectionObserver(async function (entries) {
        let countriesAndFlags = [
            ["USA", "/img/flag/usa.png"],
            ["India", "/img/flag/india.png"],
            ["Canada", "/img/flag/canada.png"],
            ["Australia", "/img/flag/australia.png"],
            ["South Korea", "/img/flag/skorea.png"],
            ["Germany", "/img/flag/germany.png"],
            ["China", "/img/flag/china.png"],
            ["Brazil", "/img/flag/brazil-305531_640.png"],
            ["United Kingdom", "/img/flag/UnitedKingdom.png"],
            ["UAE", "/img/flag/UAE.png"],
            ["Italy", "/img/flag/italy.png"],
            ["Switzerland", "/img/flag/Switzerland.png"],
            ["Netherlands", "/img/flag/Netherlands.png"],
            ["Sweden", "/img/flag/Sweden.png"],
            ["Singapore", "/img/flag/singapore.png"],
            ["Russia", "/img/flag/russia.png"],
            ["argentina", "/img/flag/argentina.png"],
            ["Japan", "/img/flag/japan.png"],
            ["south africa", "/img/flag/south-africa.png"],
            ["bangladesh", "/img/flag/bangladesh.png"],
            ["pakistan", "/img/flag/pakistan.png"],
            ["vietnam", "/img/flag/vietnam.png"]
        ];
        if (entries[0].isIntersecting && !seen) {
            seen=true;
            fetch(window.location.origin+'/api/api_s/country-representative-for-admin')
            .then(function (response) {
                return response.json()
            })
            .then(function (response) {
                let {data}=response;
                representatives=data;
                let insertionHtml=``;
                for (let i = 0; i < data.length; i++) {
                    let {email,name ,id,dateOfBirth,shortDescription ,country ,phone ,description,thumbUrl,approved_by_admin } = data[i];                    
                    let countries=countriesAndFlags.find(el=> {
                        if (el[0].toLowerCase() === country.toLowerCase()) {
                            return el
                        }
                    });
                    let flag=countries ? countries[1]:'/img/flag/flag.png'
                    insertionHtml+=`
                    <tr>
                        <td>
                            ${i+1}
                        </td>
                        <td>
                            <img src="${thumbUrl}" alt="country representative image" >
                        </td>
                        <td>
                            ${name}
                        </td>
                        <td>
                            <img src="${flag}" alt="country flag" >
                        </td>
                        <td shortDescription >
                            <p paragraph_representative_id="${id}"  >${shortDescription}...</p>
                         
                        </td>
                        <td>
                            <button
                            id="${Math.floor(Math.random()*38243883)}"
                            representative_id="${id}"
                            style="background-color:${approved_by_admin ? 'Green' :'red'}"
                            >${approved_by_admin ? 'Active' : 'NotActive'}</button>

                        </td>
                    </tr>
                    `;
                }
                table.innerHTML+=insertionHtml;
                table.querySelectorAll('button').forEach(function (element) {
                    element.addEventListener('click', function (event) {
                        let id =event.target.getAttribute('representative_id');
                        id =Number(id);
                        let representative=representatives.find(
                            function (element) {
                                if (element.id===id) {
                                    return element;
                                }
                            }
                        );
                        if (!representative) return 
                        if (not_requesting_to_allow) {
                            let btn=table.querySelector(`[representative_id="${representative.id}"]`);
                            btn.style.opacity=.65;
                            not_requesting_to_allow=false;
                            let url=window.location.origin +'/api/api_s/' +((representative.approved_by_admin===true) ? 'disAllow-representative' : "allow-representative");
                            fetch( url,{
                                method :'PUT',
                                body:JSON.stringify({
                                    id :representative.id
                                }),
                                headers :{
                                    'Content-Type':'application/json'
                                }
                            })
                            .then(function (response) {
                                if (response.status===200) {
                                    let {approved_by_admin}=representative;
                                    if (approved_by_admin) representative.approved_by_admin=false ;
                                    if (!approved_by_admin) representative.approved_by_admin=true;
                                    representatives=representatives.map(function (element) {
                                        if (element.id===representative.id) {
                                            element.approved_by_admin =representative.approved_by_admin;
                                            return element
                                        }
                                        return element
                                    });
                                    btn.innerHTML=btn.innerHTML=( representative.approved_by_admin === true ? 'Active' : 'NotActive');
                                    btn.style.backgroundColor=representative.approved_by_admin ? 'Green' :'red';
                                }
                            })
                            .catch(error => {
                                console.error('Failed to fetch api');
                                console.log(error)
                            })
                            .finally(function () {
                                not_requesting_to_allow=true
                                btn.style.opacity=1;
                            })
                        }
                    })
                })
                table.querySelectorAll('p').forEach(function (element) {
                    let id =element.getAttribute('paragraph_representative_id');
                    id=Number(id);
                    let representative=representatives.find(function(element) {
                        console.log({element});
                        
                        if (element.id===id)  return element
                    });
                    if (!representative) return
                    element.onmouseleave=function (event) { 
                        element.innerHTML=representative.shortDescription+'...';
                    }
                    element.onmouseenter=function (event) {
                        element.innerHTML=representative.description;
                    }
                })
            })
        }
    });
    observer.observe(containar)
}