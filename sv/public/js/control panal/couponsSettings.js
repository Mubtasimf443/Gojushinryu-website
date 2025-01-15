/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
    let container =document.querySelector('#settings-of-coupons-container');
    let table =container.querySelector('table');
    let seen=false;
    let couponsAsArray=[];
    const apiBaseUrl =window.location.origin+'/api/api_s/coupons/memberships';
    const v =new( class {
        constructor(container=document){
            this.container=container;
            
        }
        t(val){
            val =this.container.querySelector(val);
            if (!val) throw `val : ${val} is not a valid selector`;
            if (!val.value?.trim()) {
                val.style.outline='2px solid red';
                val.addEventListener('change', function(e){
                    e.target.style.outline='none';
                });
                throw 'their is no value of val';
            }
            return val.value?.trim();
        }
        n(val) {
            val = this.container.querySelector(val);
            if (!val) throw `val : ${val} is not a valid selector`;
            if (val.type !== 'number') val.type = 'number';
            
            if (!val.valueAsNumber) {
                val.style.outline = '2px solid red';
                val.addEventListener('change', function (e) {
                    e.target.style.outline = 'none';
                });
                throw 'their is no value of val and value of val is ' + val.value;
            }
            return val.valueAsNumber;
        }
        dn(val){
            val = this.container.querySelector(val);
            if (!val) throw `val : ${val} is not a valid selector`;
            if (val.type !== 'date') val.type = 'date';
            if (!val.valueAsNumber) {
                val.style.outline = '2px solid red';
                val.addEventListener('change', function (e) {
                    e.target.style.outline = 'none';
                });
                throw 'their is no value of val and value of val is ' + val.value;
            }
            return val.valueAsNumber;
        }
    })(container)
    let observer =new IntersectionObserver(
        async function (entries) {
            if (entries[0].isIntersecting && seen === false) {
                seen=true;
                let res=await fetch(apiBaseUrl);
                if (res.status===200) {
                    couponsAsArray=await res.json();
                    organizeTable();
                }
            }
        }
    );

    observer.observe(container);

    function organizeTable() {
        couponsAsArray.forEach(function(el,) {
            if (el.expiringDate <= Date.now()) {
                fetch(apiBaseUrl +`/deactivate?id=${el.id}` ,{method:'PUT'});
                couponsAsArray[i].activated=false;
                const tm = setTimeout(function () {
                    organizeTable();
                    clearTimeout(tm);
                }, 2000);
            }
        })
        let tbody=table.querySelector('tbody');
        tbody.innerHTML=null;
        let insertionHtml=``;
        for (let i = 0; i < couponsAsArray.length; i++) {
            const {name , code ,expiringDate , rate , activated, id} = couponsAsArray[i];
            insertionHtml +=(`
                <tr tr_mcp_id="${id}">
                <td><input inp_name type="text" value="${name}" maxlength="20" changed="false" minlength="5" disabled>  </td>
                <td><input inp_code type="text" value="${code}" changed="false" disabled> </td>
                <td><input inp_rate type="number" value="${rate*100}"  max="75" min="1" changed="false" disabled> </td>
                <td><input inp_exp_date type="text" value="${new Date(expiringDate).toLocaleDateString()}"  changed="false" disabled ></td>
                <td>
                    <button class="btn btn-edit" mcp_id="${id}" state="edit"><i class="fa-solid fa-pen-to-square" title="Edit"></i></button>
                    <button class="btn btn-delete" mcp_id="${id}"><i class="fa-solid fa-trash" title="Delete"></i></button>
                    <button class="btn btn-activate-or-deactivate" 
                    style="background:${ (activated ? 'rgb(76, 175, 80)' : "rgb(255, 0, 0)")}" 
                    title="${activated ? 'Activated' : 'Deactivated'}"
                    activated="${activated}"
                    mcp_id="${id}">
                    <i class="fa-solid fa-${ activated ? 'unlock' : "lock"}"></i> 
                    </button>
                </td>
                <td>${expiringDate < Date.now() ? 'Expired' : (activated === true ? 'Activated' : "Deactivated") }</td> 
                </tr> `
            );
        }
        tbody.innerHTML=insertionHtml;
        tbody.querySelectorAll('.btn-edit').forEach(
            function (element) {
                function edit(e) {
                    e.preventDefault();
                    let btn = (e.target.tagName === 'I' ? e.target.parentNode : e.target);
                    let id = btn.getAttribute('mcp_id');
                    if (couponsAsArray.find(el => (el.id == id ? el : undefined))=== undefined) return;
                    let { name, rate, code, expiringDate, activated } = couponsAsArray.find(function(element){
                        if (element.id == id ) return element;
                        else return;
                    });
                    let tr = table.querySelector(`[tr_mcp_id="${id}"]`);
                    if (btn.getAttribute('state') === 'edit') {
                        let inputs = tr.querySelectorAll('input');
                        inputs.forEach(el => (el.disabled = false));
                        inputs[3].type = 'date';
                        inputs[3].valueAsDate = new Date(expiringDate);
                        btn.innerHTML = `<i class="fa-solid fa-floppy-disk" title="Save"></i> `;
                        inputs.forEach(el => (el.style.outline = 'none'));
                        inputs.forEach(function(el  ){
                            el.addEventListener('change',function(e){
                                e.target.setAttribute('changed','true');
                            })
                        })
                        btn.setAttribute('state', 'save');
                        return;
                    }
                    if (btn.getAttribute('state') === 'save') {
                        let inputs = tr.querySelectorAll('input');
                        let 
                        name = inputs[0].value, 
                        code = inputs[1].value, 
                        rate = inputs[2].valueAsNumber;
                        inputs[3].type = 'date';
                        expiringDate = inputs[3].valueAsNumber;
                        if (name.trim().length === 0) return inputs[0].style.outline = '2px solid red';
                        if (code.trim().length === 0) return inputs[1].style.outline = '2px solid red';
                        code = code.toUpperCase();
                        inputs[1].value = code;
                        if (rate < 1 || rate > 75) return inputs[2].style.outline = '2px solid red';
                        rate = rate / 100;
                        if (expiringDate < Date.now()) return inputs[3].style.outline = '2px solid red';
                        inputs.forEach(el => (el.disabled = true));
                        couponsAsArray = couponsAsArray.map(
                            function (el) {
                                if (el.id == id) return ({ ...el, name, code, expiringDate, rate });
                                else return el;
                            }
                        );
                        let changed =false ;
                        for (let i = 0; i < 4; i++) {
                            if (inputs[i].getAttribute('changed') === 'true') {
                                inputs[i].setAttribute('changed', 'false');
                                changed = true;
                            }
                        }
                        if (changed) {
                            id = Number(id);
                            fetch(apiBaseUrl, {
                                method: "PUT",
                                body: JSON.stringify({ name, rate, code, expiringDate, id }),
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                        btn.innerHTML = `<i class="fa-solid fa-pen-to-square" title="Save"></i> `;
                        btn.setAttribute('state', 'edit');
                        return;
                    }
                }
                element.addEventListener('click', edit);
                element.querySelector('i').addEventListener('click', edit);
            }
        );
        tbody.querySelectorAll('.btn-delete').forEach(
            function (el) {
                el.addEventListener('click', function(e){
                    e.preventDefault();
                    let btn = (e.target.tagName === 'I' ? e.target.parentNode : e.target);
                    let id = btn.getAttribute('mcp_id');
                    couponsAsArray = couponsAsArray.filter(el => (el.id != id ? el : undefined));
                    fetch(apiBaseUrl+`?id=${id}`,{method :"DELETE"} );
                    return organizeTable();
                })
            }
        );
        tbody.querySelectorAll('.btn-activate-or-deactivate').forEach(function(element){
            element.addEventListener('click', function(e){
                e.preventDefault();
                let btn = (e.target.tagName === 'I' ? e.target.parentNode : e.target);
                let id = btn.getAttribute('mcp_id');
                if (btn.getAttribute('activated') === 'true') {
                    couponsAsArray=couponsAsArray.map(function(el){
                        if (el.id ==id) {
                            el.activated=false ;
                            return el;
                        } else return el;
                    });
                    fetch(apiBaseUrl + `/deactivate?id=${id}`, { method: 'PUT' });
                    organizeTable();
                    return;
                } else {
                    couponsAsArray=couponsAsArray.map(function(el){
                        if (el.id ==id) {
                            el.activated=true ;
                            return el;
                        } else return el;
                    });
                    fetch(apiBaseUrl + `/activate?id=${id}`, { method: 'PUT' });
                    organizeTable();
                    return;
                }
            })
        });
        tbody.querySelectorAll('input').forEach(element => (element.onchange = function (e) { e.target.style.outline = 'none' }));
    }

    { //form
        let requesting = false;
        let btn = container.querySelector('button[add_coupon_btn]');
        btn.addEventListener('click', async function (event) {
            event.preventDefault();
            let
                name = v.t(`[couponName]`),
                code = v.t(`[couponCode]`),
                rate = v.n(`[couponRate]`),
                expiringDate = v.dn(`[placeholder="Expiration Date"]`);
            if (rate < 1 || rate > 75) return alert('discount rate can not be bigger than 75 or less than 1');
            if (expiringDate < Date.now()) return alert('the date of expiration is not valid');
            if (requesting === true) return;
            requesting = true;
            let response = await fetch(apiBaseUrl, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    code,
                    rate: (rate / 100),
                    expiringDate
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            requesting = false;
            if (response.status === 201) {
                let data = await response.json();
                return organizeTable(couponsAsArray.push(data));
            }
            if (response.status !== 201) {
                btn.innerHTML = 'Error';
                btn.style.background = 'red';
                response=await response.json().catch(function(error){
                    return ({error :'failed parse json data'});
                });
                // console.log(response);
                setTimeout(() => {
                    btn.innerHTML = 'Add';
                    btn.style.background = '#4CAF50';
                    container.querySelectorAll(`[couponName],[couponCode],[couponRate],[expirationDate]`).forEach(el => el.value = null);
                }, 2000);
            }
        })
    }
}