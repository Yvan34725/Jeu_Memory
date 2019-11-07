/*!
 * File : jeu_memory.js
 * Auteur : BY - BAEZA Yvan
 * Copyright : 2019
 * Version : 2019-11-06
 */

 //----- Définition des CONSTANTES Générales
const NB_PAIRESTOTALE   = 18;                       // NB Total de sprites dans l'image globale des cartes du jeu

const NB_PAIRESAJOUER   = 14;                       // 14 paires de cartes, soient 28 cartes
const NB_COL            = 7;                        // Nombre total de colonne sur une ligne /!\ max. 12 
const NB_ROW            = 4;                        // Nombre total de ligne /!\ NB_ROW * NB_COL = NB_PAIRESAJOUER * 2 && NB_PAIRESAJOUER < NB_PAIRESTOTALE
const TEMPS_JEU_MAX     = 2 * 60 * 1000;            // 2 minutes = 2*60s*1000ms

const TXT_GAGNE         = "Félicitations, vous avez Gagné";
const TXT_PERDU         = "Désolé, vous avez Perdu !";

const GAGNE             = true;
const PERDU             = false;
const BLOQUE            = true;
const DEBLOQUE          = false;
const OUVRE             = true;
const FERME             = false;

//----- Définition des Variables Globales
let plateau_jeuenplace = false;                     // Plateau généré et prêt à jouer                   

let tab_plateau = new Array();                      // Tableau correspondant au Plateau du jeu, chaque case correspond à une carte (indice du sprite)

let score = 0;                                      // Score en cours

let tab_carteretournee = [null, null];              // Tableau d'Elements DOM correspondant aux deux cartes de la paire en cours de comparaison

let temps_debutjeu = 0;                             // TimeStamp du Démarrage du Jeu

let timer_erreurpaire = 0;                          // ref. Timer pour affichage temporaire de la paire de cartes
let timer_tempsjeu = 0;                             // ref. Timer pour durée du jeu


// ------ Liste des pattern pour le 'regex' champ de saisie
let tab_pattern = new Array();
tab_pattern['vide']            = "^$";
tab_pattern['nonvide']         = ".{1,}";
tab_pattern['nom']             = "^[a-zA-Z0-9\-\_\ ]{3,50}$";   



// ------ Polyfill function Math.trunc
Math.trunc = Math.trunc || function(_x) {
    if (isNaN(_x)) {
      return NaN;
    }
    if (_x > 0) {
      return Math.floor(_x);
    }
    return Math.ceil(_x);
};


// ------ Les fonctions ------------------------------------------------------------------------------

/**
 * Fonction by_getRandomInt (Retourne une valeur aléatoire entre [0...max[
 *
 * @param [int] _max, Borne Maximum
 * @return [int] valeur aléatoire
 */
function by_getRandomInt(_max) {
    return Math.floor(Math.random() * Math.floor(_max));
}

/**
 * Fonction by_selectPairesAJouer (Rempli le Tableau général tab_plateau[] avec les cartes à trouver)
 *
 * @param aucun
 * @return aucun
 */
function by_selectPairesAJouer() {
    // Intitialisation/Purge du tableau
    tab_plateau = [];
    tab_plateau.length = NB_PAIRESAJOUER * 2;     // Plateau de jeu => 2 * NB_PAIRESAJOUER => 28 cases

    let indicepaire;
    let indiceautrecase;

    for (let index = 0; index < (NB_PAIRESAJOUER * 2); index++) {

        if ( tab_plateau[index] == undefined ) {
            while (true) {
                // Tirage d'un N° de carte aléatoire parmis toutes les paires possibles
                indicepaire = by_getRandomInt(NB_PAIRESTOTALE);  
                // Vérification non présence de cette paire dans la plateau
                if (tab_plateau.indexOf(indicepaire) != -1) {
                    // La paire est déjà sélectionnée, il faut en tirer une autre
                    continue;
                }
                // La paire n'est pas sélectionnée, on sort de la boucle
                break;
            }
            // Affectation de la valeur au plateau de jeu
            tab_plateau[index] = indicepaire;
            while (true) {
                // On doit tirer une autre case du plateau pour mettre la même carte est constituer la paire
                indiceautrecase = by_getRandomInt(NB_PAIRESAJOUER * 2);
                if (tab_plateau[indiceautrecase] != undefined) {
                    // La case est déjà occupée, on en tire une autre
                    continue;
                }
                break;
            }
            // Affectation de la valeur à la nouvelle case du plateau de jeu
            tab_plateau[indiceautrecase] = indicepaire;
        }
    }
}


/**
 * Fonction by_memoryCreePlateau() (Génére la structure HTML du plateau de jeu en créant les éléments dans le DOM, il est impératif d'avoir une <div> ayant comme id 'by-plateau-content')
 *
 * @param aucun
 * @return [boolean]; 'true' - Plateau de Jeu généré | 'false' - plateau de jeu non créé
 */
function by_memoryCreePlateau() {

    // Vérification cohérence des constantes
    if (NB_ROW * NB_COL != NB_PAIRESAJOUER * 2 || NB_PAIRESAJOUER  > NB_PAIRESTOTALE) {
        alert('Constantes incohérentes');
        return false;
    }
    
    // Récupération de l'élément général DOM devant contenir l'ensemble du plateau de jeu (titre, plateau, progress, ...)
    let elemPlateauContent = document.getElementById("by-plateau-content");
    
    // Vérification existance de l'élément général DOM
    if (elemPlateauContent == undefined | elemPlateauContent == '') {
        return false;
    }

    // Alimenter le plateau avec les cartes tirées aléatoirement.
    // L'image de fond contient 18 sprites de 100x100 pixels empilés sur l'axe 'Y'
    // Le plateau contient 24 cartes par paire soient 14 paires affichés
    // sur 3 lignes (row) de 7 colonnes (col)
    by_selectPairesAJouer();
    
    /** 
    *    Format HTML de plateau de jeu à créer à l'intérieur de la <div id="by-plateau-content"> qui doit déjà existée
    *    <div id="by-plateau-content">
    *        <div id="by-plateau-titre" class="text-center">
    *            <h2>Score : 0 / 14</h2><div>
    *        </div>
    *        <div id="by-plateau" class="by_plateau">
    *        <div class="row justify-content-center">
    *                <div class="col-1" data-card="0..NB_PAIRESAJOUER * 2"></div>
    *                .@NB_COL..
    *            </div>
    *            .@NB_ROW..
    *        </div>
    *        <div id="by-plateau-progress" class="progress md-progress by_nodisp">
    *            <div>&nbsp;<em class="text-info ">Temps Ecoulé :</em></div><div id="by-plateau-progress-bar" class="progress-bar bg-success" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    *        </div>
    *    </div>
    */

    // Récupération 
    // titre
    let elemTitre = document.createElement('div');
    elemTitre.innerHTML="<h2>Score 0 / "+NB_PAIRESAJOUER+"</h2>";
    elemTitre.id = "by-plateau-titre";
    elemTitre.classList.add("text-center");
    elemPlateauContent.appendChild(elemTitre);

    // tableau row/col
    let elemPlateau = document.createElement('div');
    elemPlateau.id = "by-plateau";
    elemPlateau.classList.add("by_plateau");
    for (let irow = 0; irow < NB_ROW; irow++) {
        let elemRow = document.createElement('div');
        elemRow.classList.add("row");
        elemRow.classList.add("justify-content-center");
        for (let icol = 0; icol < NB_COL; icol++) {
            let elemCol = document.createElement('div');
            elemCol.classList.add("col-1");
            elemCol.setAttribute("data-card",icol + (NB_COL * irow));
            elemRow.appendChild(elemCol);
        }
        elemPlateau.appendChild(elemRow);
    }
    elemPlateauContent.appendChild(elemPlateau);

    // barre de progession
    let elemProgress = document.createElement("div");
    elemProgress.id="by-plateau-progress";
    elemProgress.classList.add("progess");
    elemProgress.classList.add("md-progress");
    elemProgress.classList.add("by_nodisp");
    elemProgress.innerHTML = '<div>&nbsp;<em class="text-info ">Temps Ecoulé :</em></div>';
    elemProgress.innerHTML +='<div id="by-plateau-progress-bar" class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%" aria-valuemin="0" aria-valuemax="100"></div>';
    elemPlateauContent.appendChild(elemProgress);

    // Renvoie l'information que le plateau est créé
    return true;
}

/**
 * Fonction by_retourneCarte() (Retourne la carte venant d'être cliquée. Puis effectue les divers tests du Jeu)
 *
 * @param [objet] _event - Objet événement déclenché (souris up)
 * @param [objet] _elem - Objet DOM correspondant à l'élément ayant reçu l'événement (case du plateau)
 * @return aucun
 */
function by_retourneCarte(_event, _elem) {

    // Annule le comportement normal de propagation de l'événement
    _event.preventDefault();
    _event.returnValue = false;

    // Teste l'existance de _elem
    if (_elem == undefined) {return;}

    // Récupération de l'indice de l'élément qui vient d'être cliqué = indice du tableau (Plateau)
    let indiceplateau = parseInt(_elem.dataset['card']);
    // Récupération du N° de carte à afficher
    let numcarte = tab_plateau[indiceplateau];

    if (tab_carteretournee[0] == null) {
        // C'est la premiere carte que l'on retourne sur la paire
        tab_carteretournee[0] = _elem;
    } else {
        // C'est la seconde carte que l'on retourne sur la paire
        tab_carteretournee[1] = _elem;
        // Il faut comparer si ce sont les mêmes cartes
        // - Récupération elem. carte retournee précédente
        let elemCarteRetournee = tab_carteretournee[0];
        // - Récupération indice du plateau correspondant à la carte retournée
        let indiceplateaucarteretournee = parseInt(elemCarteRetournee.dataset['card']);
        // - Récupération du N° de carte correspondant à la carte retournée
        let numcarteretournee = tab_plateau[indiceplateaucarteretournee];

        if (numcarte == numcarteretournee ) {
            // Ce sont les mêmes cartes, on augemente le score de 1 point
            score += 1;
            // Affichage du Score
            let elemTitre = document.getElementById("by-plateau-titre");
            elemTitre.innerHTML="<h2>Score "+score+" / "+NB_PAIRESAJOUER+"</h2>";
            // Vérification si fin de Partie
            if (score == NB_PAIRESAJOUER) {
                // C'est GAGNE
                let tempsjeu = Date.now() - temps_debutjeu; // On obtient un délais en milliseconde
                // Arrêt du timer de temps de jeu
                clearInterval(timer_tempsjeu);
                // Mise en place du temps de jeu dans l'input 'hidden' pour le submit
                let elemInputDureems = document.getElementById('by-form-dureems');
                elemInputDureems.setAttribute("value",tempsjeu);
                // Mise en place du timestamp de la partie dans l'input 'hidden' pour le submit (pour éviter les doublons)
                let elemInputTimeUniq = document.getElementById('by-form-timeuniq');
                elemInputTimeUniq.setAttribute("value",Date.now());
                 // Le jeu est terminé, c'est 'GAGNE'
                by_msgBox(undefined, OUVRE, GAGNE);
            }
            // On remet le tableau des cartes à null pour recommencer la prochaine paire
            tab_carteretournee = [null, null];
        } else {
            // Ce ne sont pas les mêmes cartes, on laisse l'affichage de la deuxième carte quelques secondes puis on retourne les deux cartes
            // On recupere le tableau pour pouvoir bloquer les events sur ce dernier durant l'animation
            by_changeEtatPlateau(BLOQUE);
            timer_erreurpaire = setTimeout(by_timerErreurPaire,1000);
        }
    }
    // Affichage de la carte en déplaçant la position de l'image de background (sprite)
    _elem.style.backgroundPosition = "center -"+numcarte*100+"px";
    // Mise en place d'une classe permettant de bloquer les events sur cet element
    _elem.classList.add("by_retournee");

    if (temps_debutjeu == 0) {
        // C'est la première carte retournée, on lance le chrono.
        temps_debutjeu = Date.now();    
        // Lancement du Timer de vérification du temps, toutes les 1s
        timer_tempsjeu = setInterval(by_timerTempsJeu, 1000);
        // Affichage de la barre de progression
        let elemProgress = document.getElementById("by-plateau-progress");
        elemProgress.classList.remove("by_nodisp");
    }
}

/**
 * Fonction by_changeEtatPlateau() (Modifie l'état du Plateau de Jeu -> Clic Actif / Clic Inactif)
 *
 * @param [boolean] _etat - 'BLOQUE', plateau ne pouvant pas être cliqué | 'DEBLOQUE', plateau actif pouvant être cliqué
 * @return aucun
 */
function by_changeEtatPlateau(_etat) {

    // Récupération de l'élément Plateau
    let elemPlateau = document.getElementById("by-plateau");
    // Modification de l'état
    if (_etat == BLOQUE) {
        elemPlateau.classList.add("by_noevent");    // Ajout Classe bloquant tous les événements sur le plateau
    } else {
        elemPlateau.classList.remove("by_noevent"); // Suppression Classe bloquant tous les événements sur le plateau
    }

}

/**
 * Fonction by_timerErreurPaire() (CallBack appelée par SetTimeOut pour débloquée une paire de cartes bloquée après un certain temps)
 *
 * @param aucun
 * @return aucun
 */
function by_timerErreurPaire() {
    
    // Arrêt du Timer
    if (timer_erreurpaire != 0 ) {
        clearTimeout(timer_erreurpaire);
        timer_erreurpaire = 0;
    }
    // Déblocage de la paire de carte retournées en erreur
    tab_carteretournee.forEach(function(elemCarte) {
        elemCarte.style.backgroundPosition = "";
        elemCarte.classList.remove("by_retournee");
    });
    // Déblocage du Plateau    
    by_changeEtatPlateau(DEBLOQUE);
    // On remet le tableau des cartes à null pour recommencer la prochaine paire
    tab_carteretournee = [null, null];

}

/**
 * Fonction by_timerTempsJeu() (CallBack appelée à intervalle régulier par SetIntervalle pour gérer le temps de jeux)
 *
 * @param aucun
 * @return aucun
 */
function by_timerTempsJeu() {
    
    // Indicateur de fin de partie
    let bperdu = false;
    // Mise à jour de la Barre de Progression
    // - Calcul différence entre date_debutjeu et maintenant
    let tempsjeu = Date.now() - temps_debutjeu; // On obtient un délais en milliseconde
    // - Calcul pourcentage de temps par rapport au TEMPS_JEU_MAX
    let pourcentecoule;
    if (tempsjeu < TEMPS_JEU_MAX) {
        pourcentecoule = Math.trunc((tempsjeu * 100) / TEMPS_JEU_MAX);
    } else {
        // C'est perdu
        pourcentecoule = 100;
        if (timer_erreurpaire != 0) {
            // Arret setTimeout si nécessaire
            clearTimeout(timer_erreurpaire);
        }
        // Arrêt setInterval pour ne plus rappeler la CallBack
        clearInterval(timer_tempsjeu);
        // Blocage du Plateau
        by_changeEtatPlateau(BLOQUE);
        // Indicateur fin de partie = vrai
        bperdu = true;
    }
    // Mise à jour de la Barre de Progression avec changement de couleur en fonction du temps écoulé
    let elemProgressBar = document.getElementById("by-plateau-progress-bar");
    elemProgressBar.style.width = pourcentecoule+"%";
    elemProgressBar.innerHTML = "<strong>"+pourcentecoule+"%</strong>";
    if (pourcentecoule < 50) {
        elemProgressBar.classList.contains("bg-warning") ? elemProgressBar.classList.remove("bg-warning"):"";
        elemProgressBar.classList.contains("bg-danger") ? elemProgressBar.classList.remove("bg-danger"):"";
        !elemProgressBar.classList.contains("bg-success") ? elemProgressBar.classList.add("bg-success"):"";
    } else if (pourcentecoule < 75) {
        elemProgressBar.classList.contains("bg-success") ? elemProgressBar.classList.remove("bg-success"):"";
        elemProgressBar.classList.contains("bg-danger") ? elemProgressBar.classList.remove("bg-danger"):"";
        !elemProgressBar.classList.contains("bg-warning") ? elemProgressBar.classList.add("bg-warning"):"";

    } else {
        elemProgressBar.classList.contains("bg-success") ? elemProgressBar.classList.remove("bg-success"):"";
        elemProgressBar.classList.contains("bg-warning") ? elemProgressBar.classList.remove("bg-warning"):"";
        !elemProgressBar.classList.contains("bg-danger") ? elemProgressBar.classList.add("bg-danger"):"";
    }
    // Vérification statut du Jeu
    if (bperdu) {
        // Affichage du Message de fin 'PERDU'
        by_msgBox(undefined,OUVRE,PERDU);
    }
}

/**
 * Fonction by_msgBox() (Ouverture d'une DIV en mode Modal pour afficher le résultat du Jeu et gérer le form de saisie si Gagné)
 *
 * @param [objet] _event - Objet événement déclenché (souris up) | 'undefined' si appel par fonction
 * @param [boolean] _etatmsgbox - 'FERME' pour faire disparaitre | 'OUVRE' pour afficher
 * @param [boolean] _statutjeu - 'PERDU' | 'GAGNE' pour afficher le form de saisi du nom du joueur
 * @return aucun
 */
function by_msgBox(_event, _etatmsgbox, _statutjeu) {

    // Annule le comportement normal de propagation de l'événement
    if (_event != undefined) {
        _event.preventDefault();
        _event.returnValue = false;
    }
    // Récupération de l'élément MsgBox
    let elemMsgBox = document.getElementById("by-msgbox-content");
    if (_etatmsgbox == FERME) {
        elemMsgBox.classList.add('by_nodisp');
    } else {
        // Récupération de l'élément Titre
        let elemTitre = document.getElementById("by-msgbox-titre");
        // Récupération de l'élément Form
        let elemForm = document.getElementById("by-msgbox-form");
        if (_statutjeu == GAGNE) {
            elemTitre.innerHTML = TXT_GAGNE;
            elemForm.classList.remove('by_nodisp');
        } else {
            elemTitre.innerHTML = TXT_PERDU;
            elemForm.classList.add('by_nodisp');
        }
        elemMsgBox.classList.remove('by_nodisp');
    }
}

/**
 * Fonction by_champGetValue() (Retourne la valeur du champ DOM envoyé)
 *
 * @param [objet] _champ - Objet DOM correspondant au champ dont on veut la valeur (value)
 * @return [variant] String valeur du champs | 'undefined' si le champ ou sa valeur sont inconnues
 */
function by_champGetValue(_champ) {
  
    if (_champ == undefined) {return undefined;}
  
    let valchamp = undefined;
    
    // En fonction du type de champ, la value se récupére différemment dans le DOM
    switch (_champ.tagName.toLowerCase()) {
        case 'input':
        case 'textarea':
            //Récupération directement par .value
            valchamp = _champ.value;    
        break;
      
        case 'select':
            // Récupération par .value ou par le .innerHTML de l'élément sélectionné
            valchamp=(_champ.dataset['ref'] == 'value') ? _champ.value : _champ[_champ.selectedIndex].innerHTML;
        break;
      
        // --------- Autres types de champs à gérer ici si nécessaire
        default:
        break;
    }
    return valchamp;

  }


/**
 * Fonction by_champRegexControl() (Controle le contenu d'un champ ayant un pattern data-ptn="..." stipulé et bloqué l'envoi du form si le controle n'est pas bon)
 *
 * @param [objet] _champ - Objet DOM correspondant au champ dont on veut controler le contenu
 * @param [string] _pattern - Chaine correspondant au pattern regexp à appliquer 
 * @return aucun
 */
function by_champRegexControl(_champ, _pattern) {
  
    // Controle param.
    if (_pattern == null) { _pattern = _champ.dataset['ptn'];}
    // Récupération valeur du champ
    let valchamp = by_champGetValue(_champ);
    // Application du RegExp
    let regex = new RegExp(String(tab_pattern[_pattern]));
    // Récupération de l'élément correspondant à l'élément submit
    let elemBtnSubmit = document.getElementById('by-form-submit');
    // Test de validité de la valeur
    if (regex.test(valchamp)) {
        // Saisie Valide, on active l'élément submit et on supprime l'effet d'erreur autour du champ controlé
        _champ.classList.remove("is-invalid");
        elemBtnSubmit.removeAttribute("disabled");
    } else {
        // Saisie non Valide, on déactive l'élément submit et on ajoute l'effet d'erreur autour du champ controlé
        _champ.classList.add("is-invalid");
        elemBtnSubmit.setAttribute("disabled","");
    }
}


/**
 * ------ Le déclencheur principal JQUERY 
 *  Appel lorsque la page a terminé d'être chargée
 */
$(document).ready(function(){

    // Initialisation Plateau de Jeu
    if (!plateau_jeuenplace) {
        
        // Création du Plateau Memory
        plateau_jeuenplace = by_memoryCreePlateau();
        
        // Si le Plateau est en place, on active les événements
        if (plateau_jeuenplace) {
            // Mise en place des Evenements
            // - Sur Evénement Souris relachée sur les cartes du plateau de jeu
            $('[data-card]').mouseup( function (event) {by_retourneCarte( event, this); });
            
            // - Sur Evénement Souris relachée sur le bouton 'Fermer' de la Modale MsgBox
            $('#by-msgbox-close').mouseup( function (event) {by_msgBox( event, FERME, undefined); });
            
            // - Sur Evénement Touche Relachée, Prise de Focus, Changement sur tous les éléments ayant un pattern stipulé
            $('[data-ptn]').keyup( function () {by_champRegexControl( this, null ); });
            $('[data-ptn]').focus( function () {by_champRegexControl( this, null ); });
            $('[data-ptn]').change( function () {by_champRegexControl( this, null ); });
            }
    }

});



