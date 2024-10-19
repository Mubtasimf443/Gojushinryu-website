/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
    let container =document.querySelector(`#settings-conatiner`);
    let needsToUpdate=false;
    let save_btn=container.querySelector(`[save_btn]`)
    let uploading=false;

    save_btn.addEventListener('click',async e => {
      if (uploading) return
      let date_of_online_class =v('[id="o-class-date"]');
      let date_of_regular_class =v('[id="r-class-date"]');
      let date_of_womens_defence_class =v('[id="w-class-date"]');
      let home_video_url=v('[id="h-video-url-inp"]') ;
      let array=[];
      let test;

      array=date_of_online_class.split();
      test=array.find(el => Number(el) > 6);
      if (test !== undefined) {
        container.querySelector(`[id="o-class-date"]`).value ='You can not use date more then 6'
        container.querySelector(`[id="o-class-date"]`).style.color='red'
        setTimeout(() => {
          container.querySelector(`[id="o-class-date"]`).style.color='black';
        }, 2000);
        throw 'error'
      }
      array=date_of_regular_class.split();
      test=array.find(el => Number(el) > 6);
      if (test !== undefined) {
        container.querySelector(`[id="r-class-date"]`).value ='You can not use date more then 6'
        container.querySelector(`[id="r-class-date"]`).style.color='red';

        setTimeout(() => {
          container.querySelector(`[id="r-class-date"]`).style.color='black';
        }, 2000);
        throw 'error'
      }
      array=date_of_womens_defence_class.split();
      test=array.find(el => Number(el) > 6);
      if (test !==undefined) {
        container.querySelector(`[id="w-class-date"]`).value ='You can not use date more then 6'
        container.querySelector(`[id="w-class-date"]`).style.color='red';
        setTimeout(() => {
          container.querySelector(`[id="w-class-date"]`).style.color='black';
        }, 2000);
        throw 'error'
      }


      try {
        uploading=true;
        save_btn.style.opacity=.6;
       


        let res=await fetch(window.location.origin +'/api/api_s/change-settings', {
          method :'PUT',
          headers:{
            'Content-Type':'application/json'
          },
          body :JSON.stringify({
            date_of_online_class,
            date_of_regular_class,
            date_of_womens_defence_class ,
            home_video_url
          })
        });
      if (res.status===200) {
        save_btn.style.background='green';
        save_btn.innerHTML='Updated';
        setTimeout(() => {
        save_btn.style.background='black';
        save_btn.innerHTML='Save';
        save_btn.style.opacity=.67;
        }, 2000);
      }
      } catch (error) {
        console.log({error});
        
      } finally{
        save_btn.style.opacity=1;
        uploading=false;
      }
        
        
    })
    let addListener=(querySelector)=> {
      let el=container.querySelector(querySelector);
      el.addEventListener('keypress', e => {
      let key =e.key;
      let array=[0,1,2,3,4,5,6,','];
      let test =array.findIndex(el => el==key);
      if (test===-1) {
        function removeKey() {
          let value=el.value;
          el.value =value.replace(key, '');
        }
        setTimeout(removeKey, 200);
      }
      })
      
      
    }
    addListener('[id="o-class-date"]')
    addListener('[id="r-class-date"]')
    addListener('[id="w-class-date"]')
    
    const v=(htmlElementSelector) => {
        let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
        let el=container.querySelector(htmlElementSelector);
        if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
        let value=el.value;
        if (!value) {
            el.style.outline='2px solid red';
            throw new Error('value is not present');
        }   
        return value
      }
    
    
    

    container.querySelectorAll('input').forEach(el => el.addEventListener('keyup', e => {
        needsToUpdate=true;
        save_btn.style.opacity=1;
        e.target.style.color='black';
        e.target.style.outline='none';

    }))



}