'use strict';



let api_token = "";

//login
document.querySelector('.js-btn-login').addEventListener('click', () => {
    const inputEmail = document.querySelector('.js-input-email');
    const inputPass = document.querySelector('.js-input-pass');
    const text = document.querySelector('.js-login-text')
    const bodyParams = {
        email: inputEmail.value,
        pass: inputPass.value
    };
    

    fetch('http://localhost:5005/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyParams)
    })
    .then(response => response.json())
    .then(responseData => {
      api_token= responseData.token; 
      console.log(responseData);
      if (responseData.success) {
        text.innerHTML= "Inicio de sesión correcto"
      } else {
        text.innerHTML= "NO ha podido iniciar sesión"
        printJson('.js-login-result', responseData.message);
      }
      
    });
});


//travel
document.querySelector('.js-btn-travel').addEventListener('click', () => {
    const travelResult = document.querySelector('.js-travel-result');

    fetch('http://localhost:5005/travel', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(responseData => {
        if(responseData.success) {
            printJson('.js-travel-result', responseData.results);
        } else {
            travelResult.innerHTML="Error en la solicitud"
        }
    })
})

const printJson = (selector, jsonData) => {
    const jsonHtml = JSON.stringify(jsonData, null, 2);
    document.querySelector(selector).innerHTML = jsonHtml;
};