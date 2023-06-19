const debug=true; function DEBUG(texte) {console.log(texte)}

function goToQuizz(event) {
    event.preventDefault();
    //console.log("Numero d'Epreuve : ",event.target.name.slice(6,event.target.name.length));
    session.localStorage.setItem("NumeroDEpreuve",event.target.name.slice(6,event.target.name.length));
    const urlEnCours = String(window.location);
    const adresse = urlEnCours.slice(0,urlEnCours.indexOf("exams."))+"quizz.html";
    //console.log(adresse);
    window.location=adresse;
}

DEBUG("start");
const listeDesEpreuves = JSON.parse(session.localStorage.getItem("listeDesEpreuves"));

const tableauDesNomsDesEpreuves = listeDesEpreuves["hydra:member"].map(x=>x.title);

const pointDAccrocheDansLeDOM = document.querySelector("#app");
const formulaire = document.createElement("form");
formulaire.style.display="flex";
formulaire.style.justifyContent="space-around";
formulaire.action="";
formulaire.method="get";
pointDAccrocheDansLeDOM.appendChild(formulaire);
DEBUG("step1");

const lienVersAccueil=document.createElement("a");
lienVersAccueil.href="./index.html";
lienVersAccueil.innerText="Quitter";
lienVersAccueil.style.fontWeight="bold";
lienVersAccueil.style.color="inherit";
formulaire.appendChild(lienVersAccueil);

for(let i=0; i<tableauDesNomsDesEpreuves.length; i++) {DEBUG("step1."+(i+1));
    const itemNomEpreuve = document.createElement("button");
    itemNomEpreuve.name = "button"+(i+1);
    itemNomEpreuve.type = "submit";
    itemNomEpreuve.innerHTML= (i+1)+". "+tableauDesNomsDesEpreuves[i];
    itemNomEpreuve.style.fontSize="20px";
    itemNomEpreuve.style.color="blue";
    formulaire.appendChild(itemNomEpreuve);
    itemNomEpreuve.addEventListener("click",goToQuizz);
};
DEBUG("step2");
console.log(tableauDesNomsDesEpreuves);