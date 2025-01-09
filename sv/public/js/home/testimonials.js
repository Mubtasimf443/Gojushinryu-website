/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
    window.addEventListener('load', e => setTimeout(
        function (event) {
            fetch(window.location.origin + '/api/api_s/testimonials/home')
                .then(res => res.json())
                .then(
                    function (response) {
                        let { data } = response;
                        let testimonials = document.querySelectorAll('.testimonial');
                        for (let i = 0; i < 2; i++) {
                            testimonials[i].querySelector('p').innerHTML = data[i].appreciation.length > 460 ? data[i].appreciation.substring(0, 460) + `...&nbsp;&nbsp;<a href="/about-us/testimonials#testimonial-no-${data[i].date}" style="color:var(--main-cl) ; font-weight :400;font-style:italic">Read More</a>` :   data[i].appreciation;
                            testimonials[i].querySelector('strong').innerHTML = data[i].appreciator;
                            testimonials[i].querySelector('img').src = data[i].appreciator_image_url;
                            testimonials[i].querySelector('span').innerHTML = data[i].appreciation_position;
                            testimonials[i].querySelector('p').className = '';
                            testimonials[i].querySelector('strong').className = '';
                            testimonials[i].querySelector('img').className = '';
                            testimonials[i].querySelector('hr').className = '';
                            testimonials[i].querySelector('span').className = '';
                            testimonials[i].querySelector('span').style.color = '#FF6F3C';
                            testimonials[i].querySelector('hr').style.background = '#FF6F3C'
                        }

                    }
                )
                .catch(
                    function (error) {
                        console.error(error)
                    }
                )
        }, 1000))
}