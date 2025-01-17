/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

{
    let not_seen=true;
    let container =document.querySelector(`[targetedElement="course_enrolments_href"]`);
    let courseDate=[];
    let main_table =container.querySelector('.main_table');
    let popup=container.querySelector('.popup_c')

    let observer = new IntersectionObserver(async function (ENT) {
        if ((ENT[0].isIntersecting && not_seen) === false) return;
        not_seen = false;

        let res = await fetch(window.location.origin + '/api/api_s/get-courses-enrollments-data');
        if (res.status === 200) {
            res = await res.json();
            let { enrollments } = res;
            courseDate=enrollments;
            orgTable()

        }

    })


    observer.observe(container);

    function closePopup(){
        popup.classList.remove('show');
    }
    async function orgTable() {
        let insertionHtml =``;
        for (let i = 0; i < courseDate.length; i++) {
            let { id, course_name, course_price, student_name,activated ,paymentThisMonth  } = courseDate[i];
            
            insertionHtml=insertionHtml+`
                <tr>
                    <td td_id>#${id}</td>
                    <td>${course_name}</td>
                    <td>${student_name}</td>
                    <td>$${ paymentThisMonth?.isPaid ? course_price : 'Not Paid'}</td>
                    <td class="status ${activated ? "active" : "inactive"}">${activated ? "Active" : "Inactive"}</td>
                    <td>
                        <button class="view-button" courseDataId="${id}">View</button>
                    </td>
                </tr>`;
        }
      
        main_table.querySelector('tbody').innerHTML=insertionHtml;
        main_table.querySelectorAll('button').forEach(function(element) {
            element.addEventListener('click', function (event = new Event('click')) {
                event.preventDefault();
                let id = event.target.getAttribute('courseDataId');
                let course = courseDate.find(function (element) {
                    if (element.id == id) return element;
                });
                if (course === undefined) return;
                let inputs = popup.querySelectorAll('input');
                let textareas = popup.querySelectorAll('textarea');
                inputs[0].value = course.student_name;
                inputs[1].value = course.student_phone;
                inputs[2].value = course.student_email;
                inputs[3].value = (course.student_postcode + ',' + course.student_address);
                inputs[4].value = course.student_dob;
                inputs[5].value = course.student_sex;
                inputs[6].value = course.additional_details?.hasViolence;
                inputs[7].value = course.additional_details?.hasBadMedical;
                inputs[8].value = course.additional_details?.hasDisability;
                textareas[0].value=course.additional_details?.disabilityDetails;
                textareas[1].value=course.additional_details?.purpose;

                let insertionHtml = ``;
                for (let i = 0; i < course.paymentsData.length; i++) {
                    const { payment_date, paidAmount, month, Year, date, paid } = course.paymentsData[i];
                    insertionHtml += (`
                        <tr>
                            <td>${month + '&nbsp;' + Year}</td>
                            <td>$${paidAmount}</td>
                            <td>${paid ? "Paid" : "Not Paid"}</td>
                            <td>${new Date(payment_date).toLocaleDateString()}</td>
                        </tr>
                        `)
                }
                let th = popup.querySelector('table').querySelector('tbody').children[0];
                popup.querySelector('table').querySelector('tbody').innerHTML = null;
                console.log(th);
                
                popup.querySelector('table').querySelector('tbody').appendChild(th);
                popup.querySelector('table').querySelector('tbody').innerHTML += insertionHtml;

                popup.querySelector('[Delete]').setAttribute('enrollment_id',course.id );
                popup.querySelector('[paymentRequest]').setAttribute('enrollment_id',course.id );
                popup.querySelector('[paymentRequest]').setAttribute('mode', (course?.paymentThisMonth?.isPaid ? 'Paid' : 'NotPaid'));
                popup.querySelector('[paymentRequest]').style.opacity=  (course?.paymentThisMonth?.isPaid ? 0.65 :1);
                popup.classList.add('show');

            });
        });   
    }

    function deleteenrollment(e=new Event('click')) {
        e.preventDefault();
        closePopup();
        let id =e.target.getAttribute('enrollment_id');
        if (!id) return ;
        courseDate = courseDate.filter(function (el) {
            if (el.id != id) return el;
        });
        fetch(window.location.origin + `/api/api_s/course/enrollments?id=${id}`, { method: 'DELETE' });
        orgTable();
        return;
    }
    function paymentRequest(e) {
        e.preventDefault();
        let id =e.target.getAttribute('enrollment_id');
        let mode =e.target.getAttribute('mode');
        if (!id) return ; 
        if (mode === 'Paid') return;
        e.target.style.opacity=.65;
        fetch(window.location.origin + `/api/api_s/course/enrollments/payment-request?id=${id}`, { method: 'PUT' })
        setTimeout(function() {
            e.target.style.opacity=1;
        }, 2000);
        closePopup();

        alert('A request of course Payment is send to the student');
    }
    popup.querySelector('[Delete]').addEventListener('click', deleteenrollment);
    popup.querySelector('[paymentRequest]').addEventListener('click', paymentRequest);
    popup.querySelector('.popup_header').querySelector('.close-btn').onclick=closePopup;
    popup.querySelector('.btn-group').querySelector('.closebtn').onclick=closePopup;
}