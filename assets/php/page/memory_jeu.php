<?php

/**
 * Fichier : memory_jeu.php | Jeu Memory / Plateau de Jeu 
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
    
    // Inclusion <!doctype html><html><head></head>
    $titre = "Memory | Le Jeu";
    include_once(ASSETS_PATH.'/php/inc/head.inc');

    // Création de la page HTML
?>

<body>
  <div class="container-fluid">
    <h1>Bienvenue dans le Jeu 'Memory' - A vous de Jouer</h1>
    <hr>
    <div>
        <a href="memory_scores.php"><i class="fa fa-reply"></i> Retour Page des Scores</a>
        <a href="memory_jeu.php">Nouvelle Partie</a>
    </div>
    <hr>
    <div class="alert alert-info alert-dismissible fade show" role="alert">
        <p>
            <strong>Régle du Jeu :</strong><br/>
            Commencez par cliquer sur une carte pour débuter la Partie.<br/>
            A chaque paire de cartes retournée : <br/>
            - Si les cartes sont identiques, elles restent affichées, le score augmente,<br/>
            - Si les cartes sont différentes, elles restent visibles 1 seconde puis se cachent à nouveau,<br/>
            La barre de progression indique le pourcentage de temps écoulé<br/>
            La Partie est gagnée si toutes les paires sont retournées avant la fin du temps imparti (2 minutes)<br/>
        </p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <noscript>
         <div style="text-align:center; color:red;"><strong>Votre Navigateur n'accepte pas JavaScript, il est impossible de jouer à ce Jeu !<strong></div>
    </noscript>
    <?php /* Le Plateau est créé dynamiquement en Javascript à l'intérieur de l'élément <div id="by-plateau-content"></div> */ ?>
    <div id="by-plateau-content"></div>
  </div>
  <?php /* Modale MsgBox affichée dynamiquement en Javascript */ ?>
  <div id="by-msgbox-content" class="by_nodisp">
      <div id="by-msgbox">
          <div id="by-msgbox-close">Fermer</div>
          <h2 id="by-msgbox-titre">...</h2>
          <hr>
          <form id="by-msgbox-form" class="by_nodisp" action="memory_scores.php" method="post">
              <input type="hidden" name="dureems" id="by-form-dureems" value="">
              <input type="hidden" name="timeuniq" id="by-form-timeuniq" value="">
              <input type="text" name="nom" id="by-form-nom" class="form-control" data-ptn="nom" placeholder="Veuillez saisir votre Nom (3..50) caractères" autocomplete="off" minlength="3" maxlength="50" size="50" required ><br/>
              <input type="submit" id="by-form-submit" name="enregistrer" class="text-center" value="Enregistrez votre Score" disabled/>
          </form> 
      </div>
  </div>
</body>
</html>