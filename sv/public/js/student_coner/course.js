/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let containar=document.querySelector('.course-e-box');
    let seen =false;
    let observer=new IntersectionObserver(ent => {
        if (ent[0].isIntersecting && !seen){
            seen=true;
            fetch(window.location.origin + '/api/api_s/get-user-courses')
            .then(res => {
                if (res.status===304) {
                    let strong =document.createElement('strong');
                    strong.innerHTML='You have not joined a course'
                    containar.appendChild(strong)
                    return
                }
                if (res.status===200) res.json().then(({data})=> {
                    for (let i = 0; i < data.length; i++) {
                        const {id,price,date,name} = data[i];
                        let tr=document.createElement('tr');
                        tr.innerHTML=`
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${date}</td>
                        <td>${price}.00$</td>
                        `;
                        containar.querySelector('table').appendChild(tr)
                    }
                })
            })
            .catch((e)=> console.error(e))
        }
    });
    observer.observe(containar)
}
