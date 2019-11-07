<?php

/**
 * Fichier : memory_scores.php | Jeu Memory / Affichage des Scores
 * Auteur : BY - BAEZA Yvan
 * Copyright : 2019
 * Version : 2019-11-06
 */

    // Désactive l'affichage des Erreurs PHP
    error_reporting(0);

    // DEFINE Généraux
    if (!defined('SITE_PATH')) {define('SITE_PATH', $_SERVER['DOCUMENT_ROOT']);}        // ex. D:\WorkSpace_PHP\php7\{sitedev}
    if (!defined('ASSETS_REP')) {define('ASSETS_REP', 'assets');}                       // répertoire des contenus (assets)

    // Inclusion des CONSTANTES
    include_once(SITE_PATH.'/'.ASSETS_REP.'/php/inc/constantes.inc');                   

    // Inclusion des éléments communs
    include_once(ASSETS_PATH.'/php/inc/communs.inc');

    // Inclusion des classes
    include_once(ASSETS_PATH.'/php/inc/classes.inc');

    // Inclusion <!doctype html><html><head></head>
    $titre = "Memory | Les Scores";
    include_once(ASSETS_PATH.'/php/inc/head.inc');
?>

<?php
    // ----Utilisation des INPUT_POST ---
    // -Vérification si ouverture de la page initiale (sans données POST) ou après submit du formulaire (avec donnée POST)
    $score_a_enreg = false;
    $message="";

    if ( !filter_has_var(INPUT_POST,"enregistrer") ) {
        // Chargement initial, rien à faire
    } else {
        // Chargement après 'submit'
        // - Vérification des informations avec filtres de type expression relationnelle
        // -- définition expression relationnelle de validation
        $regexp_alpha = "/^[a-z0-9\-\_\ ]{3,50}$/i";
        $regexp_nombre = "/[0-9]{0,}/";
        // -- définition filtre :
        $filtre_alpha = array(
            'filter'    => FILTER_VALIDATE_REGEXP,              // Filtre de validation de type expression relationnelle
            'options'   => array('regexp' =>  $regexp_alpha),     // Définition de la fonction relationnelle à utiliser
            'flags'     => FILTER_NULL_ON_FAILURE               // Renvoyer NULL à la place de FALSE si Erreur
        );
        $filtre_nombre = array(
            'filter'    => FILTER_VALIDATE_REGEXP,              // Filtre de validation de type expression relationnelle
            'options'   => array('regexp' =>  $regexp_nombre),  // Définition de la fonction relationnelle à utiliser
            'flags'     => FILTER_NULL_ON_FAILURE               // Renvoyer NULL à la place de FALSE si Erreur
        );
        // --définition des données à filtrer et du filtre à appliquer
        $filtres = array(
            'nom'      => $filtre_alpha,
            'dureems'  => $filtre_nombre,
            'timeuniq' => $filtre_nombre
        );
        // --Lancement des vérifications
        $saisies = filter_input_array(INPUT_POST, $filtres);
        
        // --$saisies est un array correspondant aux données filtrées
        if ( in_array(NULL, $saisies) ) {
            $message = "Impossible d'enregistrer le Score : Saisie incorrecte... ";
        } else {
            // C'est bon, les saisies peuvent être stockées
            $score_a_enreg = true;
        }
    }

    // Variables internes
    $message_sql = "";
    $erreur_sql = false;
    
    // Instanciation d'un objet de la Classe cSQLite
    $sqlite = new cSQLite(SITE_PATH."/sqlite", "memory.db");
    while (true) {
        
        // Connexion à la Base de Donnée
        if (!$sqlite->connexion()) {
            $erreur_sql = true;
            break;
        };
        // Création si inexistante de la Table pour Stocker les Scores
        if (!$sqlite->createTableScores() ) {
            $erreur_sql = true;
            break;
        };
        
        // Vérification si un nouveau score doit être stocké suite à un 'submit'
        if ($score_a_enreg) {
            // Mise en forme des données    
            $enreg = ['nom'=>$saisies['nom'], 'timeuniq'=> (int) $saisies['timeuniq'], 'dureems'=> (int) $saisies['dureems']];
            // ID du futur enregistrement, restera à -1 si une erreur survient
            $id = -1;
            // Ajout du nouveau Score
            if (!$sqlite->insertScore($enreg, $id)) {
                $message = "Impossible d'enregistrer le score : ".$sqlite->getErreur();
            } 
        }
        // Création d'une Requete de Sélection de tous les scores (cette requête pourrai être modifiée pour limiter le résultat au 10 meilleurs -> LIMIT 10)
        if (!$sqlite->selectAllScores()) {
            $erreur_sql = true;
        };
        break;
    }
    // Si un erreur est détecté, récupération du message associé
    if ($erreur_sql) {
        $message_sql = $sqlite->getErreur();
    }
    
    // Création de la page HTML
?>

<body>
    <div class="container-fluid">
        <h1>Bienvenue dans le Jeu 'Memory' - Les Scores</h1>
        <hr>
        <div>
            <a href="memory_jeu.php">Nouvelle Partie</a>
        </div>
        <hr>
        <?php if (!$erreur_sql) : ?>
            <table class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Classement</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Date</th>
                        <th scope="col">Durée</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        $nbscore = 0;
                        // Récupération de chaque enregistrement l'un après l'autre et mise en place dans une table
                        //- La premiere ligne aura un picto de Gagnant pour indiquer le meilleur score
                        //- Si l'on vient de rajouter un enregistrement (ID != -1), alors la ligne correspondante sera mise en valeur
                        while ($ok = $sqlite->recupEnregSuivant($enreg)) {
                            $nbscore += 1;
                            $row = 
                            '<tr '.($id == $enreg['sc_id'] ? "class=\"table-info text-danger\"":"").'>
                                <th scope="row">'.($nbscore == 1 ? "<i class=\"fa fa-2x fa-trophy\"></i>":$nbscore).'</th>
                                <td>'.by_vers_formulaire($enreg['nom']).'</td>
                                <td>'.$enreg['createat'].'</td>
                                <td>'.by_dureems_vers_texte($enreg['dureems']).'</td>
                            </tr>';
                            echo $row;
                        }
                        // - Fermeture de la Connexion à la Base de Donnée
                        $sqlite->deconnexion();
                        // Affichage d'une ligne particuliere si il n'y a pas de score sauvegardé
                        if ($nbscore == 0) {
                            echo '<tr><th scope="row">Aucun Score enregistré - Lancez une nouvelle partie</th><td></td><td></td><td></td></tr>';
                        }
                    ?>
                </tbody>
            </table>
        <?php else : ?>
            <div class="alert alert-warning" role="alert"><?= by_vers_page($message_sql); ?></div>
            <hr>
        <?php endif; ?>
        <?php if ($message !='') :?>
            <div class="alert alert-warning" role="alert"><?= by_vers_page($message); ?></div>
        <?php endif; ?>
    </div>

</body>
</html>