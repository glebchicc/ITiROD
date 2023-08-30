const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDcUShIUd2MQjCxmR65hbAITAtZ0g6tJLQ",
    authDomain: "savepassword-5a03a.firebaseapp.com",
    projectId: "savepassword-5a03a",
    storageBucket: "savepassword-5a03a.appspot.com",
    messagingSenderId: "1010936426983",
    databaseURL: "https://savepassword-5a03a-default-rtdb.europe-west1.firebasedatabase.app",
    appId: "1:1010936426983:web:348c3536401d2759e2cd42"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.location.href = '/pages/passwordList.html';
  }
});

if (registerForm != null) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = registerForm.elements.email.value;
        const password = registerForm.elements.password.value;
        const repeatPassword = registerForm.elements.repeatPassword.value;
        let alertText = document.getElementById('alert');
    
        if (password === repeatPassword) {
            const user = new User(email, password);
            createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
              const user_ = userCredential.user;
              alertText.innerHTML = "Аккаунт создан!";
            })
            .catch((error) => {
              if (error.code == "auth/email-already-in-use") {
                alertText.innerHTML = "Данный адрес электронной почты уже используется.";
              }
              if (error.code == "auth/weak-password") {
                alertText.innerHTML = "Пароль должен содержать как минимум 6 символов.";
              }
              else {
                alertText.innerHTML = error.message;
              }
            });
        } else {
            alertText.innerHTML = "Пароли не совпадают.";
        }
      });
}

if (loginForm != null) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = loginForm.elements.email.value;
        const password = loginForm.elements.password.value;
        let alertText = document.getElementById('alert');

        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
          const user = userCredential.user;
          document.location.href = '/pages/passwordList.html';
          alertText.innerHTML = "Вход успешен!";
        })
        .catch((error) => {
          if (error.code == "auth/wrong-password" || error.code == "auth/user-not-found") {
            alertText.innerHTML = "Неверный логин или пароль.";
          }
          else {
            alertText.innerHTML = error.code;
          }
        });
    });
}
