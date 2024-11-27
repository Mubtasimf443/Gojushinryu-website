
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
let name = document.getElementById("fname"),
    email = document.getElementById("email"),
    dob= document.getElementById("dob"),
    phone = document.getElementById("phone"),
    image = document.getElementById("image"),
    country = document.getElementById("country"),
    decription= document.getElementById("decription");

function isEmty(dom) {
    let value;

    if (dom.tagName==='SELECT'){
        value=dom.selectedOptions[0].value
        if (!value) {
            throw {
                massage:'Value is emty',
                dom 
            }   
        }
        return value;
    }

    value=dom.value;

    if (!value) {
        throw {
            massage:'Value is emty',
            dom 
        }
    }

    return value
}

function isEmail(dom) {
    let value=dom.value;
    if (value.includes('@')===false ||value.includes('.')===false ) {
        throw {
            massage:'the value is not a valid email',
            dom 
        }
    }
    return value
}

function isNumber(dom) {
    if (Number(dom.value).toString() ==='NaN') {
        throw {
            massage:'the value is not a valid Number',
            dom 
        }
    } 
    return dom.value
}

function checkNumber(value) {
    if (Number(value).toString()==='NaN') return false
    if (Number(value).toString()!=='NaN') return true
}

function isDate(dom) {
    let value =dom.value;
    if (!value.includes('-')) {
        throw {
            massage :'Value is not a date',
            dom
        }
    }
    if (value.includes('-')) {
        let arr=value.split('-');
        if (arr.length!==3) {
            throw {
                massage: 'Value is not a date',
                dom
            }
        }
        if (arr[0].length===4 && checkNumber(arr[0])) {
            if (arr[1].length===2 && checkNumber(arr[1])) {
                if (arr[2].length===2 && checkNumber(arr[2])) {
                    return value
                } else {
                    throw {
                        massage: 'Value is not a date',
                        dom
                    }
                }
            } else {
                throw {
                    massage: 'Value is not a date',
                    dom
                }
            }
        } else {
            throw {
                massage: 'Value is not a date',
                dom
            }
        }
    }
}
document.querySelector('select').selectedOptions[0].value


function formSubmit(event) {
    event.preventDefault()
    try{
        
        let img=image.files[0];
        if (
            img.type !==`image/jpg` &&
            img.type !==`image/jpeg` &&
            img.type !==`image/png` &&
            img.type !==`image/webp` 
        ) throw {
            massage :'Image Is not Allowed , Please change the image',
            dom:image
        };
        isEmty(email);
        isEmty(dob);
        isEmty(name);
        isEmty(decription);
        isEmty(country)
        isEmty(phone);
        isEmail(email);
        isNumber(phone);
        isDate(dob)
        let form =new FormData();
        form.append('email', email.value);
        form.append('name',name.value);
        form.append('country',country.selectedOptions[0].value);
        form.append('decription',decription.value);
        form.append('phone',phone.value);
        form.append('dob',dob.value);
        
        let requestUrl=window.location.origin+'/api/l-api'
        fetch(requestUrl, {
            method :'POST',
            body:form
        })
        .then(function (reeponse) {
            if (response.status ===201) {
                document.querySelector('success_status').innerHTML='Thank You , Your Application was successfully recieved';
                document.querySelector('success_status').style.color='green';
                setTimeout(() => {
                    window.location.replace('/')
                }, 3000);
                return;
            }
            if (response.status !==201) {
                document.querySelector('success_status').innerHTML='Sorry , But failed to Submit application ,Please Try again';
                document.querySelector('success_status').style.color='red';
                setTimeout(() => {
                    window.location.replace('/')
                }, 3000);
                return;
            }
        })

    } catch (error) {
        console.log(error);
        if (typeof error === 'object') {
            if(error.massage) {
                if (error.dom) error.dom.classList.add('is-invalid');
                error.dom.parentNode.querySelector('label').innerText=error.massage;
                error.dom.parentNode.querySelector('label').classList.add('text-danger')
            }
        }
    }
}