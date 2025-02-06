/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/
{
    let containar = document.querySelector('#Country_Representative_container');

    let
        not_requesting_to_allow = true,
        seen = false,
        table = containar.querySelector('table'),
        representatives = [];



    let observer = new IntersectionObserver(async function (entries) {
        if (entries[0].isIntersecting === false || seen) return;
        seen = true;
        let response = await fetch(window.location.origin + '/api/api_s/country-representative-for-admin')
        representatives = response.status === 200 ? (await response.json()) : representatives;
        loadCountryRepresentative();
    });
    observer.observe(containar);

    async function loadCountryRepresentative() {
        let countriesAndFlags = [
            ["USA", "/img/flag/usa.png"],
            ["India", "/img/flag/india.png"],
            ["Canada", "/img/flag/canada.png"],
            ["Australia", "/img/flag/australia.png"],
            ["South Korea", "/img/flag/skorea.png"],
            ["Germany", "/img/flag/germany.png"],
            ["China", "/img/flag/china.png"],
            ["Brazil", "/img/flag/brazil-305531_640.png"],
            ["United Kingdom", "/img/flag/UnitedKingdom.png"],
            ["UAE", "/img/flag/UAE.png"],
            ["Italy", "/img/flag/italy.png"],
            ["Switzerland", "/img/flag/Switzerland.png"],
            ["Netherlands", "/img/flag/Netherlands.png"],
            ["Sweden", "/img/flag/Sweden.png"],
            ["Singapore", "/img/flag/singapore.png"],
            ["Russia", "/img/flag/russia.png"],
            ["argentina", "/img/flag/argentina.png"],
            ["Japan", "/img/flag/japan.png"],
            ["south africa", "/img/flag/south-africa.png"],
            ["bangladesh", "/img/flag/bangladesh.png"],
            ["pakistan", "/img/flag/pakistan.png"],
            ["vietnam", "/img/flag/vietnam.png"]
        ];
        try {
            let insertionHtml = ``;
            for (let i = 0; i < representatives.length; i++) {
                let { name, id, country, thumbUrl, approved_by_admin, payment_data } = representatives[i];
                let countries = countriesAndFlags.find(el => {
                    if (el[0].toLowerCase() === country.toLowerCase()) {
                        return el
                    }
                });
                let flag = countries ? countries[1] : '/img/flag/flag.png';
                insertionHtml += (`
                    <tr>
                        <td><img src="${thumbUrl}" alt="country representative image" ></td>
                        <td> ${name}</td>
                        <td><img src="${flag}" alt="country flag" > </td>
                        <td style="color:${payment_data?.isPaymentCompleted ? 'green' : 'initial'}">
                        ${approved_by_admin ? 'Approved' : 'Not Approved'},<br>
                        ${payment_data.isPaymentCompleted ? "Paid " + payment_data.paymentAmount.toFixed(2) : (payment_data?.paymentRequestInfo?.isPaymentRuquested ? 'Payment Requested at ' + new Date(payment_data?.paymentRequestInfo?.paymentRequestedDateNum).toLocaleDateString() : 'No Paid,<br>Not Requested')}
                        </td>
                        <td  style="color:${payment_data?.isPaymentCompleted ? 'green' : 'initial'}" >${payment_data?.isPaymentCompleted ? new Date(payment_data?.paymentDateNum).toLocaleDateString() :
                        payment_data?.paymentRequestInfo?.isPaymentRuquested ? 'Requested' : `<button cr-id="${id}" class="rq-btn">Request</button>`

                    }
                             </td>
                        <td> <button representative_id="${id}" class="allow-btn" style="background-color:${approved_by_admin ? 'Green' : 'red'}" >${approved_by_admin ? 'Active' : 'NotActive'}</button></td>
                    </tr>`);
            }
            table.querySelector('tbody').innerHTML = null;
            table.querySelector('tbody').innerHTML += insertionHtml;
            let allowBtns = table.querySelectorAll('.allow-btn');
            let requestBtns = table.querySelectorAll('.rq-btn');
            for (let i = 0; i < allowBtns.length; i++) allowBtns[i].onclick = allowDisAllowCr;
            for (let i = 0; i < requestBtns.length; i++) requestBtns[i].onclick = requestPayment;

        } catch (error) {
            console.log(error);
        }
    }

    async function allowDisAllowCr(event = new Event('click')) {
        try {
            event.preventDefault();
            let id = event.target.getAttribute('representative_id');
            id = Number(id);
            let representative = representatives.find(
                function (element) {
                    if (element.id === id) {
                        return element;
                    }
                }
            );
            if (!representative) return
            if (!not_requesting_to_allow) return;

            let btn = table.querySelector(`[representative_id="${representative.id}"]`);
            btn.style.opacity = .65; not_requesting_to_allow = false;
            let url = window.location.origin + '/api/api_s/' + ((representative.approved_by_admin === true) ? 'disAllow-representative' : "allow-representative");
            let response = await fetch(url, {
                method: 'put',
                body: JSON.stringify({ id: representative.id }),
                headers: { 'Content-Type': 'application/json' }
            });
            let isChanged = response.status === 200;

            if (isChanged) {
                representatives = representatives.map(function (element) {
                    return (element.id === representative.id ? ({ ...element, approved_by_admin: !element.approved_by_admin }) : element);
                });
                loadCountryRepresentative();
            }
        } catch (error) {
            console.log(error);
        } finally {
            not_requesting_to_allow = true
            event.target.style.opacity = 1;
        }

    }
    let modal = containar.querySelector('.crFeesModal');
    let modalCloseBtn = modal.querySelector('.model-cancel');
    let modalSubmitBtn = modal.querySelector('.model-submit');

    async function requestPayment(event = new Event('click')) {
        try {
            event.preventDefault();
            event.target.style.opacity = .65;
            let id = event.target.getAttribute('cr-id');
            if (!id) return alert('Failed to request Form Country representative');
            modal.classList.add('active');
            modal.setAttribute('cr-id', id);
        } catch (error) {
            console.log(error);
        } finally {
            event.target.style.opacity = 1;
        }
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalSubmitBtn.addEventListener('click', subMitFeesRequest);

    function closeModal(event = new Event('click')) {
        event.preventDefault();
        modal.removeAttribute('cr-id');
        modal.querySelector('input').valueAsNumber = 0;
        modal.classList.remove('active');
    }
    let isRequestingFees = false;
    async function subMitFeesRequest(event = new Event('click')) {
        event.preventDefault();
        if (isRequestingFees) return;
        isRequestingFees = true;
        let id = modal.getAttribute('cr-id');
        if (!id) return alert('Failed to request Form Country representative');
        let fees = modal.querySelector('input').valueAsNumber;
        if (!fees || fees.toString() === 'NaN' || fees === 0) return alert('Please Give Us Fees, Fees Can not be 0');
        let queryParameters = new URLSearchParams({ id, fees }).toString();
        try {
            closeModal(new Event('click'));
            let span = document.createElement('span'); span.innerText = 'Requested'; 
            table.querySelectorAll('.rq-btn').forEach(function (el) {
                if (el.getAttribute('cr-id') == id) el.replaceWith(span);
            })
            let isRequested = (await fetch(window.location.origin + '/api/api_s/country-representative/payment/request?' + queryParameters, { method: "post" })).status === 200;
            if (isRequested === true) {
                representatives = representatives.map(function (element) {
                    if (element.id == id) {
                        (typeof element.payment_data.paymentRequestInfo !== 'object') && (element.payment_data.paymentRequestInfo = ({}));
                        element.payment_data.paymentRequestInfo.isPaymentRuquested = true;
                        element.payment_data.paymentRequestInfo.paymentRequestedDateNum = Date.now();
                        element.payment_data.paymentRequestInfo.paymentRequestedDate = new Date();
                        return element;
                    } else return element;
                });
            }
            else if (isRequested === false) {
                alert('Failed Request');
            }
        } catch (error) {
            console.log(error);
        } finally {
            loadCountryRepresentative();
            isRequestingFees = false;
        }
    }
}