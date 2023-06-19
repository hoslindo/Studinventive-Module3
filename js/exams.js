/* DEBUG */ const debug=true; function DEBUG(texte) {console.log(texte)}

// Réaction à la sélection d'un thème de quizz
function goToQuizz(event) {
    event.preventDefault();  // <-- à vérifier si c'est utile
    // Récupération du quizz sélectionné par son numéro (auquel il faut retrancher 1 pour servir
    // d'index dans les tableaux questions, reponses, statut)
    const numeroDeQuizz = event.target.name.slice(6,event.target.name.length) - 1;
    // Stockage de cet index du quizz sélectionné dans le localStorage sous le nom --> numeroDeQuizz
    window.sessionStorage.setItem("numeroDeQuizz",numeroDeQuizz);
    // Instanciation d'un suivi du quizz sélectionné sous la forme d'une matrice de booléens initialisés
    // à false de dimension égale au nombre de questions du quizz sélectionné ; ce suivi doit être stocké
    // dans le localStorage sous le nom --> suiviQuizzNum + le numéro du quizz (numeroDeQuizz en ASCII)
    window.sessionStorage.setItem("suiviQuizzNum"+String(numeroDeQuizz),JSON.stringify(Array(questions[numeroDeQuizz].length).fill(false)));
    // Détermination de l'URL de quizz.html (hypothèse : quizz.html et exams.html sont dans le même
    // sur le serveur répertoire) qui est l'url de exams.html en remplaçant exams.html par quizz.html
    // NB C'est nécessaire pour que le site fonctionne également lorsqu'il sera transféré
    //    sur http://hoslindo.free.fr
    const urlEnCours = String(window.location);  // <-- contient le chemin
    const adresse = urlEnCours.slice(0,urlEnCours.indexOf("exams."))+"quizz.html";
    // Activation de la la page web quizz.html
    window.location=adresse;
}

/*------------------------*/
/* Début du corps du code */
/*------------------------*/
// Récupération des données nécessaires depuis le localStorage, en l'occurrence
// 1/ quizz
const quizz = JSON.parse(window.sessionStorage.getItem("quizz"));
// 2/ questions
const questions = JSON.parse(window.sessionStorage.getItem("questions"));
// 3/ l'identité du candidat
const prenom = window.sessionStorage.getItem("identiteDuCandidat");
// 4/ son suivi personalisé
const suivi = JSON.parse(window.sessionStorage.getItem("suivi"+prenom));
/*---------------------------------------------------------------------------------------*/
/* Création de la branche de DOM de la page web, en l'occurrence une <form> contenant    */
/*  - un lien hypertexte pour "sortir" et retourner à l'accueil (une <a> libellée        */
/*    "Quitter")                                                                         */
/*  - autant de boutons pour lancer un quizz qu'il y a de thèmes de quizz (quizz.length) */
/*---------------------------------------------------------------------------------------*/
// Step 0 : identifier le point d'accroche au DOM existant (i.e. le conteneur où id="app") alias
// le conteneur aïeul
const pointDAccrocheDansLeDOM = document.querySelector("#app");
// Step 1 : créer une <div> pour y inscrire la légende comme premier descendant du conteneur aïeul
const premierDescendant = document.createElement("div");
premierDescendant.style.textAlign="center";
premierDescendant.style.color="black";
premierDescendant.style.fontSize="18px";
premierDescendant.style.paddingBottom="48px";  // le padding-top de la <div> englobante est de 96px
premierDescendant.innerText=prenom+", les quizz déjà réalisés sont estompés, mais peuvent être resélectionnés."
pointDAccrocheDansLeDOM.appendChild(premierDescendant);
// Step 2 : créer la <form> et l'accrocher au DOM existant au niveau du conteneur id="app"
const formulaire = document.createElement("form");
formulaire.style.display="flex";                   // pour assurer automatiquement une équi-répartition
formulaire.style.justifyContent="space-around";    // des boutons de sélection des thèmes du quizz
formulaire.action="";                              // inutile ici puisqu'on ne recourt pas à un serveur PHP
formulaire.method="get";                           // inutile ici puisqu'on ne recourt pas à un serveur PHP
pointDAccrocheDansLeDOM.appendChild(formulaire);
// Step 3 : créer le lien hypertexte pour revenir à index.html (hypothèse: exams.html
// et index.html sont dans un même répertoire) et l'accrocher à la <form>
const lienVersAccueil=document.createElement("a");
lienVersAccueil.href="./index.html";
lienVersAccueil.innerText="Quitter";
lienVersAccueil.style.fontWeight="bold";
lienVersAccueil.style.color="inherit";
formulaire.appendChild(lienVersAccueil);
// Step 4 : créer les boutons pour sélectionner le thème du quizz à lancer avec des
// libellés des boutons correspondant aux libellés des thèmes et l'accrocher à la <form>
for(let i=0; i<quizz.length; i++) {DEBUG("step1."+(i+1));
    const itemNomEpreuve = document.createElement("button");
    itemNomEpreuve.name = "button"+(i+1);
    itemNomEpreuve.type = "submit";                // <-- définit ce <button> comme validant <form>
    itemNomEpreuve.innerHTML= (i+1)+". "+quizz[i];
    itemNomEpreuve.style.fontSize="20px";
    if (!suivi[i]) itemNomEpreuve.style.color="blue"
    else  itemNomEpreuve.style.color="lightblue";
    formulaire.appendChild(itemNomEpreuve);
    itemNomEpreuve.addEventListener("click",goToQuizz);
}
// Step 5 : si et seulement si tous les quizz ont été réalisés
// créer le lien hypertexte pour aller à result.html (hypothèse: exams.html
// et result.html sont dans un même répertoire) et l'accrocher à la <form>
let fini=true;
for (let i=0; i<suivi.length; i++) {fini=(fini && suivi[i])}
if (fini) {
    const lienVersResultat=document.createElement("a");
    lienVersResultat.href="./result.html";
    lienVersResultat.innerText="Vers vos résultats";
    lienVersResultat.style.fontWeight="bold";
    lienVersResultat.style.color="red";
    formulaire.appendChild(lienVersResultat);
}
/*----------------------*/
/* Fin du corps du code */
/*----------------------*/
