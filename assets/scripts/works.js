let works = window.localStorage.getItem('works');

if(works === null) {
    const response = await fetch('http://localhost:5678/api/works');
    works = await response.json();

    const valeurWorks = JSON.stringify(works);
    window.localStorage.setItem('works', valeurWorks);
}else{
    works = JSON.parse(works);
}

const worksUpdate = document.querySelector(".works-update")

worksUpdate.addEventListener("click", () => {
    window.localStorage.removeItem('works');
})

function generateWorks(works){

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for(let i = 0; i < works.length; i++) {

        const work = works[i];

        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figureCaption = document.createElement("figcaption");

        image.src = work.imageUrl;
        figureCaption.innerText = work.title;

        figure.appendChild(image);
        figure.appendChild(figureCaption);
        gallery.appendChild(figure);
    }
}

generateWorks(works);

const tousFilter = document.querySelector(".tous");
const objetsFilter = document.querySelector(".objets");
const appartementsFilter = document.querySelector(".appartements");
const hotelsRestauFilter = document.querySelector(".hotelsRestaurents");

function clearFilters() {
    tousFilter.classList.remove("activ");
    objetsFilter.classList.remove("activ");
    appartementsFilter.classList.remove("activ");
    hotelsRestauFilter.classList.remove("activ");
};


tousFilter.addEventListener("click", () => { 
    clearFilters();
    tousFilter.classList.add("activ");
    generateWorks(works) 
})

objetsFilter.addEventListener("click", () => {
    clearFilters();
    objetsFilter.classList.add("activ");
    const objetsArray = works.filter((work) => {
        return work.categoryId == 1;
    });
    generateWorks(objetsArray);
})

appartementsFilter.addEventListener("click", () => {
    clearFilters();
    appartementsFilter.classList.add("activ");
    const appartementsArray = works.filter((work) => {
        return work.categoryId == 2;
    })
    generateWorks(appartementsArray)
})

hotelsRestauFilter.addEventListener("click", () => {
    clearFilters();
    hotelsRestauFilter.classList.add("activ");
    const hotelsRestauArray = works.filter((work) => {
        return work.categoryId == 3;
    })
    generateWorks(hotelsRestauArray)
})