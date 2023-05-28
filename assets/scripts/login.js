const formulaireSeConnecter = document.getElementById("formulaire-login");
let userId;
let token;

formulaireSeConnecter.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = event.target.querySelector("[name=login-email]").value;
    const password = event.target.querySelector("[name=password]").value;

    const loginMessage = document.getElementById("login-message");

    if(email != "" && password != "") {

        const chargeUtile = JSON.stringify({
            "email": `${email}`,
            "password": `${password}`
        });

        const responseLogin = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        });

        if(responseLogin.status == 404) {
            loginMessage.innerText = "Aucun utilisateur trouvé";
        }else if(responseLogin.status == 401) {
            loginMessage.innerText = "mot de passe erroné";
        }else if(responseLogin.status == 200) {
            const responseLoginJson = await responseLogin.json();

            userId = responseLoginJson.userId;
            token = responseLoginJson.token;
            const userToken = {
                user: userId,
                token: token
            };
            const ValeurUserToken = JSON.stringify(userToken);

            window.localStorage.setItem('userToken', ValeurUserToken);

            window.location.href = "./index.html";

        }
    }else if(email == "" || password == "") {
        loginMessage.innerText = "Veuillez remplir les champs de saisis";
    };
});
