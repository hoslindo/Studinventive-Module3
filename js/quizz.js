/* DEBUG */ const debug=true; function DEBUG(texte) {console.log(texte)}

/*-----------------------*/
/* Fonctions de services */
/*-----------------------*/
// 1/ Pour l'affichage de la question et des réponses proposées, des case à cocher, du bouton  
// pour valider ; les arguments sont :
// - la question sous la forme d'une chaîne de caractères
// - les réponses proposées sous la forme d'un tableau de chaînes de caractères
function afficherLeQuizz(laQuestion,lesReponses) {  console.log("laQuestion",laQuestion,"lesReponses",lesReponses)
  // La question est affichée dans la <div> libelleQuestion encapsulée dans un <p>
  libelleQuestion.insertAdjacentHTML("afterbegin","<p>"+laQuestion+"</p>");
  // Constitution du panneau des réponses proposées, sous la forme d'autant de <p> enfant de la
  // <form> qcm
  for (let i=0; i<lesReponses.length; i++) { 
    const libelleOption = document.createElement("p");
    libelleOption.style.fontSize = "18px";
    libelleOption.style.color = "blue";
    libelleOption.innerText="Réponse "+String(i+1)+" : "+lesReponses[i];
    qcm.appendChild(libelleOption);
  }   
  // Constitution du panneau de saisie des réponses sélectionnées sous forme de cases à cocher
  // comme <div> destinée à être enfant de la <form> qcm
  const reponseAuQuizz = document.createElement('div');
  reponseAuQuizz.style.display = "flex";
  reponseAuQuizz.style.color = "red";
  reponseAuQuizz.style.textAlign ="right";
  reponseAuQuizz.style.fontSize = "20px";
  // Constitution de la partie gauche du panneau de saisie qui fait office de guide d'emploi
  const libelleReponse = document.createElement('p');
  libelleReponse.innerHTML = "Votre réponse : "+"<br>"+"<span id='mean'>(cocher les cases)</span>";
  libelleReponse.style.margin = "20px 0px";
  reponseAuQuizz.appendChild(libelleReponse);
  reponseAuQuizz.querySelector("#mean").style.fontSize = "smaller";
  // Constitution de la partie droite du panneau de saisie avec les cases à cocher surmontées d'un label
  for (let i=0; i<lesReponses.length; i++) { 
    // le label surmontant la case à cocher en tant que <div>
    const uneCaseACocher = document.createElement("div");
    uneCaseACocher.innerHTML="<p>Réponse "+String(i+1)+"</p>";
    uneCaseACocher.style.margin="20px 20px";
    uneCaseACocher.style.textAlign = "center";
    // la case à cocher
    const caseACocher = document.createElement("input");
    caseACocher.style.display="block";
    caseACocher.type = "checkbox";
    caseACocher.name = "option"+String(i);    /// <-- c'est par name qu'on peut récupérer l'état de la cas à cocher
    caseACocher.style.fontSize = "10px";
    caseACocher.value = "oui";
    caseACocher.style.margin="auto";    
    uneCaseACocher.insertAdjacentElement("beforeend",caseACocher);
    reponseAuQuizz.insertAdjacentElement("beforeend",uneCaseACocher);
  }
  // Accrochage de la branche du DOM ainsi constitué au DOM existant du document
  qcm.appendChild(reponseAuQuizz);
  // Il faut encore un bouton pour valider
  const boutonDeValidationDuQuizz =  document.createElement('button');
  boutonDeValidationDuQuizz.type="submit";
  boutonDeValidationDuQuizz.innerText = "Cliquer ici pour valider les réponses";
  boutonDeValidationDuQuizz.style.border = "1px red solid";
  qcm.appendChild(boutonDeValidationDuQuizz);
  // Et "écouter" la validation 
  qcm.addEventListener("submit", validationDuQuizz);
}
// 2/ Pour poursuivre lorsque toutes les questions d'un quizz ont été passées
function afficherQuizzTermine() {
  // Indication que le quizz est terminé dans le suivi personalisé stocké dans le localStorage
  // il faut tout d'abord récupérer le prenom du candidat dans le localStorage, car le nom
  // du suivi personalisé est stocké avec sous un nom où le prénom est en suffixe
  const prenom=window.sessionStorage.getItem("identiteDuCandidat");
  const suivi=JSON.parse(window.sessionStorage.getItem("suivi"+prenom));
  suivi[numeroDeQuizz]=true;  // <-- marque le quizz numeroDeQuizz comme terminé
  window.sessionStorage.setItem("suivi"+prenom,JSON.stringify(suivi));
  // Il faut maintenant retourner à exams.html pour (re)faire un autre quizz
  // Le chemin vers exams.html doit aussi fonctionner lorsque le site est sur
  // www.hoslindo.free.fr (il faut donc récupérer le chemin de l'URL)
  const urlEnCours = String(window.location);  // <-- contient le chemin
  const adresse = urlEnCours.slice(0,urlEnCours.indexOf("quizz."))+"exams.html";
  // Activation de la la page web exams.html
  window.location=adresse;
}

function validationDuQuizz (event) { DEBUG("début traitement du clic");
  
  //event.preventDefault();
  
  // Récupération des états des caser à cocher pour leur stockage dans statut
  for (let i=0; i<reponses[numeroDeQuizz][numeroDeLaQuestion].length; i++) { 
    statut[numeroDeQuizz][numeroDeLaQuestion][i].Re=event.target.querySelector("[name=option"+String(i)+"]").checked;
    }
  window.sessionStorage.setItem("statut"+prenom,JSON.stringify(statut));
 
  // Indication "question traitée" dans le suivi pour la question numeroDeLaQuestion puis stockage
  suivi[numeroDeLaQuestion]=true;
  window.sessionStorage.setItem("suiviQuizzNum"+numeroDeQuizz,JSON.stringify(suivi));
 
  // Appel de la même page web
  urlEnCours = String(window.location);
  setTimeout(window.location = urlEnCours,250);

}

/*------------------------*/
/* Début du corps du code */
/*------------------------*/
/* Récupération des données du localStorage */
// Récupération du quizz choisi dans exams.html, soit numeroDeQuizz 
const numeroDeQuizz = JSON.parse(window.sessionStorage.getItem("numeroDeQuizz"));
// Récupération des données associées : quizz, questions, réponses, statut
const quizz = JSON.parse(window.sessionStorage.getItem("quizz"));
const questions = JSON.parse(window.sessionStorage.getItem("questions"));
const reponses = JSON.parse(window.sessionStorage.getItem("reponses"));
const prenom = window.sessionStorage.getItem("identiteDuCandidat");
const statut = JSON.parse(window.sessionStorage.getItem("statut"+prenom));
// Récupération du suivi pour les questions du quizz en cours en cours
const suivi= JSON.parse(window.sessionStorage.getItem("suiviQuizzNum"+String(numeroDeQuizz)));
/*----------------------------------------------------------------------------------------------------------*/
/* Constitution de la branche de DOM pour afficher successivement dans l'ordre des questions :              */
/* - un lien hypertexte pour retourner à la page d'accueil du site (i.e. retourner à index.html)            */
/* - une <div>, themeDesQuestions, pour afficher le thème du quizz (il se trouve dans quizz[numeroDeQuizz]) */
/*   et contenir :                                                                                          */
/*   - une <div>, libelleQuestion, destinée à afficher successivement la question posée, et contenant       */
/*     elle-même :                                                                                          */
/*     - une <form>, qcm, destinée à contenir successivement pour chaque question du quizz sélectionné      */
/*       - les réponses proposées,                                                                          */
/*       - autant de case à cocher,                                                                         */
/*       - un bouton de validation de la sélection de réponses                                              */
/* Le remplissage de libelleQuestion et qcm est fait dans la fonction afficherLeQuizz().                    */
/*----------------------------------------------------------------------------------------------------------*/
// Identification du point d'accroche de la branche de DOM créée
const pointDAccrocheDansLeDOM = document.querySelector("#app");
pointDAccrocheDansLeDOM.style.display="flex";                // pour assurer automatiquement la répartition 
pointDAccrocheDansLeDOM.style.justifyContent="space-around"; // horizontale du lien "Quitter" et de l'encart du quizz
// Création du lien hypertexte pour retourner à la page d'accueil
const lienVersAccueil=document.createElement("a");
lienVersAccueil.href="./index.html";
lienVersAccueil.innerText="Quitter";
lienVersAccueil.style.fontWeight="bold";
lienVersAccueil.style.color="inherit";
lienVersAccueil.style.flexGrow="1";
pointDAccrocheDansLeDOM.appendChild(lienVersAccueil);
// Création de la <div> pour y afficher le thème du quizz
const themeDesQuestions = document.createElement("div");
themeDesQuestions.innerText = quizz[numeroDeQuizz];
themeDesQuestions.style.fontSize = "32px";
themeDesQuestions.style.color = "grey";
themeDesQuestions.style.flexGrow = "2";
pointDAccrocheDansLeDOM.appendChild(themeDesQuestions)
// Création de la <div> pour y afficher le libellé de la question
const libelleQuestion = document.createElement("div");
libelleQuestion.style.fontSize = "24px";
libelleQuestion.style.color = "black";
themeDesQuestions.appendChild(libelleQuestion);
// Création de la <form> pour y afficher réponses proposées, cases à cocher et bouton de validation
const qcm = document.createElement("form");
qcm.action="";                // inutile ici puisqu'on ne recourt pas à un serveur PHP
qcm.method="get";             // inutile ici puisqu'on ne recourt pas à un serveur PHP
qcm.id="reponseAuQuizz";
libelleQuestion.appendChild(qcm);

//console.log("numéro : ",contenuDuQuizz.title);

let nbQuestionsDuQuizz = questions[numeroDeQuizz].length;

// console.log("nb",nbQuestionsDuQuizz);
// console.log("avancement",avancementDuQuizz);

// Recherche de la question à afficher - s'il en reste
let numeroDeLaQuestion=0;
while ((suivi[numeroDeLaQuestion]===true) && (numeroDeLaQuestion<nbQuestionsDuQuizz)) numeroDeLaQuestion++;
// Cas où il en reste :
if (numeroDeLaQuestion<nbQuestionsDuQuizz) { 
  const libelleDeLaQuestion = questions[numeroDeQuizz][numeroDeLaQuestion];
  afficherLeQuizz("Question "+String(numeroDeLaQuestion+1)+"/"+String(nbQuestionsDuQuizz)+" : "+libelleDeLaQuestion,reponses[numeroDeQuizz][numeroDeLaQuestion]);
} 
// Cas où il n'en reste pas :
else afficherQuizzTermine();
/*----------------------*/
/* Fin du corps du code */
/*----------------------*/

