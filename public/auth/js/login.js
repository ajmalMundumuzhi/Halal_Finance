const { default: axios } = require("axios")

document.addEventListener('DOMContentLoaded',()=>{
    const userInput = document.getElementById('userInput')
    const emailInput = document.getElementById('emailInput')
    const passwordInput = document.getElementById('passwordInput')
    const submit = document.getElementById('submit')
    const error = document.getElementById('error')

    submit.addEventListener('click',(event)=>{
        event.preventDefault()
        const data = {
            username : userInput.value,
            email : emailInput.value,
            password : passwordInput.value
        }
        axios.post('/auth/login',data)
        .then((response)=>{
            console.log(response.data.user)
            localStorage.setItem('token', response.data.token)
            
            if(response.data.user === 'admin'){
                window.location.href = '/admin'
            }else if(response.data.user === 'mentor'){
                window.location.href = '/'
            }else{
                window.location.href = '/'
            }
        })
        .catch((err) => {
            console.log(err.response)
            if(err.response && err.response.status === 401){
                error.type = 'text'
                error.value = error.response.data.data || 'Invalid credantials, please try again'
            }else{
                console.log("An unexpected error occured : ", err.response || err)
                error.type = 'text'
                error.value = "An unexpected error occured"     
            }
        })
    })
})