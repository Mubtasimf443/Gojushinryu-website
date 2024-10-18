/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

var ThisMonth=true;
let calanders = document.querySelectorAll('.calendar')
let e= (selector) => document.querySelector(selector)

function setUpCalender(calander,classDates) {
  console.log({classDates});
  
  try {
  const _header = calander.querySelector(".calendar h3");
  const dates = calander.querySelector(".dates");
  const navs = calander.querySelectorAll("#prev, #next");
  let returnMonth =() => {
      return ThisMonth ? months[month] : months[month +1 ]
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
    // console.log({type :typeof classDates}); 
    classDates = classDates.split(',')
    for (let i = 1; i <= endDate; i++) {
      let checkDate = ((i) => {
        let date =new Date(year,month,i).getDay();
        let index= classDates.findIndex(el => el==date);
        // console.log({index});
        return index
      })(i);
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
  
 
  renderCalendar();
  } catch (error) {
    console.log({error});
  }
}




setUpCalender(e(`[calender="4"]`),date_of_online_class)
setUpCalender(e(`[calender="3"]`),date_of_online_class)


setUpCalender(e(`[calender="1"]`),date_of_regular_class)
setUpCalender(e(`[calender="2"]`),date_of_regular_class)
setUpCalender(e(`[calender="5"]`),date_of_womens_defence_class)
setUpCalender(e(`[calender="6"]`),date_of_womens_defence_class)