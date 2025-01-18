/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{
    let containar=document.querySelector('.membership-box');
    let seen =false;
    let observer=new IntersectionObserver( ent => {
        if (ent[0].isIntersecting && !seen){
            seen=true;
            fetch(window.location.origin + '/api/api_s/get-user-membership')
            .then(res => {
                if (res.status===304) {
                    let strong =document.createElement('strong');
                    strong.innerHTML='You are not a member '
                    containar.appendChild(strong)
                    return;
                }
                if (res.status===200) res.json().then(({data})=> {
                    for (let i = 0; i < data.length; i++) {
                        const {no,date,name,type,organization} = data[i];
                        let tr=document.createElement('tr');
                        tr.innerHTML=`
                        <td>${no}</td>
                        <td>${name}</td>
                        <td>${organization}</td>
                        <td>${type}</td>
                        <td>${date}</td>
                        `;
                        containar.querySelector('table').appendChild(tr);
                    }
                })
            })
            .catch((e)=> console.error(e))
        }
    });
    observer.observe(containar)
}