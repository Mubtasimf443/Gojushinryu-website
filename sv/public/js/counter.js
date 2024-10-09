/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{


let progressSection = document.getElementById('hm_progress_section');
let countryCounter =document.getElementById('countries_counter');
let studentCounter=document.getElementById('students_counter');
let blackBeltsCounter=document.getElementById('black_belts_counter');
let experienceCounter=document.getElementById('experience_counter');




const observer =new IntersectionObserver(ent => {
   
    console.log(ent[0]);
    
  if ( ent[0].isIntersecting !== true) return
    addCountries();
    addBlackBelts();
    addStudents();
    addExperience();
})


observer.observe(progressSection)
let country=0;
let blackBelt =0;
let students=0;
let experience =0;
const addExperience=()=>{
    if (experience !== 13){              
        experience=experience+1;
        experienceCounter.innerText=experience.toString();
        setTimeout(addExperience,180)
    }
    return
}

const addBlackBelts =()=>{
    if (blackBelt !== 2000 && blackBelt <2001){    
        blackBelt=blackBelt+5;
        blackBeltsCounter.innerText=blackBelt.toString();
        setTimeout(addBlackBelts,3)
    }
    return
}


const addStudents =()=>{
    if (students !== 10000 && students < 10001){    
        students=students+20;
        studentCounter.innerText=students.toString();
        setTimeout(addStudents,1)
    }
    return
}



const addCountries =()=>{
    if (country !== 20){    
        country=country+1;
        countryCounter.innerText=country.toString();
        setTimeout(addCountries,130)
    }
    return
}







}