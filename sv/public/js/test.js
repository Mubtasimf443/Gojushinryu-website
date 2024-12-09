/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/

let btn=document.querySelector('button');


// btn.onclick;
btn.addEventListener('click',testCustomMembership)

function createCustomLink(event) {
    event.preventDefault();
    fetch(window.location.origin +'/api/l-api/custom-link',{
        method :'POST',
        headers :{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            type :'membership',
            emails:['mubtasimf443@gmail.com'], 
            expiringDate:Date.now()+10000000000,
            membership:{
                name :'School of Traditional Martial',
                price :'50',
                type:'Annual'
            }
        })
    })
        .then(
            function (response) {
                console.log({
                    status: response.status
                });
                return response.json()
            }
        )
        .then(
            function (response) {
                console.log(response)
            }
        )
}


function testCustomMembership(event) {
    event.preventDefault();
    fetch(window.location.origin +'/api/l-api/custom-membership',{
        method :'POST',
        headers :{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            fname :"mub",
            lname:"mub",
            email:"mub",
            phone:"0192874544",
            date_of_birth:"10/10/2010",
            country:'bangladesh',
            city:'Dhaka',
            district:'Dhaka',
            postcode:2929,
            doju_Name:'Karate',
            instructor:'Varun Jettly',
            current_grade:'832',
            previous_injury:"3",
            gender:'Male',
            is_previous_member :'Yes',
            experience_level:'Senior',
            has_violance_charge:'Yes',
            has_permanent_injury:'Yes',
            permanent_disabillity :'hello',
            violance_charge:'I have violance charge',
            membership_expiring_date:'10/12/2020',
            payment_method:'paypal',
            CustomMembershipId :1733374890636
        })
    })
    .then(function(response) {
        console.log({
            status :response.status
        });
        return response.json()
    })
    .then(function(response) {
        console.log(response)
    })
}