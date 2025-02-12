/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/


{
    window.onload = function (event) {
        fetch(window.location.origin + '/api/api_s/events/home', { headers: { 'Cache-Control': 'no-cache' } })
            .then(function (response) {
                return response.json()
            })
            .then(function (response) {
                let { data } = response;
                if (!data) return
                let insertionHtml = '';
                for (let i = 0; i < data.length; i++) {
                    const {
                        thumb,
                        title,
                        description,
                        organizerCountry,
                        eventDate,
                    } = data[i];
                    insertionHtml += `
                <div class="event_box">
                <img src="${thumb}" alt="martial art event image">
                <div class="div1">
                <div>
                <h3>${title}</h3>
                <span>In ${organizerCountry}</span>
                </div>
                <div>
                <span>${new Date(eventDate).toLocaleString(undefined, { month: 'short' })}</span>
                <b>${new Date(eventDate).getDate()}</b>
                </div>
                </div>
                <p>${description}</p>
                <hr>
                <div class="div2">
                <span>Join Now</span>
                <span> <a href="/contact">Contact Us</a></span>
                </div>
                </div>
                `;
                }
                document.getElementById(`event-list`).innerHTML = insertionHtml;
            })
            .catch(function (error) {
                console.error(error)
            })
    }
}