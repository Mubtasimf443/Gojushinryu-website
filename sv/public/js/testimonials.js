/* 
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allah,  By Allahs Marcy,  I willearn success
*/

window.addEventListener('load',
    function (event) {
        this.fetch(window.location.origin+'/api/api_s/testimonials')
        .then(res=>res.json())
        .then(
            function (response) {
                if (!response.data) return 
                let {data}=response;
                let insertionHtml=``;
                for (let i = 0; i < data.length; i++) {
                    let {appreciation,appreciator,appreciator_image_url ,appreciation_position} = data[i];
                    let testimonialHtml=`
                    <div class="testimonial">
                    <div class="div2">
                    <i class="fa-solid fa-quote-left"></i>
                    <p>
                    ${appreciation}
                    </p>
                    <i class="fa-solid fa-quote-right"></i>
                    </div>
                    <div class="div1">
                    <img src="${appreciator_image_url}" alt="student">
                    <div>
                    <strong>${appreciator}</strong>
                    <span style="color:#FF6F3C">${appreciation_position}</span>
                    <hr style="background-color:#FF6F3C" >
                    </div>
                    </div>
                    </div>
                    `;
                    insertionHtml=testimonialHtml+insertionHtml;
                };
                document.querySelector(`.testimonials`).innerHTML=insertionHtml;
            }
        )
        .catch(function (error) {
            console.error(error)
        })
    }
)