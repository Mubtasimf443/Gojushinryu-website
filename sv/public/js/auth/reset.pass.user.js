
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{
    let primarybtn =document.querySelector('[primarybtn]');
    let form =document.querySelector('#reset_pass_form');
    let inp_prefik='---inp--';
    let em =document.getElementById(inp_prefik+'em');
    let otp_input =document.getElementById(inp_prefik+'otp');
    let ps=document.getElementById(inp_prefik+'ps');
    let cps=document.getElementById(inp_prefik+'cps')
    let notice_text = document.querySelector('#notice_text');
    var Mode ='Email';
    let Busy =false;
    let UserEmail =''
    function positiveNotice(text) {
        notice_text.style.color ='green';
        notice_text.style.fontSize='19px';
       notice_text.innerHTML=text;
       notice_text.style.textTransform='capitalize';

    }
    function negativeNotice(text) {
        notice_text.style.color ='red';
        notice_text.style.fontSize='19px';
       notice_text.innerHTML=text;
       notice_text.style.textTransform='capitalize';

    }
    async function requestOtp(params) {
        if (Busy) return
        let email =em.value ;
        if (!email.toString().includes('@')) return negativeNotice('email is not valid')
        if (!email.toString().includes('.')) return negativeNotice('email is not valid')
        if (email.toString().includes('"')) return negativeNotice('email is not valid')
        if (email.toString().includes("'")) return negativeNotice('email is not valid')
        if (email.toString().includes('{')) return negativeNotice('email is not valid')
        if (email.toString().includes('}')) return negativeNotice('email is not valid')
        Busy=true;
        setTimeout(() => {
              setTimeout(() => {
            Busy=false;
        }, 5000);
        }, 5000);
        primarybtn.style.opacity=.7;
        let jsonObj =JSON.stringify({email}) ;
        let response = await fetch(window.location.origin +'/api/auth-api/user/reset-password-opt-request',{
        headers:{
        'Content-Type':'application/json',
        },
        method:'POST',
        body:jsonObj
        });
        let {error,success} =await response.json();
        Busy=false;
        primarybtn.style.opacity=1;
        if (error) return alert(error)
        if (success) {
            positiveNotice('Otp is send by Mail')
            form.children[0].style.display ='none';
            for (let i = 1; i < 4; i++) form.children[i].style.display ='flex'
            Mode ='Password'
            primarybtn.innerHTML='Change Password';
            UserEmail=email;
        }
    }
    async function requestChangePassword(params) {
        if (Busy) return
        if (ps.value !== cps.value) ;
        let password = ps.value;
        let otp= otp_input.valueAsNumber;
        let email =UserEmail; 
        if (password.toString().trim().length < 5 || password.toString().trim().length >25 ) return negativeNotice('password Should min 5 and max 25 character long')
        if (password.toString().trim().length < 5 || password.toString().trim().length >25 )  return negativeNotice('password Should min 5 and max 25 character long')
        if (password.toString().includes('"')) return negativeNotice('can not use /, {,},:,;,",'+"'" )
        if (password.toString().includes("'")) return negativeNotice('can not use /, {,},:,;,",'+"'" )
        if (password.toString().includes('{')) return negativeNotice('can not use /, {,},:,;,",'+"'" )
        if (password.toString().includes('}')) return negativeNotice('can not use /, {,},:,;,",'+"'" )
        if (typeof opt === 'number') return alert('otp must be a number')
            Busy=true;
        setTimeout(() => {
              setTimeout(() => {
            Busy=false;
        }, 5000);
        }, 5000);
        primarybtn.style.opacity=.7;
        let jsonObj =JSON.stringify({email,password,otp}) ;
        let response = await fetch(window.location.origin +'/api/auth-api/user/reset-password-request',{
        headers:{
        'Content-Type':'application/json',
        },
        method:'POST',
        body:jsonObj
        });
        let {error,success} =await response.json();
        Busy=false;
        primarybtn.style.opacity=1;
        if (error) {
            if (error.includes('email')) {
                negativeNotice('Error,Falied To change Password');
                return setTimeout(() => {
                    window.location.reload()
                },5000);
            }
            if (!error.includes('email')) {
                negativeNotice(error)
            }
        }
        if (success) {
            positiveNotice('Password change successful')
            return setTimeout(() => {
                window.location.replace('/')
            }, 4000);
        }
    }
    primarybtn.addEventListener('click',e => {
        e.preventDefault();
        if (Mode ==='Email') return requestOtp() ;
        if (Mode === 'Password') return requestChangePassword();
    })
}