/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{


    function isEmpty(selector) {
        let selectedElement=document.querySelector(selector);
        let value=selectedElement.value;
        if (!value) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid')
            throw 'Error , Emty input '+selector
        }
        if (value.trim().length===0) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid')
            throw 'Error , Emty input '+selector
        }
        value=value.trim();
        selectedElement.classList.contains('is-invalid') && selectedElement.classList.remove('is-invalid');
        selectedElement.classList.add('is-valid')
        return value
    }
    function isEmail(event) {
        let selectedElement=event.target;
        let value = selectedElement.value;
        if (!value) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid');
            throw 'Error , Emty input'
        }
        value=value.trim();
        if (value.length===0) {
                selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
                selectedElement.classList.add('is-invalid');
            throw 'Error , Emty input'
        }
       
        if (!value.includes('@')) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid');
            throw 'Error , Emty input'
        }
        if (!value.includes('.')) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid');
            throw 'Error , Emty input'
        }
        selectedElement.classList.contains('is-invalid') &&selectedElement.classList.remove('is-invalid');
        selectedElement.classList.add('is-valid')
        return value
    }
    document.querySelectorAll('input').forEach(function (input) {
        function check(event){
            let selectedElement=event.target;
            if (selectedElement.type!== 'text') return
            let value=selectedElement.value;
            if (!value) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
                selectedElement.classList.add('is-invalid')
                throw 'input value is null'
            }
            value=value.trim();
            if (value.length===0) {
                selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
                selectedElement.classList.add('is-invalid')
                throw 'Error , Emty input'
            }
            selectedElement.classList.contains('is-invalid') &&selectedElement.classList.remove('is-invalid')
            selectedElement.classList.add('is-valid')
        }
        input.onkeyup=check;
        input.onchange=check
    })
    function isNum(selector) {
        let selectedElement=document.querySelector(selector);
        let value=selectedElement.value;
        if (!value) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid')
            throw 'Error , Emty input'
        }
        if (value.trim().length===0) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid')
            throw 'Error , Emty input'
        }
        value=value.trim();
        value=Number(value)
        if (value.toString()==='NaN') {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid')
            throw 'Error , Emty input'
        }
        selectedElement.classList.contains('is-invalid') && selectedElement.classList.remove('is-invalid');
        selectedElement.classList.add('is-valid')
        return selectedElement.value.trim()
    }
    function isSelected(selector) {
        let select=document.querySelector(selector);
        let opt=select.selectedOptions[0];
        if (!opt.value) {
            select.classList.contains('is-valid') && select.classList.remove('is-valid');
            select.classList.add('is-invalid');
            throw 'Error , Emty input';
        }
        let value=opt.value.trim();
        if (value.length===0) {
            select.classList.contains('is-valid') && select.classList.remove('is-valid');
            select.classList.add('is-invalid');
            throw 'Error , Emty input'
        }
        select.classList.contains('is-invalid') && select.classList.remove('is-invalid');
        select.classList.add('is-valid');
        return value
    }
    function isChecked(selector) {
        let check= document.querySelector(selector).checked;
        if (!check) {
            throw 'Input is not checked'
        }
        return check
    }

    document.getElementById('input-email').onkeyup=isEmail
    document.getElementById('input-email').onfocus=isEmail


    function formSubmit(event) {
        try {
            let 
            fname =isEmpty('#input-fname'),
            lname =isEmpty('#input-lname'),
            email =isEmpty('#input-email'),
            dob =isEmpty('#input-dob'),
            phone =isNum('#input-phone'),
            country =isEmpty('#input-country'),
            city =isEmpty('#input-city'),
            district =isEmpty('#input-district'),
            dojoName =isEmpty('#input-dojo-name'),
            postCode =isNum('#input-postCode'),
            instructor =isEmpty('#input-instructor'),
            currentGrade=isEmpty('#input-current-grade'),
            previousDisabilty=isEmpty('#input-previousDisabilty'),
            parmanentInjury=isEmpty('#input-parmanent-injury'),
            hasParmanentInjury=isSelected(`#select-parmanent-injury-statement`),
            isPrevieuseMember=isSelected(`#select-previeuse-member-statement`),
            gender=isSelected(`[id="select-gender"]`),
            experience=isSelected('#select-experience'),
            membership_expiring_date =isEmpty('#input-Membership-Expiring-Date'),
            hasViolanceCharge=isSelected(`#select-violance-charge`),
            violanceCharge,
            payment_method=event.target.value
            ;
            isChecked(`#role1`);// Checking the role 1 acccaptence
            isChecked(`#role2`);
            if (hasViolanceCharge==='Yes') {
                violanceCharge=isEmpty('#input-violance-charge');
            }
            deActivateButton()
            fetch(window.location.origin +'/api/l-api/custom-membership',{
                method :'POST', 
                headers :{
                    'Content-Type' :'application/json'
                },
                body :JSON.stringify({
                   fname,
                   lname,
                   email,
                   date_of_birth:dob,
                   phone,
                   country,
                   city,
                   district,
                   postcode: Number(postCode),
                   doju_Name:dojoName,
                   instructor,
                   current_grade:currentGrade,
                   has_permanent_injury:hasParmanentInjury,
                   has_violance_charge:hasViolanceCharge,
                   previous_injury:previousDisabilty,
                   permanent_disabillity: parmanentInjury,
                   is_previous_member :isPrevieuseMember,
                   gender:gender,
                   experience_level: experience,
                   violance_charge : violanceCharge,
                   membership_expiring_date,
                   payment_method,
                   CustomMembershipId
                   // CustomMembershipId is define unsafe inline script tag of 
                   // pass by server rendering
                })
            })
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function(response) {
                    console.log(response);
                    if (response.link) window.location.assign(response.link)
                }
            )
            .catch(
                function(error){
                    console.error(error)
                }
            )
            .finally(
                function(){
                    activateButton()
                }
            )
        } catch (error) {
            console.log(error)
        }
    }


    document.getElementById('btn-paypal').onclick=formSubmit;
    document.getElementById('btn-visa').onclick=formSubmit;

    document.getElementById('select-violance-charge').onchange=function (event) {
        let 
        violanceChargeInputDiv=document.getElementById("violance-charge-input-div"),
        value =event.target.selectedOptions[0].value;
        if (value==='Yes') {
            violanceChargeInputDiv.classList.contains('d-none') && violanceChargeInputDiv.classList.remove('d-none');
        }
        if (value !=='Yes') {
            violanceChargeInputDiv.classList.contains('d-none') ===false && violanceChargeInputDiv.classList.add('d-none');
        }
    }


    document.querySelector('#role1').onchange=checkRoles;
    document.querySelector('#role2').onchange=checkRoles;


    function checkRoles() {
        try {
            isChecked(`#role1`);
            isChecked(`#role2`);
            document.getElementById('btn-paypal').disabled = false;
            document.getElementById('btn-visa').disabled = false;
        } catch (error) {
            document.getElementById('btn-paypal').disabled = true;
            document.getElementById('btn-visa').disabled = true;
        }
    }

    function activateButton() {
        document.getElementById('btn-paypal').disabled = false;
        document.getElementById('btn-visa').disabled = false;
    }
    function deActivateButton() {
        document.getElementById('btn-paypal').disabled = true;
        document.getElementById('btn-visa').disabled = true;
    }
}