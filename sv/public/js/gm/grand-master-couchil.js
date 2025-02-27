/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/


{


    let gm_section = document.querySelectorAll('[gm_section]')


    function ChangeSection(index) {
        gm_section.forEach((el, ind) => (ind === index) ? el.style.display = 'flex' : el.style.display = 'none');
    }


    document.addEventListener('click', e => {
        if (e.target.className === 'navigation') {
            e.preventDefault()
            // if (e.target.tagName === 'A' && e.target.parentNode.className === "gm-nav-main") 
            if (e.target.id === 'massage_href') return ChangeSection(0);
            if (e.target.id === 'events_href') return ChangeSection(1);
            if (e.target.id === 'notes_href') return ChangeSection(2);
            if (e.target.id === 'settings_href') return ChangeSection(3);
            if (e.target.id === 'upload-event-button') return ChangeSection(4);
        }

        if (e.target.id === 'upload-event-button') return ChangeSection(4)
        if (e.target.tagName === 'BUTTON') e.preventDefault()
    })
}




