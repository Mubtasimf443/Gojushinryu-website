/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  inshaAllah 
Ya Allah,  please help in animation
*/


window.addEventListener('load',e => {
  const Loader = document.getElementById('Loader');
  const main_logo = Loader.querySelector('#main_logo');
  main_logo.style.opacity=0.01;
  let aiTime = 400;
  setTimeout(() => {
    main_logo.style.opacity=1;
    setTimeout(() => {
      main_logo.style.opacity=.01;
      setTimeout(() => {
        main_logo.style.opacity=1;
        main_logo.setAttribute('src','/icon/loader2.png');
        setTimeout(() => {
          main_logo.style.opacity=1;
          setTimeout(() => {
            Loader.remove()
          }, 500);
        }, 700);
      }, 600);
    }, 600);
  }, 200); 
})


//   setTimeout((params) => {
        //  main_logo.setAttribute('src','/icon/loader1.png')
        //     main_logo.style.opacity=1;
        //     setTimeout((params) => {
        //       main_logo.style.opacity=.01;
        //       main_logo.setAttribute('src','/icon/loader2.png')      
        //         setTimeout((params) => {
        //           main_logo.style.opacity=1;
        //           setTimeout(() => {
        //             main_logo.style.opacity=1;
        //             setTimeout(() => {
        //               Loader.remove()
        //             }, 100);
        //           },aiTime);
        //       },aiTime)
        //     },aiTime)
        //   },aiTime)
