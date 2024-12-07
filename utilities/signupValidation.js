exports.validationField = (fields)=>{
    return fields.every(field => field)
}

exports.clientValidation = (client) => {
    const clientRejex = /^[a-zA-Z0-9]{2,}$/
    return clientRejex.test(client)
}

exports.emailValidation = (email) =>{
    const emailReejex =/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailReejex.test(email)
}

exports.passwordValidation = (password) => {
    const passwordRejex = /^[a-z]+$/
    return passwordRejex.test(password)
}

exports.nameValidation = (Name) => {
    const nameRejex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/
    return nameRejex.test(Name)
}


// ^[a-zA-Z0-9]{2,}$ user
// /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ email
// /^[a-z]+$/ pass 
// /^[a-zA-Z\s]+$/  Name