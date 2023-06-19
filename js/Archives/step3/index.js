/* DEBUG */ const debug=true; function DEBUG(texte ) {if (debug) console.log(texte);}

/*----------------------------------------------------------------------------------------------------------*/
/* Instanciation des variables (car elles sont nécessaires dans tout le code) :                             */
/* - quizz <=> listeDesEpreuves nettoyé des infos inutiles, donc un tableau avec les noms des quizz         */
/* - questions <=> contenuDesEpreuves nettoyé des infos inutiles, sous la forme d'un tableau de dimension   */
/*                 le nombre de quizz de tableaux avec les libellés des questions                           */
/* - reponses <=> contenuDesEpreuves nettoyé des infos inutiles, sous la forme d'un tableau de dimension    */
/*                le nombre de quizz de tableaux de dimension le nombre de questions pour le quizz[i] de    */
/*                tableaux avec les réponses proposées pour la question[j] du quizz[i]                      */
/* - statut --> pour le suivi (quizz faits, questions répondues, réponses), mis en forme ainsi :            */
/*         statut[i]       <-- parcourt les quizz                                                           */
/*         statut[i][j]    <-- parcourt les questions composants un quizz                                   */
/*         statut[i][j][k] <-- parcourt les états OK/NOk des réponses possibles en un agrégat               */
/*         avec la "bonne" réponse ("OK") qui est indiquée dans contenuDesEpreuves, et la réponse donnée    */ 
/*         par le candidat ("Re"), initialisée à null (à faire remplir dans la page quizz.html)             */
/*----------------------------------------------------------------------------------------------------------*/
let quizz=[];
let questions=[];
let reponses=[];
let statut=[];

let suivi=[];

/*------------------*/
/* Fonctions du pgm */
/*------------------*/
// Traitement du click sur le bouton ENTRER
function traiterClickSurEntrer(event) {
    // Fonction de filtre sur un caractère : admis sont uniquement les lettres et le '-'
    function caractereOK(c,premier) {
        if (premier) return ((c>=65) && (c<=90)) || ((c>=97) && (c<=122));
        else         return ((c>=65) && (c<=90)) || ((c>=97) && (c<=122)) || (c==45);
    }   
    // Précaution d' "usage" (peut-être inutile ici --> à tester)
    event.preventDefault();
    // Récupération du prénom entré par l'opérateur qui s'est fait dans <form id="prenom">
    const sourceIdentite = event.currentTarget.querySelector("#prenom");
    const prenom = sourceIdentite.value;
    // Contrôle de validité du prénom
    let ok = (prenom.length>=1);                        // il doit avoir au moins un caractère
    if (ok) {                                           // et si tel est le cas, il faut tester la
        let i = 0;                                      // validité des caractères un par un (i) jusqu'à
        while ((ok) && (i<prenom.length)) {             // rencontrer
        ok = caractereOK(prenom.charCodeAt(i),(i===0)); // une invalidité (i.e. caractereOK() retourne false)
        i++;
        }
    }
    // Cas où le nom entré est invalide : le panneau de saisie disparaît de l'affichage un panneau avec 
    // message d'erreur de prénom invalide apparaît pendant 0,75s puis pendant 0,75s plus un panneau porteur 
    // du message "nouvelle chance", avant que la page web soit reinitialisée
    if (!ok) {
        
        // Sélection du conteneur parent du conteneur à faire disparaître pour pouvoir
        // par la suite y accrocher les panneaux de messages successifs en cas de prénom invalide
        const pereDeLaDivAOcculter=document.querySelector("#portfolio"); // conteneur à l'id="portfolio"
        // Sauvegarde des caractéristiques de ce conteneur (pour pouvoir les changer puis les restituer)       
        const sauvegardeDuPereDeLaDivAOcculter = {
            alignement: pereDeLaDivAOcculter.style.textAlign,
            taille:     pereDeLaDivAOcculter.style.fontSize,
            couleur:    pereDeLaDivAOcculter.style.color,
        }

        console.log("textesauvegardé",sauvegardeDuPereDeLaDivAOcculter.texte);
        const divAOcculter=document.querySelector("#divAOcculter");  
        divAOcculter.remove();
        // Mise en place des caractéristiques de ce conteneur pour l'affichage du panneau de "prénom invalide"
        pereDeLaDivAOcculter.style.textAlign="center";
        pereDeLaDivAOcculter.style.fontSize="24px";
        pereDeLaDivAOcculter.style.color="red";                   // en rouge
        pereDeLaDivAOcculter.innerText="Ce prénom n'est pas valide !";
        // Affichage du panneau "nouvelle chance" après un délai de 750ms
        setTimeout(function() {
            pereDeLaDivAOcculter.style.color="blue";              // non plus en rouge mais en bleu 
            pereDeLaDivAOcculter.innerText="Nouvelle chance...";
            },
            750
        );
        // Retour à l'affichage initial au bout de 1500s après l'affichage du panneau de "prénom invalde"
        // soit 1500*750=750ms après l'affichage du panneau "nouvelle chance"
        setTimeout(function() {
            // Restitution des caractèristiques initiales du conteneur (grâce à la sauvegarde effectuées);
            pereDeLaDivAOcculter.style.textAlign=sauvegardeDuPereDeLaDivAOcculter.alignement;
            pereDeLaDivAOcculter.style.fontSize=sauvegardeDuPereDeLaDivAOcculter.taille;
            pereDeLaDivAOcculter.style.color=sauvegardeDuPereDeLaDivAOcculter.couleur;
            pereDeLaDivAOcculter.innerText="";
            // Rattachement du conteneur qu'on avait fait disparaître de l'affichage
            pereDeLaDivAOcculter.appendChild(divAOcculter);
            },
            1500
        );
        // Purge de l'entrée prénom précédente --> à tester si c'est encore utile sans event.preventDefault())
        sourceIdentite.value="";
    }
    // Cas où l'entrée est valide : il faut alors sauvegarder le prénom dans le localStorage et modifier 
    // la page web pour pouvoir invoquer les pages web suivantes (choix du quizz, résultats des quizz) du site
    // ou sortie du site par un lien "Quitter"
    else {
        session.localStorage.setItem("identiteDuCandidat",prenom); // sauvegarde du prénom
        chargementDesDonnees(prenom); // récupération des données à l'aide des fetch() et mise à jour de la page
    }
}
/*---------------------------------------------------------------------------------------------------------------*/
// Voici la fonction principale :
// Elle récupère toutes les données en bdd, crée une nouvelle donnée à partir de celles-ci et sauvegarde toutes
// ces données dans le localStorage de façon à éviter de refaire des fetch.
// Elle n'est à réaliser que si le prénom rentré est valide.
/*---------------------------------------------------------------------------------------------------------------*/
async function chargementDesDonnees(prenom) { // async requis puisque la fonction fait appel à une fonction avec await
    /*---------------------------------------------------------------*/
    /* Fonctions utilitaires pour la récupération des données en bdd */
    /*---------------------------------------------------------------*/ 
    async function listeEpreuves() {         // Récupération de la liste des épreuves sur le site ad hoc
        const reponse = await fetch('http://qcm.alwayslearn.fr/api/examens');
        // A faire : vérifier que reponse contient la donnée (code )

        const data = await reponse.json();
        return data;
    }    
    async function contenuEpreuve(i) {       // Récupération du contenu d'une épreuve sur le site ad hoc
        const reponse = await fetch('http://qcm.alwayslearn.fr/api/examens/'+i);
        const data = await reponse.json();
        return data;
    }
    /*-------------------------------------------------*/
    /* Récupération des éléments de la base de données */
    /*-------------------------------------------------*/
    // Acquisition de la liste des épreuves
    const listeDesEpreuves = await listeEpreuves(); 
    // Acquisition des contenus des épreuves sous la forme d'un tableau
    const contenuDesEpreuves=[];
    for (let i=1; i<=listeDesEpreuves["hydra:totalItems"];i++) { 
        let epreuve = await contenuEpreuve(i);
        contenuDesEpreuves.push(epreuve);
    }
    contenuDesEpreuves.sort((a,b) => (a.id>b.id));   // instruction inutile puisque, grâce au await,
                                                     // les lectures arrivent dans l'ordre, mais nécessaire si
                                                     // on procède à ccoups de .then()
    /*----------------------------------------------------------------------------------------------------------*/
    /* Rappel :                                                                                 */
    /* - quizz <=> listeDesEpreuves nettoyé des infos inutiles, donc un tableau avec les noms des quizz         */
    /* - questions <=> contenuDesEpreuves nettoyé des infos inutiles, sous la forme d'un tableau de dimension   */
    /*                 le nombre de quizz de tableaux avec les libellés des questions                           */
    /* - reponses <=> contenuDesEpreuves nettoyé des infos inutiles, sous la forme d'un tableau de dimension    */
    /*                le nombre de quizz de tableaux de dimension le nombre de questions pour le quizz[i] de    */
    /*                tableaux avec les réponses proposées pour la question[j] du quizz[i]                      */
    /* - statut --> pour le suivi (quizz faits, questions répondues, réponses), mis en forme ainsi :            */
    /*         statut[i]       <-- parcourt les quizz                                                           */
    /*         statut[i][j]    <-- parcourt les questions composants un quizz                                   */
    /*         statut[i][j][k] <-- parcourt les états OK/NOk des réponses possibles en un agrégat               */
    /*         avec la "bonne" réponse ("OK") qui est indiquée dans contenuDesEpreuves, et la réponse donnée    */ 
    /*         par le candidat ("Re"), initialisée à null (à faire remplir dans la page quizz.html)             */
    /*----------------------------------------------------------------------------------------------------------*/
    quizz=listeDesEpreuves["hydra:member"].map(x=>x.title);
    for (let i=0; i<contenuDesEpreuves.length; i++) {
        let questionsDUnQuizz=[];
        for (let j=0; j<contenuDesEpreuves[i].question.length; j++) {
            questionsDUnQuizz.push(contenuDesEpreuves[i].question[j].question)
        }
        questions.push(questionsDUnQuizz);
    }
    for (let i=0; i<contenuDesEpreuves.length; i++) {
        let reponsesDUnQuizz=[];
        for (let j=0; j<contenuDesEpreuves[i].question.length; j++) {
            let reponsesAUneQuestion=[];
            let k=1;        // les réponses possibles à une question sont regroupées en agrégat dont les champ sont des
                            // chaîne de caractères représentant un nombre entier et qui commence avec "1"
            while (contenuDesEpreuves[i].question[j].options[String(k)]!=undefined) {
                reponsesAUneQuestion.push(contenuDesEpreuves[i].question[j].options[String(k)].option)
                k++;
            }
            reponsesDUnQuizz.push(reponsesAUneQuestion);
        }
        reponses.push(reponsesDUnQuizz);
    }
    for (let i=0; i<contenuDesEpreuves.length; i++) {
        let statutDUnQuizz=[];
        for (let j=0; j<contenuDesEpreuves[i].question.length; j++) {
            let statutDUneQuestion=[];
            let k=1;        // les réponses possibles à une question sont regroupées en agrégat dont les champ sont des
                            // chaîne de caractères représentant un nombre entier et qui commence avec "1"
            while (contenuDesEpreuves[i].question[j].options[String(k)]!=undefined) {
                statutDUneQuestion.push(
                    { 
                        "OK": contenuDesEpreuves[i].question[String(j)].options[String(k)].isCorrect,
                        "Re" : null,
                    }
                )
                k++;
            }
            statutDUnQuizz.push(statutDUneQuestion);
        }
        statut.push(statutDUnQuizz);
    }
    /* ------------------------------- */
    /* Sauvegarde dans le localstorage */
    /*---------------------------------*/ 
    // Sauvegarde de la liste des quizz --> mot-clé "quizz"
    session.localStorage.setItem("quizz",JSON.stringify(quizz));
    // Sauvegarde des questions des quizz --> mot-clé "questions"
    session.localStorage.setItem("questions",JSON.stringify(questions));
    // Sauvegarde des rponses aux questions des quizz --> mot-clé "reponses"
    session.localStorage.setItem("reponses",JSON.stringify(reponses));
    // Sauvegarde du statut pour le suivi des quizz --> mot-clé "statut"+prenom
    session.localStorage.setItem("statut"+prenom,JSON.stringify(statut));

    // Création et sauvegarde du suivi personalisé du candidat (le suivi se fait au niveau du quizz) si un tel
    // suivi n'existe pas encore ; s'il existe il est stocké dans le localStorage sous le nom "suivi"+prénom
    DEBUG("test suivi")
    if (JSON.parse(session.localStorage.getItem("suivi"+prenom))===null) { DEBUG("création suivi")
        suivi=Array(quizz.length).fill(false);
        session.localStorage.setItem("suivi"+prenom,JSON.stringify(suivi));
    }
    else { DEBUG("chargement suivi");
        suivi=JSON.parse(session.localStorage.getItem("suivi"+prenom));
    }
// Elaboration de la page web comportant un message de bienvenue, et - à ce stade - un lien pour quitter le site
// (retour à la même page web en rechargeant le navigateur avec la même URL) et un lien pour aller sur la page
// exams.html
    // Sélection du conteneur parent du conteneur à faire disparaître pour pouvoir y accrocher à sa
    // place des liens hypertextes pour revenir sur la même URL ou pour aller sur examx.html
    const pereDeLaDivARemplacer=document.querySelector("#portfolio");   // --> voir à simplifier car déjà fait plus haut
    // Suppression du conteneur à remplacer
    const divARemplacer=document.querySelector("#divAOcculter");        // --> voir à simplifier car déjà fait plus haut
    divARemplacer.remove();
    // Elaboration de la branche d'arbre du DOM qui doit venir remplacer le conteneur qu'on a fait disparaître; 
    // Cette branche comprend une <div> (divRemplacante) qui contient une <div> (divEnfant) qui contient deux <a>
    // (lienVersAccueil et lienVersExams) à ce stade 
    // A prévoir : un lien vers result.html si le même prénom est rentré que celui sauvegadé dans le localStorage
    //             et si les quizz ont tous été réalisés
    //             un lien vers exams.html si le même prénom est rentré que celui sauvegardé dans le localStorage
    //             et si tous les quizz n'ont pas été réalisés
    const divRemplacante=document.createElement("div");  // divRemplacant pour contenir le message de bienvenue
    divRemplacante.innerText="Bienvenu(e) " + prenom;
    divRemplacante.style.fontSize="24px";
    divRemplacante.style.textAlign="center";       
    pereDeLaDivARemplacer.style.height="365px";          // --> pour conserver le même aspect (le conteneur 
    pereDeLaDivARemplacer.style.boxSizing="border-box";  //     remplaçant le conteneur disparu est moins haut)
    pereDeLaDivARemplacer.appendChild(divRemplacante);
    const divEnfant=document.createElement("div");       // divEnfant pour contenir les deux lien hypertextes
    divEnfant.style.width="50%";
    divEnfant.style.fontSize="20px";
    divEnfant.style.paddingTop="20px";
    divEnfant.style.margin=" 0 auto 0 auto";
    divEnfant.style.display="flex";                      // --> display:flex pour répartir les liens horizontalement
    divEnfant.style.justifyContent="space-around";
    divRemplacante.appendChild(divEnfant);
    const lienVersAccueil=document.createElement("a");   // lienVersAccueil
    lienVersAccueil.href="./index.html";
    lienVersAccueil.innerText="Quitter";
    lienVersAccueil.style.fontWeight="bold";
    lienVersAccueil.style.color="inherit";
    divEnfant.appendChild(lienVersAccueil);
    const lienVersExams=document.createElement("a");     // lienVersExams
    lienVersExams.href="./exams.html";
    lienVersExams.innerText="Vers la liste des quizz";
    divEnfant.appendChild(lienVersExams);
    DEBUG("OK création DOM");
    // Si et seulement si tous les quizz ont été réalisés par le candidat
    // créer le lien hypertexte pour aller à result.html (hypothèse: exams.html
    // et result.html sont dans un même répertoire)
    let fini=(suivi.length>=1);
    for (let i=0; i<suivi.length; i++) {fini=(fini && suivi[i])}
    console.log("fini",fini,"suivi",suivi);
    if (fini) {
        const lienVersResultat=document.createElement("a");
        lienVersResultat.href="./result.html";
        lienVersResultat.innerText="Vers vos résultats";
        lienVersResultat.style.fontWeight="bold";
        lienVersResultat.style.color="red";
        divEnfant.appendChild(lienVersResultat);
    }
}

/*------------------------*/
/* Début du corps du code */
/*------------------------*/
// Le corps du code consiste à faire en sorte de réagir sur un clic sur "ENTRER"
const formEntrer = document.getElementById("form");
//const firstnameHTML = document.getElementById("prenom");
formEntrer.addEventListener("submit",traiterClickSurEntrer);
/*----------------------*/
/* Fin du corps du code */
/*----------------------*/

