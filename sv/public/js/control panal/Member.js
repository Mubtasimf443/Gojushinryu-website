/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

  let memberListContainer = document.querySelector('#list-of-member')
  let memberIsSeen = false;
  let membersArray = [];
  let table = memberListContainer.querySelector('table');
  let popup = document.querySelector('#popup_for_membership_data')

  let Observer = new IntersectionObserver(entry => {
    if (entry[0].target.id === 'list-of-member' && entry[0].isIntersecting && !memberIsSeen) {
      memberIsSeen = true;

    }
  });


  Observer.observe(memberListContainer)
}
