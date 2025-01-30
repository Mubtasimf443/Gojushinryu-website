/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let containar=document.querySelector('.course-e-box');
    let seen =false;
    let observer=new IntersectionObserver(async function (ent) {
        if (ent[0].isIntersecting && !seen){
            seen=true; 

            let res=await fetch(window.location.origin + '/api/api_s/get-user-courses')
            if (res.status === 200) {
                let data = (await res.json()) || [];
                if (data.length === 0) {
                    let strong = document.createElement('strong');
                    strong.innerHTML = 'You have not enrolled to a course '
                    containar.appendChild(strong)
                    return
                }
                for (let i = 0; i < data.length; i++) {
                    const { id, price, date, name } = data[i];
                    let tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${date}</td>
                        <td>${price}.00$</td>
                        `;
                    containar.querySelector('table').appendChild(tr)
                }
            }
            if (res.status !== 200) {
                let strong = document.createElement('strong');
                strong.innerHTML = 'Sorry for server error'
                containar.appendChild(strong)
                return
            }
        }
    });
    observer.observe(containar)
}
