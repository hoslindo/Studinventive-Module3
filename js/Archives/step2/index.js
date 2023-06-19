/* DEBUG */ const debug=true; function DEBUG(texte ) {if (debug) console.log(texte);}

/* Fonctions du pgm */
// Récupération de la liste des épreuves sur le site ad hoc
async function listeEpreuves() {
    const reponse = await fetch('http://qcm.alwayslearn.fr/api/examens');
    const data = await reponse.json();
    return data;
}
// Récupération du contenu d'une épreuve sur le site ad hoc
async function contenuEpreuve(i) {
    const reponse = await fetch('http://qcm.alwayslearn.fr/api/examens/'+i);
    const data = await reponse.json();
    return data;
}

const firstnameHTML = document.getElementById("prenom");


// Traitement du click sur le bouton ENTRER
function traiterClickSurEntrer(event) {
    function caractereOK(c) {
        return ((c>=65) && (c<=90)) || ((c>=97) && (c<=122)) || (c==45);
    }
    DEBUG("ENTRER intercepté");
    event.preventDefault();
    const sourceIdentite = event.currentTarget.querySelector("#prenom");
    const prenom = sourceIdentite.value;
    console.log("prenom entré = ",prenom);
    // boucle de contrôle de légitimité des caractères
    let ok;
    if (prenom.length==1) {
        ok = (caractereOK(prenom.charCodeAt(0))) && (prenom.charCodeAt(0)!=45);
    }
    else {
        ok = (prenom.length>=1); 
        let i = 0; 
        while ((ok) && (i<prenom.length)) {
            ok = caractereOK(prenom.charCodeAt(i));
            i++;
        }
    }
    if (!ok) {
        console.log("mauvaise identité");
        const pereDeLaDivAOcculter=document.querySelector("#portfolio");
        const divAOcculter=document.querySelector("#divAOcculter");
        divAOcculter.remove();
        let sauvegardeDuPereDeLaDivAOcculter = {
            alignement: pereDeLaDivAOcculter.style.textAlign,
            taille:     pereDeLaDivAOcculter.style.fontSize,
            couleur:    pereDeLaDivAOcculter.style.color,
            texte:      pereDeLaDivAOcculter.innerText,
        }
        pereDeLaDivAOcculter.style.textAlign="center";
        pereDeLaDivAOcculter.style.fontSize="24px";
        pereDeLaDivAOcculter.style.color="red";
        pereDeLaDivAOcculter.innerText="Ce prénom n'est pas valide !";
        setTimeout(function() {
            pereDeLaDivAOcculter.style.color="blue";        
            pereDeLaDivAOcculter.innerText="Nouvelle chance...";
            },
            750
        );
        setTimeout(function() {
            pereDeLaDivAOcculter.style.textAlign=sauvegardeDuPereDeLaDivAOcculter.alignement;
            pereDeLaDivAOcculter.style.fontSize=sauvegardeDuPereDeLaDivAOcculter.taille;
            pereDeLaDivAOcculter.style.color=sauvegardeDuPereDeLaDivAOcculter.couleur;
            pereDeLaDivAOcculter.innerText=sauvegardeDuPereDeLaDivAOcculter.texte;
            pereDeLaDivAOcculter.appendChild(divAOcculter);
            },
            1500
        );
        sourceIdentite.value="";
    }
    else {
        session.localStorage.setItem("identiteDuCandidat",prenom);
        miseAJourDeLaPageWeb(prenom);   
    }
}

function miseAJourDeLaPageWeb(id) {
    DEBUG("Ok pour la màj de la page");
    const pereDeLaDivARemplacer=document.querySelector("#portfolio");
    const divARemplacer=document.querySelector("#divAOcculter");
    divARemplacer.remove();
    const divRemplacante=document.createElement("div");
    divRemplacante.innerText="Bienvenu(e) " + id;
    divRemplacante.style.fontSize="24px";
    divRemplacante.style.textAlign="center";
     
    pereDeLaDivARemplacer.appendChild(divRemplacante);
    pereDeLaDivARemplacer.style.height="365px";
    pereDeLaDivARemplacer.style.boxSizing="border-box";
    
    const divEnfant=document.createElement("div");
    divRemplacante.appendChild(divEnfant);
    const lienVersAccueil=document.createElement("a");
    lienVersAccueil.href="./index.html";
    lienVersAccueil.innerText="Quitter";
    lienVersAccueil.style.fontWeight="bold";
    lienVersAccueil.style.color="inherit";

    const lienVersExams=document.createElement("a");
    lienVersExams.href="./exams.html";
    lienVersExams.innerText="Vers la liste des quizz";

    divEnfant.appendChild(lienVersAccueil);
    divEnfant.appendChild(lienVersExams);
    divEnfant.style.width="50%";
    divEnfant.style.fontSize="20px";
    divEnfant.style.paddingTop="20px";
    divEnfant.style.margin=" 0 auto 0 auto";
    divEnfant.style.display="flex";
    divEnfant.style.justifyContent="space-around";



}


DEBUG("start");

/* Instanciation des pointeurs en tant que constantes */
// Acquisition de la liste des épreuves
const listeDesEpreuves = await listeEpreuves(); DEBUG("listeDesEpreuves"); 
// Acquisition des contenus des épreuves sous la forme d'un tableau
const contenuDesEpreuves=[];
for (let i=1; i<=listeDesEpreuves["hydra:totalItems"];i++) { 
    let epreuve = await contenuEpreuve(i);
    contenuDesEpreuves.push(epreuve);
}
contenuDesEpreuves.sort((a,b) => (a.id>b.id));   // instruction inutile puisque, grâce au await, les lectures arrivent dans l'ordre

/* Sauvegarde dans le localstorage */ 
// Sauvegarde de la liste des épreuves --> mot-clé "listeDesEpreuves"
session.localStorage.setItem("listeDesEpreuves",JSON.stringify(listeDesEpreuves));
// Sauvegarde des contenus des épreuves --> mot-clé "contenuDesEpreuves"
session.localStorage.setItem("contenuDesEpreuves",JSON.stringify(contenuDesEpreuves));

console.log("listeDesEpreuves",JSON.parse(session.localStorage.getItem("listeDesEpreuves")));
console.log("contenuDesEpreuves",JSON.parse(session.localStorage.getItem("contenuDesEpreuves")));

const formEntrer = document.getElementById("form");
//const firstnameHTML = document.getElementById("prenom");
formEntrer.addEventListener("submit",traiterClickSurEntrer);
