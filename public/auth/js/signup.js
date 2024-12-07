const { default: axios } = require("axios")
const { response } = require("express")

document.addEventListener('DOMContentLoaded',()=>{
    const userInput = document.getElementById('userInput')
    const emailInput = document.getElementById('emailInput')
    const passwordInput = document.getElementById('passwordInput')
    const submit = document.getElementById('submit')
    const error = document.getElementById('error')

    submit.addEventListener('click',(event) => {
        event.preventDefault()
        const data = {
            username : userInput.value,
            email : emailInput.value,
            password : passwordInput.value
        }
        axios.post('/auth/signup',data)
        .then((response) => {
            console.log(response.data);
            if(response.data.success){
                window.location.href = '/auth/login'
            }else{
                error.type = 'text'
                error.value = response.data.data || "Invalid data, check your details"
            }
        })
        .catch((err)=>{
            console.log(err.response)
            if(err.response && err.response.this.status === 422){
                err.type = 'text'
                err.value = err.response.data.message 
            }else{
                console.log("An unexpected error occured", err.response || err)
                err.value = "An unexpected error occured, please try again"
            }
        })
    })
})