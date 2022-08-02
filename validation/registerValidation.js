const Validator = require('validator');
const isEmpty = require('./isEmpty');


const validatorRegisterInput = (data) => {
    let errors = {};


    //check the email field 
    if(isEmpty(data.email)){
        errors.email = "Email field cannot be empty"
    }else if(!Validator.isEmail(data.email)){
        errors.email = 'Email is invalid, please  provide a valid email'
    }

    // check password field 
    if(isEmpty(data.password)){
        errors.password = "password field cannot be empty "
    }else if (!Validator.isLength(data.password, {min: 6, max: 150})){
        errors.password = "password must be between 6 and 150 characters"
    }
    // check the name field 
    if(isEmpty(data.name)){
        errors.name = "name field cannot be empty "
    }else if (!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = "name must be between 2 and 30 characters"
    }

    // check the confirm password field 
    if(isEmpty(data.confirmPassword)){
        errors.confirmPassword = 'Confirm passworld field cannot be empty'
    }else if (!Validator.equals(data.password,data.confirmPassword)){
        errors.confirmPassword = 'Password and confirm password field must match '
    }

    return {
        errors,
        isValid:isEmpty(errors),
    }
};

module.exports = validatorRegisterInput;