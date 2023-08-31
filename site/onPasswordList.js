const emailText = document.getElementById('email');
const signOutButton = document.getElementById('logout');
const registerForm = document.getElementById('crudForm');
const downloadButton = document.getElementById('downloadButton');
const createPasswordRecord = document.getElementById('createPasswordRecord');
const generatePasswordButton = document.getElementById('generatePassword');
const searchField = document.getElementById('search');
const checkPassword = document.getElementById('checkPassword');
const alertText = document.getElementById('alert');

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getDatabase, ref, push, get, child, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
const auth = getAuth();

let rows = [];
let websites = [];

onAuthStateChanged(auth, (user) => {
    if (user) {
        emailText.innerHTML = user.email;
        if (document.getElementById('passwordTable') != null) {
            loadPasswordRecords();
        }
    }
    else {
        document.location.href = '/pages/login.html';
    }
});

if (checkPassword != null) {
    checkPassword.addEventListener('click', (event) => {
        event.preventDefault();
        checkPasswordStrength(document.getElementById("password").value);
    });
}

if (searchField != null) {
    searchField.addEventListener('input', (event) => {
        const inputValue = event.target.value;
        for (let i = 0; i < rows.length; i++) {
            if (websites[i].includes(inputValue)) {
                rows[i].style = "";
            }
            else {
                rows[i].style = "display: none;";
            }
        }
    });
}

signOutButton.addEventListener('click', function(event) {
    signOut(auth).then(() => {})
    .catch((error) => {
        console.log(error.message);
    });
    document.location.href = '/pages/login.html';
});

if (createPasswordRecord != null) {
    createPasswordRecord.addEventListener('click', function(event) {
        event.preventDefault();

        const website = registerForm.elements.website.value;
        const login = registerForm.elements.login.value;
        const password = registerForm.elements.password.value;

        writeUserData(website, login, password);
    });
}

if (generatePasswordButton != null) {
    generatePasswordButton.addEventListener('click', function(event) {
       event.preventDefault();
       generatePassword();
    });
}
 
if (downloadButton != null) {
    downloadButton.addEventListener('click', function(event) {
        event.preventDefault();
        downloadAllPasswords();
    })
}

function writeUserData(website, login, password) {
    const db = getDatabase();
    const dbRef = ref(db, 'users/' + auth.currentUser.uid);
    const newPasswordRecord = { website: website, login: login, password : password};
    push(dbRef, newPasswordRecord).then(() => {
        document.location.href = '/pages/passwordList.html';
    })
    .catch(error => {
        console.error('Error pushing data:', error);
    })
}

function checkPasswordStrength(password) {
    const hashedPassword = sha1(password).toUpperCase();
    const prefix = hashedPassword.substring(0, 5);
    const apiURL = `https://api.pwnedpasswords.com/range/${prefix}`;

    fetch(apiURL)
        .then(response => response.text())
        .then(data => {
        // Обработка ответа от API
        const lines = data.split('\n');
        const matchingHashes = lines.filter(line => line.startsWith(hashedPassword.substring(5).toUpperCase()));
    
        if (matchingHashes.length > 0) {
            alertText.innerHTML = "Пароль найден в базе утечек. Смените пароль.";
        } else {
            alertText.innerHTML = "Пароль безопасен.";
        }
  })
  .catch(error => console.error(error));
}

function generatePassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";

    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
    }

    document.getElementById("password").type = "text";
    document.getElementById("password").value = password;
}

function downloadAllPasswords() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'users/' + auth.currentUser.uid)).then((snapshot) => {
        var json = JSON.stringify(snapshot, null, "\t");
        var blob = new Blob([json], {type: "application/json"});
        var url = URL.createObjectURL(blob); 

        var a = document.createElement("a");
        a.href = url;
        a.download = "data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }).catch((error) => {
        console.error(error);
    });
}

function loadPasswordRecords() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'users/' + auth.currentUser.uid)).then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var newRow = document.createElement('tr');
            newRow.classList.add('tableElement');

            var website = document.createElement('td');
            var login = document.createElement('td');
            var password = document.createElement('td');
            var deleteData = document.createElement('td');
            var deleteButton = document.createElement('input');

            website.classList.add('firstTableElement');
            website.classList.add('table-row');
            website.textContent = childData.website;
            login.classList.add('table-row');
            login.textContent = childData.login;
            password.classList.add('table-row');
            password.textContent = childData.password;
            
            deleteButton.type = "button";
            deleteButton.value = "Удалить данные для входа";
            deleteButton.style = "margin: 1%;";
            deleteButton.addEventListener('click', function(event) {
                event.preventDefault();

                const dbRef = ref(getDatabase());
                const allRef = child(dbRef, 'users/' + auth.currentUser.uid);
                const elementRef = child(allRef, childSnapshot.key);
                remove(elementRef).then(() => {
                    document.location.href = '/pages/passwordList.html';
                })
                .catch(error => {
                    console.error(error);
                });
            });

            deleteData.append(deleteButton);
            newRow.appendChild(website);
            newRow.appendChild(login);
            newRow.appendChild(password);
            newRow.appendChild(deleteData);
            
            document.getElementById('passwordTable').getElementsByTagName('tbody')[0].appendChild(newRow);
            rows.push(newRow);
            websites.push(childData.website);

            console.log(childData);
        });
    }).catch((error) => {
        console.error(error);
    });
}