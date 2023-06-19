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
// contenuDesEpreuves.map((a,b) => (a.id>b.id));   // instruction inutile puisque, grâce au await, les lectures arrivent dans l'ordre

/* Sauvegarde dans le localstorage */ 
// Sauvegarde de la liste des épreuves --> mot-clé "listeDesEpreuves"
session.localStorage.setItem("listeDesEpreuves",JSON.stringify(listeDesEpreuves));
// Sauvegarde des contenus des épreuves --> mot-clé "contenuDesEpreuves"
session.localStorage.setItem("contenuDesEpreuves",JSON.stringify(contenuDesEpreuves));

console.log("listeDesEpreuves",JSON.parse(session.localStorage.getItem("listeDesEpreuves")));
console.log("contenuDesEpreuves",JSON.parse(session.localStorage.getItem("contenuDesEpreuves")));

