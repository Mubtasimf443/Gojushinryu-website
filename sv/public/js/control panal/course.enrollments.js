/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

{
    let not_seen=true;
    let container =document.querySelector(`[targetedElement="course_enrolments_href"]`);

    
    let observer =new IntersectionObserver(async ENT => {
        if (ENT[0].isIntersecting && not_seen) {
            not_seen=false;
            try {
                let res =await fetch(window.location.origin +'/api/api_s/get-courses-enrollments-data');
                if (res.status===200) {
                    res=await res.json();
                    let {enrollments} =res;
                    for (let i = 0; i < enrollments.length; i++) {
                        let { no ,date, course_name, studentName, price } =enrollments;     
                        let tr =document.createElement('tr');
                        tr.innerHTML=`
                        <td>${no}</td>
                        <td>${course_name}</td>
                        <td>${studentName}</td>
                        <td>${date}</td>
                        <td>${price}</td>
                        
                        `
                        container.querySelector('table').appendChild(tr);
                    }
                }
            } catch (error) {
                console.log(error);
                
            }
        }
    })


    observer.observe(container)
}