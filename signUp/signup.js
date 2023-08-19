// ---------Firbase Authentication----------

import { auth, createUserWithEmailAndPassword, setDoc, doc, db, } from "../firebaseConfig.js";


// ---------Signup Create Variables----------

const userFirstName = document.querySelector("#firstName");
// console.log(userFirstName);
const userSurName = document.querySelector("#lastName");
// console.log(userSurName);
const userSignUpEmail = document.querySelector("#email");
// console.log(userSignUpEmail);
const userSignUpPassword = document.querySelector("#password");
// console.log(userSignUpPassword);
const userSignUpConfirmPassword = document.querySelector("#Confirmpassword");
// console.log(userSignUpConfirmPassword);
const userSignUpBtn = document.querySelector(".signUpBtn");
// console.log(userSignUpBtn);
const signupShowPassword = document.querySelector("#showPassword")
// console.log(signupShowPassword);
// console.log(userSignUpBtn);
const signupShowConfirmPassword = document.querySelector("#showConfirmPassword")
// console.log(signupShowConfirmPassword);


// ---------Signup Function----------


async function signUpHandler() {

    if (userFirstName.value == "" || userSurName.value == "" || userSignUpEmail.value == "" || userSignUpPassword.value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Please fill all input fields'
        })

    } else {
        if (userSignUpPassword.value.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Your password should be contains atleast 8 characters'
            })
        } else if (userFirstName.value.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Your first Name should be contains atleast 3 characters'
            })
        } else if (userSignUpConfirmPassword.value !== userSignUpPassword.value) {
            Swal.fire({
                icon: 'error',
                title: 'Your confirm password is not match to your real password'
            })
        } else {
            try {
                const response = await
                    createUserWithEmailAndPassword(auth, userSignUpEmail.value, userSignUpPassword.value)

                // console.log(response, "===>>> Response SignUP Await");

                const user = response.user

                console.log(user, "===>>> Response User Data");

                if (user) {
                    addUserHandler(user.uid)
                }

                let timerInterval
                Swal.fire({
                    title: '<b>Signup Successfully Done</b>',
                    html: 'Please wait <b></b> milliseconds',
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 50)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                })

            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.log(error);
                console.log(errorCode);
                console.log(errorMessage);


                if (errorCode) {
                    if (errorCode == "auth/missing-email") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Shabash Bacha Email to likho'
                        })
                    } else if (errorCode == "auth/missing-password") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Shabash Bacha password to likho'
                        })
                    } else if (errorCode == "auth/weak-password") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Your password should be contains 8 characters'
                        })
                    } else if (errorCode == "auth/email-already-in-use") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Shabash Bacha email dusra likho ye already use hai'
                        })
                    } else {
                        return Swal.fire({
                            icon: 'error',
                            title: 'Shabash Bacha Email or password sahi likho'
                        })
                    }
                }
            }
        }
    }
}


async function addUserHandler(userUid) {
    try {
        const users = await setDoc(doc(db, "users", userUid), {
            userFirstName: userFirstName.value,
            userSurName: userSurName.value,
            userEmail: userSignUpEmail.value,
            userPassword: userSignUpPassword.value,
            userConfirmPassword: userSignUpConfirmPassword.value,
            userID: userUid
        })

        window.location.href = `../signIn/signin.html`

    } catch (error) {
        // console.error("Error adding document: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Shabash Bacha sari feilds fill karo'
        })
    }
}


// ---------Show Password Function----------

function showPassword() {

    if (userSignUpPassword.type === "password") {
        userSignUpPassword.type = "text"
    } else {
        userSignUpPassword.type = "password"
    }

}

function showConfirmPassword() {

    if (userSignUpConfirmPassword.type === "password") {
        userSignUpConfirmPassword.type = "text"
    } else {
        userSignUpConfirmPassword.type = "password"
    }

}


// ---------Signup addEventListener----------

userSignUpBtn.addEventListener('click', signUpHandler);
signupShowPassword.addEventListener('click', showPassword);
signupShowConfirmPassword.addEventListener('click', showConfirmPassword);