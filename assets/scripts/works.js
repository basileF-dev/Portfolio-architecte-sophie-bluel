//Récuperation des projets et categories//

let works = window.localStorage.getItem('works');

if(works === null) {

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

//generation des projets et des filtres //

generateWorks(works);

generateFiltersAndEventListeners(categories);

//functions//

export function generateWorks(works){

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

function clearFilters() {

    const filters = document.querySelector(".filters");
    const children = filters.children;
    for(let i = 0; i < children.length; i++) {
        const child = children[i];
        child.classList.remove("activ");
    }
};

function generateFiltersAndEventListeners(categories) {
    const filters = document.querySelector(".filters");
    filters.innerHTML = "";
    const filterTous = document.createElement("div");
    filterTous.className = "filter tous";
    filterTous.innerText = "Tous";
    filters.appendChild(filterTous);

    for(let i = 0; i < categories.length; i++) {
        const categoryName = categories[i].name;
        const filter = document.createElement("div");
        filter.className = `filter ${(categories[i].name).toLowerCase()}`;
        filter.innerText = categoryName;
        filters.appendChild(filter);
    }

    const tousFilter = document.querySelector(".tous");
    const objetsFilter = document.querySelector(".objets");
    const appartementsFilter = document.querySelector(".appartements");
    const hotelsRestauFilter = document.querySelector(".restaurants");

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
}

export async function updateWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const newWorks = await response.json();
    window.localStorage.removeItem('works');
    const valueWorks = JSON.stringify(newWorks);
    window.localStorage.setItem('works', valueWorks);
    return await newWorks;
}

export async function updateCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    const newCategories = await response.json();
    window.localStorage.removeItem('categories');
    const valeurCategories = JSON.stringify(newCategories);
    window.localStorage.setItem('categories', valeurCategories);
    return await newCategories
}

//mise a jour des données//

const worksUpdate = document.querySelector(".works-update")

worksUpdate.addEventListener("click", async () => {
    const newWorks = await updateWorks()
    works = await newWorks;
    generateWorks(await newWorks);
    const newCategories = await updateCategories();
    categories = await newCategories;
    generateFiltersAndEventListeners(await newCategories);
    clearFilters();
})