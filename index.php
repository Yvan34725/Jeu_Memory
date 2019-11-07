<?php

/**
 * Fichier : index.php | Page Principale du Jeu Memory, redirection vers la page des scores
 * Auteur : BY - BAEZA Yvan
 * Copyright : 2019
 * Version : 2019-11-06
 */

// DEFINE Généraux
if (!defined('SITE_PATH')) {define('SITE_PATH', $_SERVER['DOCUMENT_ROOT']);}        // ex. D:\WorkSpace_PHP\php7\{sitedev}
if (!defined('ASSETS_REP')) {define('ASSETS_REP', 'assets');}                       // répertoire des contenus (assets)

// Redirection sur la page Accueil.php
header('location: /'.ASSETS_REP.'/php/page/memory_scores.php');
exit;

