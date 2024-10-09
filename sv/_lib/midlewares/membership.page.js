/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

export async function MembershipPageNavigation(req,res) {
    let {
        name,
        age,
        first_name,
        last_name,
        email,
        phone,
        country,
        district,
        city,
        postCode,
    } =req.user_info;
    res.render('MembershipFrom',{
        name:name,
        first_name,
        last_name,
        email,
        phone,
        country,
        district:district?district:'',
        city:city?city:'',
        postcode: typeof postCode === 'number' ? postCode :1000
    })
}