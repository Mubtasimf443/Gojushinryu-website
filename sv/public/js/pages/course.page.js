/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/



let
    popup1 = document.querySelector('#popup-type1'),
    popup2 = document.querySelector('#popup-type2'),
    modeMap = new Map([[1, 'Our Regular classes']], [[2, 'Online Martial Art Classes']], [[3, 'Our Seminars']], [[4, 'Our Women Defence Classes']], [[5, 'Bhangra Fitness Class for All Ages']]);


/******************************* Courses  ******************************/
{ //regular classes
    let course = document.querySelector(`[id="course-our-regular-classes"]`);
    let enrollBtn = course.querySelector('.enroll-btn');

    enrollBtn.addEventListener('click', function (event) {
        event.preventDefault();
        popup1.classList.add('active');
        popup1.setAttribute('mode', '1');
        popup1.querySelector(`#base-price`).innerHTML = Number(globlal_fees_of_regular_class).toFixed(2);
        popup1.querySelector(`#gst-amount`).innerHTML = Number((globlal_fees_of_regular_class * (gst_rate / 100))).toFixed(2);
        popup1.querySelector(`#total-price`).innerHTML = globlal_fees_of_regular_class + (globlal_fees_of_regular_class * (gst_rate / 100));
    });

    let detailsBtn=course.querySelector('.details-btn');
    detailsBtn.addEventListener('click', function(event){
        event.preventDefault();
        return setPopupDetails(`[detailspopup1]`,dates_of_regular_class )
    });

}
{ //our online classes
    let course = document.querySelector(`[id="Our-Online-Martial-Art-Classes"]`);
    let contactBtn = course.querySelector('.enroll-btn');
    contactBtn.addEventListener('click', function (event = new Event('click')) {
        event.preventDefault();
        popup2.classList.add('active');
        popup2.setAttribute('mode', '2');
    });

    let detailsBtn=course.querySelector('.details-btn');
    detailsBtn.addEventListener('click', function(event){
        event.preventDefault();
        return setPopupDetails(`[detailspopup2]`,dates_of_online_classes )
    });

}


{ // Our Seminars
    let course = document.querySelector(`[id="Our-Seminars"]`);
    let contactBtn = course.querySelector('.enroll-btn');
    contactBtn.addEventListener('click', function (event = new Event('click')) {
        event.preventDefault();
        popup2.classList.add('active');
        popup2.setAttribute('mode', '3');
    })
}
{ // our Women Defence Classes
    let course = document.querySelector(`[id="our-women-defence-classes"]`);
    let contactBtn = course.querySelector('.enroll-btn');
    contactBtn.addEventListener('click', function (event = new Event('click')) {
        event.preventDefault();
        popup2.classList.add('active');
        popup2.setAttribute('mode', '4');
    })
    let detailsBtn=course.querySelector('.details-btn');
    detailsBtn.addEventListener('click', function(event){
        event.preventDefault();
        return setPopupDetails(`[detailspopup4]`,dates_of_women_defence_classes );
    });

}


{ // Bhangra Fitness Class for All Ages
    let course = document.querySelector(`[id="Bhangra-Fitness-Class-for-All-Ages"]`);
    let enrollBtn = course.querySelector('.enroll-btn');

    enrollBtn.addEventListener('click', function (event) {
        event.preventDefault();
        popup1.classList.add('active');
        popup1.setAttribute('mode', '5');
        popup1.querySelector(`#base-price`).innerHTML = (globlal_fees_of_bhangra_fitness).toFixed(2);
        popup1.querySelector(`#gst-amount`).innerHTML = (globlal_fees_of_bhangra_fitness * (gst_rate / 100)).toFixed(2);
        popup1.querySelector(`#total-price`).innerHTML =( globlal_fees_of_bhangra_fitness + (globlal_fees_of_bhangra_fitness * (gst_rate / 100))).toFixed(2);
    })
}

document.querySelectorAll('.close-popup').forEach(
    function (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            document.querySelectorAll('.popup').forEach(
                function (element) {
                    if (element.classList.contains('active')) {
                        element.querySelectorAll('input').forEach(function (input) { input.value = null });
                        element.setAttribute('mode', "");
                        element.classList.remove('active');
                    }
                }
            );
        })
    }
)


{ //popup 1

    const v = returnV(popup1);
    let requesting = false;
    let paypalbtn = popup1.querySelector('[id="paypal-btn"]'), stripebtn = popup1.querySelector('[id="stripe-btn"]');
    async function registerCourse(e = new Event('click')) {
        let btn = e.target; if (requesting) { return }; btn.style.transition = 'opacity .7s ease';
        try {
            e.preventDefault();
            let payment_method = (e.target.id === 'paypal-btn' ? 'paypal' : 'stripe'), mode = popup1.getAttribute('mode');
            let [name, phone, email, country, city, district, zipcode, road_no] = [v.t('[placeholder="Your Name"]'), v.t('[placeholder="Your Phone Number"]'), v.t('[placeholder="Your Email"]'), v.t('[placeholder="Country"]'), v.t('[placeholder="City"]'), v.t('[placeholder="District"]'), v.n('[placeholder="Post-code"]'), v.t('[placeholder="Road No/ Village"')];
            btn.style.opacity = .7;
            requesting = true;
            let response = await fetch(window.location.origin + '/api/l-api/course/purchase/', {
                method: 'POST',
                body: JSON.stringify({ name, phone, email, country, city, district, zipcode, payment_method, road_no, mode }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 201) {
                let url = (await response.json()).url;
                window.location.assign(url);
            } else {
                let p = popup1.querySelector('.form-info');
                p.innerHTML = 'Sorry , Failed in course registation';
                p.setAttribute('style', 'color:red');
                popup1.querySelectorAll('input').forEach(function (element) {
                    function removeRedInfo(e = new Event('change')) {
                        let p = popup1.querySelector('.form-info');
                        p.innerHTML = null;
                        p.setAttribute('style', 'display: none;');
                        e.target.removeEventListener('change', removeRedInfo);
                    }
                    element.addEventListener('change', removeRedInfo);
                });
            }
        } catch (error) {
            console.log({ error });
        } finally {
            requesting = false;
            btn.style.opacity = 1;
        }
    }

    paypalbtn.addEventListener('click', registerCourse);
    stripebtn.addEventListener('click', registerCourse);
}


{ // popup 2
    let contactBtn = popup2.querySelector(`#contact-popup-btn`);
    let requesting = false;
    contactBtn.addEventListener('click', async function (event = new Event('click')) {
        try {
            event.preventDefault();
            if (requesting) return;
            let v = returnV(popup2);
            let [name, phone, email, country, city, district, zipcode, road_no] = [v.t('[placeholder="Your Name"]'), v.t('[placeholder="Your Phone Number"]'), v.t('[placeholder="Your Email"]'), v.t('[placeholder="Country"]'), v.t('[placeholder="City"]'), v.t('[placeholder="District"]'), v.n('[placeholder="Post-code"]'), v.t('[placeholder="Road No/ Village"')];
            let mode = popup2.getAttribute('mode');
            contactBtn.style.opacity = .75;
            requesting = true;
            let response = await fetch(window.location.origin + '/api/api_s/course/apply/contact', {
                method: 'POST',
                body: JSON.stringify({ name, phone, email, country, city, district, zipcode, road_no, mode }),
                headers: { 'Content-Type': 'application/json' }
            });
            contactBtn.style.opacity = 1;
            requesting = false;

            if (response.status === 202) {
                popup2.classList.contains('active') && popup2.classList.remove('active');

                const confirmationPopup = document.getElementById("confirmation-popup");

                function showConfirmationPopup() {
                    confirmationPopup.classList.add("show");
                    setTimeout(() => closeConfirmationPopup(), 3500);
                }

                function closeConfirmationPopup() { confirmationPopup.classList.remove("show") };
                showConfirmationPopup();
                confirmationPopup.querySelectorAll('button').forEach(
                    function (element) {
                        element.addEventListener('click', function (event = new Event('click')) {
                            event.preventDefault();
                            closeConfirmationPopup();
                        })
                    }
                );
            } else {

                let p = popup2.querySelector('.form-info');
                let txt = p.innerHTML;
                let color = p.style.color;
                let { massage } = await response.json().catch(error => ({ error: 'json parse error' }));
                p.innerHTML = 'Sorry failed request Contacting to the Grand Master. ';
                if (massage) { p.innerHTML += ('Because :' + massage) }
                p.style.color = 'red';
                setTimeout(function () {
                    p.innerHTML = txt;
                    p.style.color = color;
                }, 5000);
            }
        } catch (error) {
            console.log(error);
        } finally {

        }
    })
}


function returnV(doc) {
    class V {
        constructor(container = document) {
            this.container = container;
        }
        t(val) {
            val = this.container.querySelector(val);
            if (!val) throw `val : ${val} is not a valid selector`;
            if (!val.value?.trim()) {
                val.style.outline = '2px solid red';
                val.addEventListener('change', function (e) {
                    e.target.style.outline = 'none';
                });
                throw 'their is no value of val';
            }
            return val.value?.trim();
        }
        n(val) {
            val = this.container.querySelector(val);
            if (!val) throw `val : ${val} is not a valid selector`;
            if (val.type !== 'number') val.type = 'number';

            if (!val.valueAsNumber) {
                val.style.outline = '2px solid red';
                val.addEventListener('change', function (e) {
                    e.target.style.outline = 'none';
                });
                throw 'their is no value of val and value of val is ' + val.value;
            }
            return val.valueAsNumber;
        }
        dn(val) {
            val = this.container.querySelector(val);
            if (!val) throw `val : ${val} is not a valid selector`;
            if (val.type !== 'date') val.type = 'date';
            if (!val.valueAsNumber) {
                val.style.outline = '2px solid red';
                val.addEventListener('change', function (e) {
                    e.target.style.outline = 'none';
                });
                throw 'their is no value of val and value of val is ' + val.value;
            }
            return val.valueAsNumber;
        }
    }
    return (new V(doc));
}


window.addEventListener('load', function (event) {
    let cards = this.document.querySelectorAll('.course-card');

    //regular classes
    let total = globlal_fees_of_regular_class + (globlal_fees_of_regular_class * (gst_rate / 100));
    cards[0].querySelector(`[fees1]`).innerHTML = ` Fees:$${total.toFixed(2)} ($${globlal_fees_of_regular_class.toFixed(2)} + 5% gst)`;


    // Bhangra Fitness Class for All Ages
    total = globlal_fees_of_bhangra_fitness + (globlal_fees_of_bhangra_fitness * (gst_rate / 100));
    cards[4].querySelector(`[fees4]`).innerHTML = ` Fees:$${total.toFixed(2)} ($${globlal_fees_of_bhangra_fitness.toFixed(2)} + 5% gst)`;

});


function setPopupDetails(query , dateString) {
    let popup=document.querySelector(query);
    popup.style.display = 'block';
    popup.querySelector('#close-detailspopup-btn').addEventListener('click', function (event =new Event('click')) {
        event.preventDefault();
        popup.style.display = 'none';
    });
    const calendarBody = popup.querySelector(`#calendar tbody`);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first day of the month (0 = Sunday, 1 = Monday, ...)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Clear existing rows
    calendarBody.innerHTML = '';

    let day = 1; // Start from the first day of the month
        for (let row = 0; day <= daysInMonth; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 7; col++) {
            const td = document.createElement('td');

            // Check if we are at the beginning of the month
            if (row === 0 && col < firstDayOfMonth) {
                // Empty cells for days before the first of the month
                td.innerHTML = '';
            } else if (day <= daysInMonth) {
                // Fill in the day
                td.innerHTML = day;
                td.classList.add('calendar-day'); // Add a class for styling

                function checkCol(col = 1, date = '') {
                    let array = date.split(',');
                    array = array.map(function (el) { return Number(el) });
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        if (element === col) return true;
                    }
                    return false;
                }
                // Example: Highlight weekends (optional)
                if (checkCol(col, dateString)) {
                    td.classList.add('active');
                }

                day++;
            } else {
                // Empty cells after the last day of the month
                td.innerHTML = '';
            }

            tr.appendChild(td);
        }
        calendarBody.appendChild(tr);
    }
}

