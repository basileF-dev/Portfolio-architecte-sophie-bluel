let userId;
let token;

function verifyLogin() {

    const userToken = window.localStorage.getItem('userToken');

    const logOutBtn = document.querySelector(".logout-btn");
    const body = document.querySelector(".body");

    if(userToken != null) {
        const userTokenJson = JSON.parse(userToken);
        userId = userTokenJson.user;
        token = userTokenJson.token;
    
        console.log(userId, token);
    
        body.classList.add("edit");
    
        logOutBtn.addEventListener("click", () => {
            window.localStorage.removeItem('userToken');
            verifyLogin();
        })
    }else{
        body.classList.remove("edit");
    }
}

verifyLogin();