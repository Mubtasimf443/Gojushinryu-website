/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

const _header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const navs = document.querySelectorAll("#prev, #next");


//let classDates =[3,5,8,10,13,15,18,19,21,24,27,30];

classDates=classDates.split(',')
console.log(classDates);

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
    let checkDate = classDates.findIndex(el => Number(el) === i);
    let className = checkDate!== -1 ? 'class="class-day"':''
    datesHtml += `<li ${className} >${i}</li>`;
  }
 

  for (let i = end; i < 6; i++) {
    datesHtml += `<li class="inactive">${i - end + 1}</li>`;
  }
  dates.innerHTML = datesHtml;
  _header.textContent = `${months[month]} ${year}`;
}

navs.forEach((nav) => {
  nav.addEventListener("click", (e) => {
    const btnId = e.target.id;

    if (btnId === "prev" && month === 0) {
      year--;
      month = 11;
    } else if (btnId === "next" && month === 11) {
      year++;
      month = 0;
    } else {
      month = btnId === "next" ? month + 1 : month - 1;
    }

    date = new Date(year, month, new Date().getDate());
    year = date.getFullYear();
    month = date.getMonth();

    renderCalendar();
  });
});

renderCalendar();


