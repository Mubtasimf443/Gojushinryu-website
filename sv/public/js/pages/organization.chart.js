/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

async function load() {
    // JavaScript for Popup Functionality
    const popup = document.getElementById('imagePopup');
    const popupImage = document.getElementById('popupImage');
    const closeBtn = document.getElementById('closePopup');

    let origin = window.location.origin + '/api/api_s/organization-chart';
    let data = await fetch(origin);
    let chartData = await data.json();
    document.querySelector(`[id="org-chart-sec-2-chart-list-div"]`).innerHTML = '';
    let i = 0;
    document.querySelector(`[ id="---main--chart-img"]`).src=chartData[0].url
    while (i < chartData.length) {
      const chartLink = chartData[i].url;
      const chartid = chartData[i].id;
      let image = document.createElement("img");
      image.src = chartLink;
      image.alt = `Chart ${chartid}`;
      image.classList.add('chart-list-img');
      document.querySelector(`[id="org-chart-sec-2-chart-list-div"]`).appendChild(image);
      i+=1;
    }
    // Open Popup
    document.querySelectorAll('#org-chart-sec-2-chart-list-div img').forEach(img => {
      img.addEventListener('click', () => {
        popupImage.src = img.src;
        popupImage.alt = img.alt;
        popup.style.display = 'flex';
      });
    });

    // Close Popup
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    // Close Popup on Outside Click
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.style.display = 'none';
      }
    });

  }
  load()