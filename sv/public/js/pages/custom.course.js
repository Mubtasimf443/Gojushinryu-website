/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{
    let 
    paypal =document.querySelector('.paypal'),
    visa=document.querySelector('.visa'),
    popupContainer=document.querySelector('.pop-c'),
    closePop=document.querySelector('.pop-close'),
    paymentMethod='paypal',
    purchaseBtn=document.querySelector('.purchase-btn');

    

    

    purchaseBtn.addEventListener('click', formSubmit);
    EnterPress(['#country',`#city`,`#district`,'#postcode']);
    closePop.addEventListener('click',disablePop) ;
    paypal.addEventListener('click',paymentMethodPayPal) ;
    visa.addEventListener('click',paymentMethodStripe ) ;


    function formSubmit(event){
        try {
            
            purchaseBtn.disabled = true;
            let
                date_of_birth = isEmpty(`#dob`),
                country = isEmpty(`#country`),
                city = isEmpty(`#city`),
                district = isEmpty(`#district`),
                postcode = isNum('#postcode');


            fetch(window.location.origin + '/api/l-api/custom-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseData :{
                        country,
                        city,
                        postcode,
                        date_of_birth,
                        district,
                        customCourseId: customCourseId
                    },
                    paymentMethod,
                })
            })
                .then(
                    function (response) {
                        return response.json()
                    }
                )
                .then(
                    function (response) {
                        if (response.hasError) {
                            console.log(response.error)
                        }
                         if (!response.hasError) setTimeout(() => window.location.assign(response.link), 300);
                    }
                )
                .catch(
                    function (error) {
                        console.log(error);
                    }
                )
                .finally(
                    function () {
                        purchaseBtn.disabled = false;
                    }
                )
        } catch (error) {
            console.log({error});
            
            purchaseBtn.disabled = false;
        }

    }
    

    function disablePop(){
        popupContainer.style.display='none';
    }
    function paymentMethodPayPal(){
        popupContainer.style.display='flex';
        paymentMethod='paypal';
    }
    function paymentMethodStripe(){
        popupContainer.style.display='flex';
        paymentMethod='stripe';
    }

    function isEmpty(selector) {
        let selectedElement = document.querySelector(selector);
        let value = selectedElement.value;
        if (!value) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid')
            throw 'Error , Emty input ' + selector
        }
        if (value.trim().length === 0) {
            selectedElement.classList.contains('is-valid') && selectedElement.classList.remove('is-valid');
            selectedElement.classList.add('is-invalid')
            throw 'Error , Emty input ' + selector
        }
        value = value.trim();
        selectedElement.classList.contains('is-invalid') && selectedElement.classList.remove('is-invalid');
        selectedElement.classList.add('is-valid')
        return value
    }

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
        return value
    }



    function EnterPress(array){
        for (let i = 0; i < array.length; i++) document.querySelector(array[i]).addEventListener('keypress', function(event) { if (event.key ==='Enter') formSubmit() });
    }
}