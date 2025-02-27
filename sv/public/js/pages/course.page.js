/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/



let
    popup1 = document.querySelector('#popup-type1'),
    popup2 = document.querySelector('#popup-type2'),
    modeMap = new Map([[1, 'Our Regular classes']], [[2, 'Online Martial Art Classes']], [[3, 'Our Seminars']], [[4, 'Our Women Defence Classes']], [[5, 'Bhangra Fitness Class for All Ages']]);

let studentImage = undefined;

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

    let detailsBtn = course.querySelector('.details-btn');
    detailsBtn.addEventListener('click', function (event) {
        event.preventDefault();
        return setPopupDetails(`[detailspopup1]`, dates_of_regular_class)
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

    let detailsBtn = course.querySelector('.details-btn');
    detailsBtn.addEventListener('click', function (event) {
        event.preventDefault();
        return setPopupDetails(`[detailspopup2]`, dates_of_online_classes)
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
    let detailsBtn = course.querySelector('.details-btn');
    detailsBtn.addEventListener('click', function (event) {
        event.preventDefault();
        return setPopupDetails(`[detailspopup4]`, dates_of_women_defence_classes);
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
        popup1.querySelector(`#total-price`).innerHTML = (globlal_fees_of_bhangra_fitness + (globlal_fees_of_bhangra_fitness * (gst_rate / 100))).toFixed(2);
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
                        let fileInput = element.querySelector('input[type="file"');
                        let img = element.querySelector('.student-image');
                        if (img && fileInput) {
                            img.style.display = 'none';
                            let newFileInput = document.createElement('input');
                            newFileInput.type = 'file';
                            newFileInput.accept = 'image/*';
                            newFileInput.addEventListener('change', c1);
                            fileInput.replaceWith(newFileInput);
                            fileInput = newFileInput;
                            studentImage = undefined;
                        }
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
    let
        coupon = '',
        isValidCoupon = false;
    let studentImageInput = popup1.querySelector('#studentImageInput');

    async function registerCourse(e = new Event('click')) {
        let btn = e.target;
        if (requesting) return;
        btn.style.transition = 'opacity .7s ease';
        try {
            e.preventDefault();
            let payment_method = (e.target.id === 'paypal-btn' ? 'paypal' : 'stripe'), 
            mode = popup1.getAttribute('mode');
            let [name, email, phone, dob, address, postalCode] = [v.t('#name'), v.t('#email'), v.t('#phone'), v.t('#dob'), v.t('#address'), v.t('#postalCode')];
            let [hasDisability, hasBadMedical, sex, hasViolence, purpose] = [v.s('#hasDisability'), v.s('#hasBadMedical'), v.s('#sex'), v.s('#hasViolence'), v.t('#purpose')];
            let [student_signature, student_parants_signature, student_media_permision_signature] = [v.t('#student_signature'), v.t('#parent_signature'), v.t('#student_media_permision_signature')];

            let disabilityDetails = undefined;


            if (hasDisability === 'Yes' || hasBadMedical === 'Yes') {
                disabilityDetails = v.t('#disabilityDetails');
            }

            if (studentImage === undefined) {
                studentImageInput.style.outline = '2px solid red';
                studentImageInput.addEventListener('change',
                    function () {
                        studentImageInput.style.outline = 'none';
                    }
                );
                throw new Error("Student Image Is undefined");
            }


            btn.style.opacity = .7;
            requesting = true;

            let response = await fetch(window.location.origin + '/api/l-api/course/purchase/', {
                method: 'POST',
                body: JSON.stringify({ name, email, phone, dob, address, postalCode, studentImage, hasDisability, hasBadMedical, sex, hasViolence, disabilityDetails, purpose, payment_method, mode, student_signature, student_parants_signature, coupon: isValidCoupon ? coupon : undefined, student_media_permision_signature }),
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

    let couponTimeOut = undefined;
    popup1.querySelector('input#coupon').addEventListener('input', function () {
        if (!popup1.querySelector('input#coupon').value) return;
        popup1.querySelector('input#coupon').value = popup1.querySelector('input#coupon').value.toUpperCase();
        coupon = popup1.querySelector('input#coupon').value;
        if (coupon.trim()) {
            clearTimeout(couponTimeOut);
            let parameters = (new URLSearchParams({ code: coupon.trim() })).toString();
            couponTimeOut = setTimeout(async function () {
                let response = await fetch(window.location.origin + '/api/api_s//coupons/course/rate?' + parameters);
                if (response.status === 200) {
                    let { rate } = (await response.json());
                    isValidCoupon = true;
                    let basePrice =  popup1.getAttribute('mode') == 1 ? globlal_fees_of_regular_class : globlal_fees_of_bhangra_fitness;
                    basePrice = Number(basePrice);
                    basePrice = basePrice - (basePrice * rate);
                    popup1.querySelector(`#base-price`).innerHTML = basePrice.toFixed(2);
                    popup1.querySelector(`#gst-amount`).innerHTML = (basePrice * (gst_rate / 100)).toFixed(2);
                    popup1.querySelector(`#total-price`).innerHTML = basePrice + (basePrice * (gst_rate / 100));
                    // popup1.querySelector('input#coupon').style.outline = '1px solid green';
                    // setTimeout(() => { popup1.querySelector('input#coupon').style.outline = 'none'; }, 1500);
                    alert('Coupon added successFully');
                    return;
                } else {
                    isValidCoupon = false;
                    coupon='';
                    let basePrice =  popup1.getAttribute('mode') == 1 ? globlal_fees_of_regular_class : globlal_fees_of_bhangra_fitness;
                    basePrice = Number(basePrice);
                    alert('Coupon was removed');
                    popup1.querySelector(`#base-price`).innerHTML = basePrice.toFixed(2);
                    popup1.querySelector(`#gst-amount`).innerHTML = (basePrice * (gst_rate / 100)).toFixed(2);
                    popup1.querySelector(`#total-price`).innerHTML = basePrice + (basePrice * (gst_rate / 100));
                    popup1.querySelector('input#coupon').style.outline = '1px solid red';
                    setTimeout(() => { popup1.querySelector('input#coupon').style.outline = 'none'; }, 1500);
                    
                }
            }, 350);
            return;
        } else {

        }
    })

    studentImageInput.addEventListener('change', c1);




}


{ // popup 2
    let contactBtn = popup2.querySelector(`#contact-popup-btn`);
    let requesting = false;
    contactBtn.addEventListener('click', async function (event = new Event('click')) {
        try {
            event.preventDefault();
            if (requesting) return;
            let v = returnV(popup2);
            let [name, phone, email, country, city, district, zipcode, road_no] = [v.t('[placeholder="Your Name"]'), v.t('[placeholder="Your Phone Number"]'), v.t('[placeholder="Your Email"]'), v.t('[placeholder="Country"]'), v.t('[placeholder="City"]'), v.t('[placeholder="District"]'), v.n('[id="contact-zipcode"]'), v.t('[placeholder="Road No/ Village"')];
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
        s(select) {
            let s = document.querySelector(select);
            if (!s) throw ('select is not a html element');
            if (!s.selectedOptions[0]?.value?.trim()) {
                s.style.outline = '2px solid red';
                function makeredselect() {
                    s.style.outline = 'none';
                    s.removeEventListener('change', makeredselect);
                }
                s.addEventListener('change', makeredselect);
                throw ("Nothing is selected on select options");
            }
            return s.selectedOptions[0].value?.trim();
        }
    }
    return (new V(doc));
}
async function c1(e) {
    let img = popup1.querySelector('.student-image');
    function failed(params) {
        img.setAttribute('style', 'display:none');
        let newFileInput = document.createElement('input');
        newFileInput.type = 'file';
        studentImageInput.replaceWith(newFileInput);
        studentImage = undefined;
        newFileInput.accept = 'image/*';
        newFileInput.addEventListener('change', c1);
        studentImageInput = newFileInput;

    }

    if (e.target.files[0].type !== 'image/png' && e.target.files[0].type !== 'image/jpg' && e.target.files[0].type !== 'image/jpeg' && e.target.files[0].type !== 'image/webp') {
        failed();
        return alert('Please upload an Image');
    }
    img.src = '/img/spinner.svg';
    img.setAttribute('style', 'object-fit: contain;object-position: center center;')
    let form = new FormData();
    form.append('img', e.target.files[0]);
    const response = await fetch(window.location.origin + '/api/api_s/upload-image-for-25-minutes', { method: 'POST', body: form }).catch(failed);
    if (response.status === 201) {
        let link = (await response.json()).link;
        img.src = link;
        img.setAttribute('style', 'object-fit: contain;object-position: center center;');
        studentImage = link;
        return;
    } else return failed();


}

function setPopupDetails(query, dateString) {
    let popup = document.querySelector(query);
    popup.style.display = 'block';
    popup.querySelector('#close-detailspopup-btn').addEventListener('click', function (event = new Event('click')) {
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

