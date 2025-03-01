/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    async function setNotification(){
        let isGrandMasterNotificationSetUpDone=localStorage.getItem("isGrandMasterNotificationSetUpDone") === "YES"? 'YES' :"NO";
        async function requestNotification() {
            (Notification.permission !== 'granted') && (await Notification.requestPermission());
            if ('serviceWorker' in navigator) {
                const PublicKey = 'BBQwXL2fe9F7G3tzL3t1gPx5QhmDBSqs-v_MY1UyvqODVOvuWv8KinOar4jkWsqVSjWJsk0k_XdY_eae4un4DJc';
                function urlBase64ToUint8Array(base64String) {
                    const padding = '='.repeat((4 - base64String.length % 4) % 4);
                    const base64 = (base64String + padding)
                      .replace(/\-/g, '+')
                      .replace(/_/g, '/');
                    const rawData = window.atob(base64);
                    const outputArray = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; ++i) {
                      outputArray[i] = rawData.charCodeAt(i);
                    }
                    return outputArray;
                }
                let register = await navigator.serviceWorker.register('/js/gm/sw.js', { scope: '/js/gm/' });
                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly :true,
                    applicationServerKey : urlBase64ToUint8Array(PublicKey)
                });
                let response =await fetch(this.window.location.origin + '/api/api_s/grand-master/sw/subscribe', {
                    method: 'put',
                    body: JSON.stringify(subscription),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                });
                return response.ok;
            } else return false;
        }
        if (isGrandMasterNotificationSetUpDone === 'NO' ){
            if ((await requestNotification())){
                localStorage.setItem("isGrandMasterNotificationSetUpDone", 'YES');
                localStorage.setItem('grandMasterNotificatioSetupDate', Date.now());
            }
        }
        let grandMasterNotificatioSetupDate = localStorage.getItem("grandMasterNotificatioSetupDate") ?? undefined;
        if (isNaN(grandMasterNotificatioSetupDate)) throw 'grandMasterNotificatioSetupDate is NaN';
        grandMasterNotificatioSetupDate=Number(grandMasterNotificatioSetupDate);
        if (grandMasterNotificatioSetupDate < Date.now() -  60 * 60 * 1000) {
            if ((await requestNotification())){
                localStorage.setItem("isGrandMasterNotificationSetUpDone", 'YES');
                localStorage.setItem('grandMasterNotificatioSetupDate', Date.now());
            }
        }
    }
    setNotification();
}