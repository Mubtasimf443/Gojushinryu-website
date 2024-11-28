/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let 
    Representatives=document.querySelector(`#Representatives`),
    data=[];
    window.addEventListener('load', function (event) {
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
        this.fetch(this.window.location.origin+'/api/api_s/country-representative')
        .then(response => response.json())
        .then(function (response) {
            if (response.data) {
                data=response.data;
                let inserTionHtml=``;
                console.log(response);
                if (data.length===0) return
                for (let i = 0; i < data.length; i++) {
                    let { name,shortDescription , thumbUrl , country , description ,id} = data[i];
                    let countries=countriesAndFlags.find(el=> {
                        if (el[0].toLowerCase() === country.toLowerCase()) {
                            return el
                        }
                    });
                    let flag=countries ? countries[1]:'/img/flag/flag.png'
                    inserTionHtml+=`
                    <div class="Representative">
                    <img class="img1" src="${thumbUrl}" alt="country Representative image">
                    <img class="img2" src="${flag}" alt="country flag">
                    <h3>
                    ${name}
                    </h3>
                    <b>
                    ${country}
                    </b>
                    <p shortDescription p_id="${id}">
                    ${shortDescription}......
                    </p>
                    </div>
                    `;
                }
                Representatives.innerHTML=inserTionHtml;
                Representatives.querySelectorAll(`[shortDescription]`).forEach(function (htmlElement) {
                    let id =htmlElement.getAttribute('p_id');
                    id=Number(id);
                    let representative=data.find(function (element) {
                        if (element.id===id) return element
                    });
                    
                    htmlElement.onmouseenter=function (event) {
                        htmlElement.innerHTML=representative.description;
                    }
                    htmlElement.onmouseleave=function (event) {
                        htmlElement.innerHTML=representative.shortDescription+'......';
                    }

                })

            }
        })
        .catch(function (error) {
           return console.error(error) 
        });
    })
}