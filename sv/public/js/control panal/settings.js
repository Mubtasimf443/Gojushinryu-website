/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
  let container = document.querySelector(`#settings-conatiner`);
  let needsToUpdate = false;
  let save_btn = container.querySelector(`[save_btn]`)
  let uploading = false;

  function testDate(date = '') {
    if (date === '') return false;
    let array = date.split(',');
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (Number(element).toString() === 'NaN') return false;
      if (Number(element) < 0 || Number(element) > 6) return false;
    }
    return array;
  }


  function makered4000(val) {
    let value1=container.querySelector(val).value ;
    container.querySelector(val).value = 'You can not use date more then 6'
    container.querySelector(val).style.color = 'red';
    setTimeout(function() {
      container.querySelector(val).value=value1;
    }, 1000);
    setTimeout(function () {
      container.querySelector(val).style.color = 'black'
    }, 2000);
  }

  save_btn.addEventListener('click', async e => {
    if (uploading) return
    let date_of_online_class = v('[id="o-class-date"]');
    let date_of_regular_class = v('[id="r-class-date"]');
    let date_of_womens_defence_class = v('[id="w-class-date"]');
    let home_video_url = v('[id="h-video-url-inp"]');
    let fees_of_Bhangra_fitness = container.querySelector('input#fees_of_Bhangra_fitness').valueAsNumber;
    let fees_of_reqular_class =  container.querySelector('input#fees_of_reqular_class').valueAsNumber
    let gst_rate = container.querySelector('input#gst_rate').valueAsNumber;
    
    [ fees_of_Bhangra_fitness,fees_of_reqular_class , gst_rate]=[Number(fees_of_Bhangra_fitness) ,Number(fees_of_reqular_class) ,Number(gst_rate)]
    
    if (testDate(date_of_online_class) === false) return makered4000(`[id="o-class-date"]`);
    if (testDate(date_of_regular_class) === false) return makered4000(`[id="o-class-date"]`);
    if (testDate(date_of_womens_defence_class) === false) return makered4000(`[id="w-class-date"]`);
   
    if (fees_of_Bhangra_fitness.toString()==='NaN' ) return alert('fees_of_Bhangra_fitness should be a number');
    if (fees_of_reqular_class.toString()==='NaN' ) return alert('fees_of_reqular_class should be a number');
    if (gst_rate.toString()==='NaN' ) return alert('gst_rate should be a number');
    if (gst_rate > 75 || gst_rate < 1) return alert('gst rate should be bigger than 0 and greated than 75');

    try {
      uploading = true;
      save_btn.style.opacity = .6;
      let res = await fetch(window.location.origin + '/api/api_s/change-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date_of_online_class,
          date_of_regular_class,
          date_of_womens_defence_class,
          home_video_url,
          fees_of_reqular_class,
          fees_of_Bhangra_fitness,
          gst_rate
        })
      });
      if (res.status === 200) {
        save_btn.style.background = 'green';
        save_btn.innerHTML = 'Updated';
        setTimeout(() => {
          save_btn.style.background = 'black';
          save_btn.innerHTML = 'Save';
          save_btn.style.opacity = .67;
        }, 2000);
      }
    } catch (error) {
      console.log({ error });

    } finally {
      save_btn.style.opacity = 1;
      uploading = false;
    }


  })
  let addListener = (querySelector) => {
    let el = container.querySelector(querySelector);
    el.addEventListener('keypress', e => {
      let key = e.key;
      let array = [0, 1, 2, 3, 4, 5, 6, ','];
      let test = array.findIndex(el => el == key);
      if (test === -1) {
        function removeKey() {
          let value = el.value;
          el.value = value.replace(key, '');
        }
        setTimeout(removeKey, 200);
      }
    })


  }
  addListener('[id="o-class-date"]')
  addListener('[id="r-class-date"]')
  addListener('[id="w-class-date"]')

  const v = (htmlElementSelector) => {
    let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
    let el = container.querySelector(htmlElementSelector);
    if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
    let value = el.value;
    if (!value) {
      el.style.outline = '2px solid red';
      throw new Error('value is not present');
    }
    return value
  }

  container.querySelectorAll('input').forEach(el => el.addEventListener('keyup', e => {
    needsToUpdate = true;
    save_btn.style.opacity = 1;
    e.target.style.color = 'black';
    e.target.style.outline = 'none';
  }))



}