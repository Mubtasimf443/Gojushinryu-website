/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

export async function MembershipPageNavigation(req, res) {
    try {
        let { name, age, first_name, last_name, email, phone, country, district, city, postCode } = req.user_info;

        if (req.params.org === 'school-of-traditional-martial-arts') {
            return res.render('MembershipFrom', {
                name: name,
                first_name,
                last_name,
                email,
                phone,
                country,
                district: district ? district : '',
                city: city ? city : '',
                postcode: typeof postCode === 'number' ? postCode : 1000
            });
        }
        else if (req.params.org === 'goju-shin-ryu') {
            return res.render('massage_server', { title: 'This page is under construction', body: "We currently preparing this page , so please wait for 1-2 days for having Gojushinryu membership" })
        } else {
            return res.render('MembershipFrom', {
                name: name,
                first_name,
                last_name,
                email,
                phone,
                country,
                district: district ? district : '',
                city: city ? city : '',
                postcode: typeof postCode === 'number' ? postCode : 1000
            });
        }
    } catch (error) {
        console.log({ error });
    }
}