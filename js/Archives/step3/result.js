/* DEBUG */  const debug=true; function DEBUG(texte) { if (debug) console.log(texte)};


/*-----------------------*/
/* Fonctions de services */
/*-----------------------*/
function calculDesNotes(statut) {
    resultats=new Array(statut.length).fill(0); // le tableau (1 ligne/quizz) des résultats est rempli de 0
    for (let i=0;i<statut.length;i++){                  // boucle sur les quizz
        for (let j=0;j<statut[i].length;j++) {          // boucle sur les questions d'un quizz
            let ok=true;                                // a priori le qcm/question est supposé ok
            for (let k=0;k<statut[i][j].length;k++) {   // boucle sur les réponses proposées à une question
                ok=ok && (statut[i][j][k].OK===statut[i][j][k].Re); // pour que le qcm reste bon il faut que les
            }                                                       // bonnes réponses aient été cochées, et que
        if (ok) resultats[i]++;                                     // les mauvaises réponses ne l'aient pas été
        }
    }
    return resultats;
}
/*------------------------*/
/* Début du corps du code */
/*------------------------*/

// Récupération des données nécessaires depuis le localStorage, en l'occurrence
// 1/ quizz
const quizz = JSON.parse(session.localStorage.getItem("quizz"));
// 2/ questions
const questions = JSON.parse(session.localStorage.getItem("questions"));
// 3/ l'identité du candidat
const prenom = session.localStorage.getItem("identiteDuCandidat");
// 4/ son suivi personalisé
const statut = JSON.parse(session.localStorage.getItem("statut"+prenom));
notesQuizz=calculDesNotes(statut);


// Identification du point d'accroche au DOM existant (i.e. le conteneur où id="app")
const pointDAccrocheDansLeDOM = document.querySelector("#app");

pointDAccrocheDansLeDOM.innerText="Résultats de "+prenom+" :";
pointDAccrocheDansLeDOM.style.display="flex";
pointDAccrocheDansLeDOM.style.justifyContent="space-around";


const panneauResultat=document.createElement('div');
panneauResultat.style.width='50%';
pointDAccrocheDansLeDOM.appendChild( panneauResultat);

/*-----
/* Création de la branche du DOM à rajouter au niveau du point d'accroche */
/* Cette nouvelle branche comporte autant de <div> que de quizz, pour y afficher le nom du quizz
/* et la note obtenue sur ce quizz (la note <=> nb de questions répondues justes)
/*---*/ 



for (let i=0; i<quizz.length;i++) {
    const divResultatEnglobante=document.createElement('div');
    divResultatEnglobante.style.display='flex';
    divResultatEnglobante.style.justifyContent='space-between';
    panneauResultat.appendChild(divResultatEnglobante);
    const divTitreDuResultat=document.createElement('div');
    divTitreDuResultat.style.width="50%";
    divTitreDuResultat.innerText="Quizz n°"+String(i+1)+" : "+quizz[i];
    divResultatEnglobante.appendChild(divTitreDuResultat);
    const divFleche=document.createElement('div');
    divFleche.style.width="10%";
    divFleche.innerText="-->";
    divResultatEnglobante.appendChild(divFleche);
    const divDuResultat=document.createElement('div');
    divDuResultat.style.width="10%"
    divDuResultat.innerText=String(notesQuizz[i])+"/"+questions[i].length;
    divResultatEnglobante.appendChild(divDuResultat);
}

// Création de la <form> pour y afficher le bouton "RETOUR"
const formBoutonRetour = document.createElement("form");
formBoutonRetour.action="";         // inutile ici puisqu'on ne recourt pas à un serveur PHP
formBoutonRetour.method="get";      // inutile ici puisqu'on ne recourt pas à un serveur PHP
formBoutonRetour.style.textAlign="center";
formBoutonRetour.style.paddingTop="40px";
formBoutonRetour.id="boutonRetour";
panneauResultat.appendChild(formBoutonRetour);
// Création du bouton "RETOUR"
const boutonRetour =  document.createElement('input');
boutonRetour.type="submit";
boutonRetour.value = "RETOUR";
boutonRetour.style.border = "1px red solid";
formBoutonRetour.appendChild(boutonRetour);

// Et "écouter" l'activation de ce bouton RETOUR 
boutonRetour.addEventListener("click",function(event) {
                                // cette instruction est indispensable ici, car sinon
    event.preventDefault();     // la page est réinitialisée, et du coup l'event est
                                // perdu et la fonction sur l'event ne s'accomplit pas
    // Il faut retourner à exams.html pour refaire un quizz ou pour quitter le site
    // Le chemin vers exams.html doit aussi fonctionner lorsque le site est sur
    // www.hoslindo.free.fr (il faut donc récupérer le chemin de l'URL)
    const urlEnCours = String(window.location);  // <-- contient le chemin
    DEBUG("ici");
    const adresse = urlEnCours.slice(0,urlEnCours.indexOf("result."))+"exams.html";  console.log("adresse : ",adresse);
    // Activation de la la page web exams.html
    window.location=adresse;
    
});


/*----------------------*/
/* Fin du corps du code */
/*----------------------*/