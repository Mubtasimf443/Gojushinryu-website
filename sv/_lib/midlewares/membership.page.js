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
        age:age?age:18,
        first_name,
        last_name,
        email,
        phone,
        country,
        district:district?district:'',
        city:city?city:'',
        postCode: postCode? postCode :1000
    })
}