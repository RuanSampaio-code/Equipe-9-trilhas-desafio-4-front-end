document.addEventListener('DOMContentLoaded', () => {
    const complaintForm = document.querySelector("#complaint-form");
    const autho = document.querySelector("#author");
    const category = document.querySelector("#category");
    const busline = document.querySelector("#busline");
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const latitude = document.querySelector("#latitude");
    const longitude = document.querySelector("#longitude");
    const submit = complaintForm.querySelector("#submit-btn");

    submit.addEventListener('click', async (e) => {
        e.preventDefault();

        const complaintData = {
            author: autho.value,
            category: category.value,
            busline: busline.value,
            title: title.value,
            description: description.value,
            localization: [latitude.value, longitude.value],
        }; 

        console.log(JSON.stringify(complaintData));

        const res = await fetch('https://express-api-h6xd.onrender.com/denuncias', {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(complaintData),
        });

        console.log(res.json());

    })
});