/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let data=[]
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
                
                for (let i = 0; i < data.length; i++) {
                    let { name,shortDescription , thumbUrl , country , description } = data[i];
                    let countries=countriesAndFlags.find(el=> {
                        if (el[0].toLowerCase() === country.toLowerCase()) {
                            return el
                        }
                    });
                    let flag=countries ? countries[1]:'/img/flag/flag.png'
                    inserTionHtml+=`
                    <div class="Representative">
                    <img class="img1" src="${thumbUrl}" alt="">
                    <img class="img2" src="${flag}" alt="country flag">
                    <h3>
                    ${name}
                    </h3>
                    <b>
                    ${country}
                    </b>
                    <p>
                    ${shortDescription}...
                    </p>
                    </div>
                    `;
                }
                document.querySelector(`#Representatives`).innerHTML=inserTionHtml;
            }
        })
        .catch(function (error) {
           return console.error(error) 
        });
    })
}