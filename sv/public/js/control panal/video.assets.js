
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/


{

    let containar = document.querySelector('#assets_container');
    let seen = false, origin = window.location.origin;
    let videoArray = [];
    let videoList = containar.querySelector('.video-list');
    // let addVideoButton = containar.querySelector('#add-video-btn')
    let videoContainer = containar.querySelector('#video-container');


    let observer = new IntersectionObserver(async function (entries) {
        if (entries[0].isIntersecting && !seen) {
            seen = true;
            let res = await fetch(origin + '/api/api_s/assets/video/control-panal');
            if (res.status === 200) {
                videoArray = await res.json();
                orgTable()
            }
        }
    });
    observer.observe(videoList)


    function orgTable() {
        videoContainer.innerHTML = null;
        for (let i = 0; i < videoArray.length; i++) {
            let v = videoArray[i];
            videoContainer.innerHTML += (`
                <div class="video-row">
                <input type="text" class="title-input" placeholder="${v.title}" disabled>
                <input type="text" class="description-input" placeholder="${v.description}" disabled>
                <input type="text" class="iframe-input" placeholder="${encodeURI(v.iframe)}" disabled>
                <button class="icon-btn delete-btn" dlt_id="${v.id}">
                    <i class="fas fa-trash"></i>
                </button>
                </div>`
            );
        }

        videoContainer.querySelectorAll('.delete-btn').forEach(function (element) {
            element.addEventListener('click', DeleteRow);
        })
        AddInputBox()
    }



    function DeleteRow(event = new Event('click')) {
        event.preventDefault();
        let target = event.target.tagName === 'I' ? event.target.parentElement : event.target;
        let id = target.getAttribute('dlt_id');
        videoArray = videoArray.filter(function (el) { if (el.id != id) return el; });
        orgTable();
        return fetch(origin + '/api/api_s/assets?id=' + id, { method: 'delete' });
    }


    let addingVideos = false;
    function AddInputBox() {
        const newRow = document.createElement("div");
        newRow.setAttribute('newRow', '');
        newRow.classList.add("video-row");
        newRow.innerHTML = (`
            <input type="text" class="title-input" placeholder="Enter title" minlength="5" maxlength="100">
            <input type="text" class="description-input" placeholder="Enter description" minlength="5" maxlength="200">
            <input type="text" class="iframe-input" placeholder="Paste iframe code here" minlength="5">
            <button class="add-btn" id="add-video-btn">+Add</button>
        `);
        videoContainer.appendChild(newRow);
        let addButtons = newRow.querySelector('button#add-video-btn');

        addButtons.addEventListener('click', async function (event) {
            event.preventDefault();
            let newRow = containar.querySelector(`[newRow]`);
            let inputs = newRow.querySelectorAll('input');
            let title = inputs[0].value,
            description = inputs[1].value, 
            iframe = inputs[2].value;

            if (!title) makeItRed(inputs[0]);
            if (!description) makeItRed(inputs[1]);
            if (!iframe) makeItRed(inputs[2]);

            if (title.length < 5) makeItRed(inputs[0]);
            if (description.length < 5) makeItRed(inputs[1]);
            if (title.length > 100) makeItRed(inputs[0]);
            if (description.length > 200) makeItRed(inputs[1]);

            { // Iframe test
                let div = document.createElement('div');
                div.innerHTML = iframe;
                let tag = div.querySelector('iframe');
                if (!tag) makeItRed(inputs[2]);
            }
            if (addingVideos) return;
            addingVideos = true;
            event.target.style.opacity = .65;
            try {
                let res = await fetch(origin + '/api/api_s/assets/video', {
                    method: 'post',
                    body: JSON.stringify({ title, description, iframe }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res.status === 202) {
                    let id = (await res.json()).id;
                    videoArray.push({ iframe, id, title, description });
                    orgTable()
                }
            } catch (error) {
                console.log(error);
                alert('Unknown Error , Please Change title or description or code');
                let preBg=event.target.style.background;
                event.target.style.background='red';
                await new Promise((resolve, reject) => { setTimeout(() => resolve(true), 2000) });
                event.target.style.background=preBg;
            } finally {
                event.target.style.opacity = 1;
                addingVideos = false;
            }

        });
    }

    // Delete functionality for existing rows
    containar.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const container = document.getElementById("video-container");
            container.removeChild(this.parentElement);
        });
    });
    function makeItRed(input) {
        input.style.outline = '1.5px solid red';
        input.addEventListener('input', function makeItUnRed(e) {
            e.target.style.outline = 'none';
            e.target.removeEventListener('input', makeItUnRed)
        })
        throw new Error("Input  is Null");
    }
}