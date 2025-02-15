/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/


// Fetch seminars from API

async function fetchSeminars() {
  try {
    const response = await fetch(window.location.origin + '/api/api_s/saminars/');
    const seminars = (await response.json())?.data || [];
    const grid = document.getElementById('seminars-grid');

    grid.innerHTML = '';

    seminars.forEach(seminar => {
       
      
      const card = document.createElement('div');
      card.classList.add('seminar-card');
      card.innerHTML = `
            <img src="${seminar.imageUrl}" alt="${seminar.title}">
            <div class="seminar-info">
              <h3>${seminar.title}</h3>
              <p>${seminar.description}</p>
              <div class="seminar-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${seminar.location}</span>
                <span><i class="fas fa-calendar"></i> ${seminar.date}</span>
                <span><i class="fas fa-clock"></i> ${seminar.time}</span>
              </div>
              <button class="contact-btn" onclick="saminarForm()" >Apply Now</button>
            </div>
          `;
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching seminars:', error);
  }
}

function saminarForm() {
  window.location.replace('/saminar-form')
}

let currentSeminarId = null;
// Open popup form
function openPopup(seminarId) {
  document.getElementById('popup').classList.add('active');
  currentSeminarId = seminarId;
}

// Close popup form
function closePopup() {
  document.getElementById('popup').classList.remove('active');
}

// On page load, fetch seminars
fetchSeminars()


document.querySelector(`[id="applicationForm"]`).addEventListener('submit', async function submitForm(event) {
  let btn = document.querySelector('.apply-btn');
  try {
    event.preventDefault();

    const name = document.getElementById('applicantName').value.trim();
    const email = document.getElementById('applicantEmail').value.trim();
    const phone = document.getElementById('applicantPhone').value.trim();
    const message = document.getElementById('applicantMessage').value.trim();
  
    // Validation
    if (!name || typeof name !== 'string') {
      alert('Please enter a valid name.');
      return;
    }
    
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const phonePattern = /^\+?[0-9]{7,15}$/;
  if (!phonePattern.test(phone)) {
    alert('Please enter a valid phone number.');
    return;
  }

  if (message.length < 50 || message.length > 1000) {
    alert('Message must be between 50 and 200 characters.');
    return;
  }

  // Send POST request to API
  let url = window.location.origin + '/api/api_s/saminars/apply';
  btn.style.tansition = 'all .8s ease';
  btn.style.opacity=.65;
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seminarId: currentSeminarId, name, email, phone, message })
  });
  

  let isPosted = response.status === 201;
  if (isPosted) {
    let preHtml = btn.innerHTML;
    let preBg = btn.style.background;
    btn.innerHTML = '<i class="fas fa-check" style="font-size: 24px; color: #fff;"></i> ' + 'Submited ';
    btn.style.background = 'green';
    btn.style.opacity=1;
   
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 2000);
    });
    btn.innerHTML = preHtml;
    btn.style.background = preBg;
    document.querySelector('#popup').querySelectorAll('input').forEach(function (el) { el.value = null });
    document.querySelector('#popup').querySelector('textarea').value = null ;
  }
  document.getElementById('popup').classList.remove('active');

  } catch (error) {
    console.log(error);
  } finally {
    btn.style.opacity=1;
  }
 
})