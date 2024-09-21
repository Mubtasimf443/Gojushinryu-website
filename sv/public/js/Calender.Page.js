/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

var ThisMonth=true;
  let calanders = document.querySelectorAll('.calendar')
  calanders.forEach(calander => {
   
    const _header = calander.querySelector(".calendar h3");
    const dates = calander.querySelector(".dates");
    const navs = calander.querySelectorAll("#prev, #next");
    let returnMonth =() => {
        return ThisMonth ? months[month] : months[month +1 ]
    }
    let returnClassDates = function () {
        switch (ThisMonth) {
            case true:
                
            return [3,5,9,11,16,18,21,23,28,29];
        
            default:
            return [2,3,9,11,16,19,21,27,29]
        }
     
         
          
    }
    
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    
    let date = new Date(Date.now());
    let month = date.getMonth();
    let year = date.getFullYear();
    
    function renderCalendar() {
      const start = new Date(year, month, 1).getDay();
      const endDate = new Date(year, month + 1, 0).getDate();
      const end = new Date(year, month, endDate).getDay();
      const endDatePrev = new Date(year, month, 0).getDate();
      
      let datesHtml = "";
      (function logDate() {
          console.log('year : '+ year);
          console.log('month : '+month);
          console.log(`start : ${start}`);
          console.log(`endDate : ${endDate}`);
          console.log(`end : ${end}`);
          console.log(`endDatePrev : ${endDatePrev}`);
        })()
       for (let i = start; i > 0; i--) {
        datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
       }
    
      for (let i = 1; i <= endDate; i++) {
        let classDates =returnClassDates();
        console.log(classDates);
        
        let checkDate = classDates.findIndex(el => el === i);
        let className = checkDate !== -1 ? 'class="class-day"':''
        datesHtml += `<li ${className} >${i}</li>`;
      }
     
    
      for (let i = end; i < 6; i++) {
        datesHtml += `<li class="inactive">${i - end + 1}</li>`;
      }
      dates.innerHTML = datesHtml;
      _header.textContent = `${/*months[month]*/ returnMonth()} ${year}`;
      ThisMonth ? ThisMonth =false : ThisMonth =true;
    }
    
    // navs.forEach((nav) => {
    //   nav.addEventListener("click", (e) => {
    //     const btnId = e.target.id;
    
    //     if (btnId === "prev" && month === 0) {
    //       year--;
    //       month = 11;
    //     } else if (btnId === "next" && month === 11) {
    //       year++;
    //       month = 0;
    //     } else {
    //       month = btnId === "next" ? month + 1 : month - 1;
    //     }
    
    //     date = new Date(year, month, new Date().getDate());
    //     year = date.getFullYear();
    //     month = date.getMonth();
    
    //     renderCalendar();
    //   });
    // });
    
    renderCalendar();
    
    
    

 })

 