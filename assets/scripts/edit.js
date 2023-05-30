import { generateWorks, updateWorks, updateCategories } from "./works.js";

//récuperation des projets et categories, récuperation et vérification du token dans le localStorage//

let token;

let works = window.localStorage.getItem('works');

if(works === null){

    works = await updateWorks();

}else{
    works = JSON.parse(works);
}

let categories = window.localStorage.getItem('categories');

if(categories === null) {
    
    categories = await updateCategories();

}else{
    categories = JSON.parse(categories);
}

verifyLogin();

//MODALES//

const modal = document.getElementById("modal");
const galleryModal = document.getElementById("gallery-modal");
const addModal = document.getElementById("add-modal");

modal.addEventListener("click", (event) => {
    if(!galleryModal.contains(event.target) && !addModal.contains(event.target)) {
        galleryModal.style.display = "block";
        addModal.style.display = "none";
        modal.close();
    }
})
//modale de supression//

const editBtn = document.getElementById("edit-btn");
editBtn.addEventListener("click", () => {
    modal.showModal();

    const closeBtn = document.querySelectorAll(".close");
    for(let i = 0; i < closeBtn.length; i++) {
        closeBtn[i].addEventListener("click", (event) => {
            event.preventDefault();
            modal.close();
            galleryModal.style.display = "block";
            addModal.style.display = "none";
        })
    }
    generateModalWorks(works);

    addDeleteEventListeners(works);
})

const addWorkBtn = document.getElementById("add-work-btn");
addWorkBtn.addEventListener("click", (event) => {
    event.preventDefault();

    galleryModal.style.display = "none";
    addModal.style.display = "block";
});

const returnBtn = document.getElementById("return");
returnBtn.addEventListener("click", (event) => {
    event.preventDefault();

    galleryModal.style.display = "block";
    addModal.style.display = "none";
});

//modale d'ajout//

const addImgBtn = document.getElementById("add-img-btn");
const uploadInput = document.getElementById("upload-input");
const uploadContainer = document.querySelector(".upload-container");
const imgPreviewContainer = document.getElementById("upload-img-container");
const title = document.getElementById("title-add");
const category = document.getElementById("category-add");
const sendWorkBtn = document.getElementById("send-work-btn");

genererCategories(categories);

addImgBtn.addEventListener("click", (event) => {
    event.preventDefault();
    uploadInput.click();
})

uploadInput.addEventListener("change", () => {

    const lastImage = document.querySelector(".image-add"); 
    if(lastImage) {
        lastImage.remove();
    }

    const uploadedImg = uploadInput.files[0];

    if(uploadedImg.size < 4000000 && validateType(uploadedImg) ) {

        uploadContainer.style.display = "none";

        const img = document.createElement("img");
        img.classList.add("image-add");
        img.src = URL.createObjectURL(uploadedImg);
        imgPreviewContainer.appendChild(img);

    }else if(uploadedImg.size > 4000000) {
        alert("la taille de l'image est supperieure à 4Mo");
    }else if(!validateType(uploadedImg)) {
        alert("le type de fichier n'est pas bon");
    }

    const imgPreview = document.querySelector(".image-add");
    imgPreview.addEventListener("click", () => {
        uploadInput.click();
    })
})

addModal.addEventListener("change", () => {
    if(title.value != "" && category.value != "" && uploadInput.files[0] != undefined) {
        sendWorkBtn.classList.add("valid-content");
        sendWorkBtn.classList.remove("unvalid-content")
    }else{
        sendWorkBtn.classList.remove("valid-content");
        sendWorkBtn.classList.add("unvalid-content");
    }
})

sendWorkBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    if(sendWorkBtn.classList.value == "valid-content") {
        const titleAdd = title.value;
        const categoryAdd = category.value;
        const image = uploadInput.files[0];
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", titleAdd);
        formData.append("category", categoryAdd);

        const postResponse = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}`},
            body: formData
        });
        if(postResponse.status == 201) {
            const newWorks = await updateWorks();
            works = await newWorks;
            generateWorks(await newWorks);
            const lastImage = document.querySelector(".image-add");
            lastImage.remove();
            uploadContainer.style.display = "flex";
            title.value = "";
            category.value = "";
            galleryModal.style.display = "block";
            addModal.style.display = "none";
            modal.close();
        }
    }else{
        alert("veuillez remplir tous les champs de saisis pour pouvoir soumetre votre requette!")
    }
})

//functions//

function verifyLogin() {

    const userToken = window.localStorage.getItem('userToken');

    const logOutBtn = document.querySelector(".logout-btn");
    const body = document.querySelector(".body");

    if(userToken != null) {

    const userTokenJson = JSON.parse(userToken);
    token = userTokenJson.token;
    
    body.classList.add("edit");

    logOutBtn.addEventListener("click", () => {
        window.localStorage.removeItem('userToken');
        verifyLogin();
    })
    }else{
        body.classList.remove("edit");
    }
}

function generateModalWorks(works){

    const gallery = document.getElementById("modal-gallery");
    gallery.innerHTML = "";

    for(let i = 0; i < works.length; i++) {

        const work = works[i];

        const figure = document.createElement("figure");
        const btnContainer = document.createElement("div");
        const deleteBtn = document.createElement("img");
        const dragBtn = document.createElement("img");
        const image = document.createElement("img");
        const figureCaption = document.createElement("figcaption");

        btnContainer.classList.add("btn-container");
        dragBtn.src = "./assets/icons/arrow-TRBL.svg";
        dragBtn.classList.add("drag-btn");
        deleteBtn.src = "./assets/icons/trash.svg";
        deleteBtn.classList.add("delete-btn");
        image.classList.add("modal-work-image");
        image.src = work.imageUrl;
        figureCaption.innerText = "éditer";
        deleteBtn.dataset.id = i;

        btnContainer.appendChild(dragBtn);
        btnContainer.appendChild(deleteBtn);
        figure.appendChild(btnContainer);
        figure.appendChild(image);
        figure.appendChild(figureCaption);
        gallery.appendChild(figure);
    }
}

function addDeleteEventListeners(worksArray) {

    const delWorkBtn = document.querySelectorAll(".delete-btn");

    for(let i = 0; i < worksArray.length; i++) {
        delWorkBtn[i].addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            const delId = worksArray[id].id;
            const response = await fetch(`http://localhost:5678/api/works/${delId}`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${token}`},
            })
            const newWorks = await updateWorks();
            works = await newWorks;
            generateModalWorks(await newWorks);
            generateWorks(await newWorks);
            addDeleteEventListeners(await newWorks);
        })
    }
}

async function genererCategories(categories) {

    category.innerHTML = "";

    const emptyOption = document.createElement("option");
    category.appendChild(emptyOption);
    
    for(let i in await categories) {
        const categoryEl = document.createElement("option");
        categoryEl.value = categories[i].id;
        categoryEl.innerText = categories[i].name;
        category.appendChild(categoryEl);
    }
}

function validateType(file) {

    if(file.type === "image/jpeg" || file.type === "image/png") {
        return true;
    }else{
        return false;
    }
}
