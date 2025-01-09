/* 
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allah,  By Allahs Marcy,  I willearn success
*/

window.addEventListener('load',
    function (event) {
        this.fetch(window.location.origin + '/api/api_s/testimonials')
            .then(res => res.json())
            .then(
                function (response) {
                    if (!response.data) return
                    let { data } = response;
                    let insertionHtml1 = ``;
                    let insertionHtml2 = ``;
                    for (let i = 0; i < data.length; i++) {
                        let { appreciation, appreciator, appreciator_image_url, appreciation_position , date} = data[i];
                        if ((i + 1) % 2 !== 0) {
                            let testimonialHtml = `
                            <div class="testimonial" id="testimonial-no-${date}">
                               <div class="div2">
                                   <i class="fa-solid fa-quote-left"></i>
                                   <p>${appreciation}</p>
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
                            insertionHtml1 += testimonialHtml;
                        }
                        if ((i + 1) % 2 === 0) {
                            let testimonialHtml = `
                                <div class="testimonial" id="testimonial-no-${date}">
                                   <div class="div2">
                                       <i class="fa-solid fa-quote-left"></i>
                                       <p>${appreciation}</p>
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
                            insertionHtml2 += testimonialHtml;
                        };
                       
                    }
                    document.querySelector(`.testimonials1`).innerHTML = insertionHtml1;
                    document.querySelector(`.testimonials2`).innerHTML = insertionHtml2;
                }
            )
            .catch(function (error) {
                console.error(error)
            })
    }
)