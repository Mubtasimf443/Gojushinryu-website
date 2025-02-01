/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/

{
     
    let url=window.location.origin;
    let
        popup=document.querySelector('#Gojushinryu-membership-request-Popup'),
        containar = document.querySelector('.Gojushinryu-Membership-Request-container'),
        memberhsips=[],
        seen=false;
    let table = containar.querySelector('table');
    let tbody = containar.querySelector('tbody');
    let thead = containar.querySelector('thead');
    let feesPop= containar.querySelector('#feeModal');
    let observer=new IntersectionObserver(async function (entries) {
        if (entries[0].isIntersecting && !seen){
            try {
                let response =await fetch(window.location.origin+'/api/api_s/gojusinryu-membership-request-list');
                if (response.status===200) {
                    memberhsips=(await response.json()).memberhsips ;
                    orgTable()
                } else {
                    console.log((await response.json()));
                }
            } catch (error) {
                
            } finally{
                seen=true
            }
        }
    });
    
    observer.observe(containar);

    function orgTable() {
        tbody.innerHTML = null;
        for (let i = 0; i < memberhsips.length; i++) {
            let $ = memberhsips[i];
            let tr = document.createElement('tr');
            tr.innerHTML=(`  
                <td>#${$.id}</td>
                <td width="17%"><img src="${$.member_image}" alt="student image"   ></td>
                <td>${$.fname + '&nbsp;'+$.lname}</td>
                <td>${new Date($.id).toLocaleDateString()}</td>
                <td style="color:${$.admin_approved ? 'Green' :'orangered'};">${$.admin_approved ? 'Yes' :'No'}</td>
                <td><button membership="${$.id}"  class="dt-btn">Details</button></td>
                <td style="color:${$.payment_info?.paid ? 'Green' : 'initial'}">
                ${$.payment_info?.paid ? 'Paid' : ($.payment_info?.requested ? ('Requested' ) : ( `<button class="rqt-btn" m-id="${$.id}">Request</button>`))}
                </td>
                `);
            tbody.appendChild(tr);
        }
        tbody.querySelectorAll('.dt-btn').forEach(function (el) {
            el.addEventListener('click', showMembershipDetails)
        });

        tbody.querySelectorAll('.rqt-btn').forEach(function (el) {
            el.addEventListener('click', OpenFeesPopup)
        });



    }


    async function setStudentImage(id) {
        let res=await fetch(window.location.origin+'/api/api_s/user-id-to-image?'+(new URLSearchParams({id})).toString());
        let studentImage=window.location.origin+'/img/avatar.png';
        (res.status === 200) && (studentImage = await res.text());
        containar.querySelector(`[student_image_id="${id}"]`).src=studentImage;
        containar.querySelector(`[student_image_id="${id}"]`).setAttribute('style', 'object-fit: contain;object-position: top left;');
    }

    async function showMembershipDetails(event = new Event('click')) {
        event.preventDefault();
        let m = memberhsips.find(function (element) {
            if (element.id == event.target.getAttribute('membership')) return element;
        });
        if (!m) return;
        sp(`[membership_type]`, m.membership_type);
        sp(`[name]`, m.fname + '&nbsp;' + m.lname);
        sp(`[email]`, m.email);
        sp(`[phone]`, m.phone);
        sp(`[country]`, m.country);
        sp(`[City]`, m.city);
        sp(`[district]`, m.district);
        sp(`[postcode]`, m.postcode);
        sp(`[gender]`, m.gender);
        sp(`[doju_Name]`, m.doju_Name);
        sp(`[instructor]`, m.instructor);
        sp(`[current_grade]`, m.current_grade);
        sp(`[previous_injury]`, m.previous_injury);
        sp(`[is_previous_member]`, m.is_previous_member);
        sp(`[membership_expiring_date]`, m.previous_membership_expiring_date);
        sp(`[experience_level]`, m.experience_level);
        sp(`[has_violance_charge]`, m.has_violance_charge);
        sp(`[violance_charge]`, m.violance_charge);
        sp(`[has_permanent_injury]`, m.has_permanent_injury);
        sp(`[permanent_disabillity]`, m.permanent_disabillity);
      
        if (!m.admin_approved) {
            let btn = popup.querySelector(`[approve]`);
            let id = btn.setAttribute('membership_id', m.id);
            btn.style.opacity = 1;
            popup.querySelector(`[Delete]`).setAttribute('membership_id', m.id);
            popup.querySelector(`[Delete]`).style.opacity=1;
        }
        if (m.admin_approved) {
            let btn = popup.querySelector(`[approve]`);
            if (btn.getAttribute('membership_id') !== null) btn.removeAttribute('membership_id');
            btn.style.opacity = 0.65;
            (popup.querySelector(`[Delete]`).getAttribute('membership_id')) && (popup.querySelector(`[Delete]`).removeAttribute('membership_id'));
            popup.querySelector(`[Delete]`).style.opacity=.65;
        }

        showPop();
        popup.querySelector(`[approve]`).addEventListener('click', adminApproveRequest);
        popup.querySelector(`[Delete]`).addEventListener('click', cancelAndDelete);

    }

    function showPop() { popup.style.display = 'flex' }
    function close() { 
        popup.style.display = 'none';
        popup.querySelectorAll('input').forEach(function (element) { element.value=null; })
        {
            let btn =popup.querySelector(`[approve]`);
            if (btn.getAttribute('membership_id') !== null) btn.removeAttribute('membership_id');
            btn.style.opacity = 0.65;
            (popup.querySelector(`[Delete]`).getAttribute('membership_id')) && (popup.querySelector(`[Delete]`).removeAttribute('membership_id'));
            popup.querySelector(`[Delete]`).style.opacity=.65;
        }
        popup.querySelector(`[approve]`).removeEventListener('click', adminApproveRequest);
        popup.querySelector(`[Delete]`).removeEventListener('click', cancelAndDelete);
    };
    function sp(query,value) {
        popup.querySelector(query).value=value;
    }



    function adminApproveRequest(event = new Event('click')) {
        event.preventDefault();
        let btn =popup.querySelector(`[approve]`);
        let id =btn.getAttribute('membership_id');
        if (id) {
            fetch(url + '/api/api_s/gojusinryu-membership-request-approve?' + (new URLSearchParams({ id })), { method: 'PUT' });
            memberhsips=memberhsips.map(function (element) {
                if (element.id==id) {
                    element.admin_approved=true;
                    return element;
                } else return element;
            });

            close();
            orgTable()
        }
    }
    function cancelAndDelete(event = new Event('click')) {
        event.preventDefault();
        let btn = popup.querySelector(`[Delete]`);
        let id = btn.getAttribute('membership_id');
        if (id) {
            memberhsips=memberhsips.filter(function (element) {
                if (element.id!=id) return element;
            });
            fetch(url + '/api/api_s/gojusinryu-membership-request-delete?' + (new URLSearchParams({ id })), { method: 'DELETE' });
            close();
            orgTable();
        }
    }


    function OpenFeesPopup(event=new Event('click')){
        feesPop.classList.add('active');
        let mid=event.target.getAttribute('m-id');
        feesPop.setAttribute('mid',mid);
        let cancelBtn= feesPop.querySelector('.model-cancel');
        let submitBtn= feesPop.querySelector('.model-submit');
      
        function submit(event=new Event('click')) {
            event.preventDefault();
            let mid=feesPop.getAttribute('mid');
            let fees=feesPop.querySelector('input').valueAsNumber;
            function makeitred(){
                feesPop.querySelector('input').style.outline='2px solid red';
                feesPop.querySelector('input').addEventListener('input', function ured(){
                    feesPop.querySelector('input').style.outline = 'none';
                    feesPop.querySelector('input').removeEventListener('input', ured);
                });
            }
            if (fees <1) throw makeitred();
            if (fees.toString()==='NaN') throw makeitred();
            fees=Math.round(fees);
            fetch(origin + `/api/api_s/gojusinryu-membership/request-fees?id=${mid}&fees=${fees}`, { method: 'put' });
            memberhsips=memberhsips.map(function(element){
                if (element.id==mid) {
                    if (typeof element.payment_info !== 'object') element.payment_info={};
                    element.payment_info.requested=true;
                    return element;
                } else return element;
            });
            orgTable();
            closePop(event);
        }

        function closePop(event =new Event('click') ) {
            cancelBtn.removeEventListener('click', closePop);
            submitBtn.removeEventListener('click', submit);
            feesPop.classList.remove('active');
            feesPop.querySelector('input').style.outline='none';

        }

        submitBtn.addEventListener('click',submit )
        
        cancelBtn.addEventListener('click',closePop );

        
    
    }
}


