<?php 

/**
 * Fichier : constantes.inc | Définitions des Contantes Générales (DEFINE)
 * Auteur : BY - BAEZA Yvan
 * Copyright : 2019
 * Version : 2019-11-06
 */

// Ces éléments sont à installer dans tous les PHP appelés directement
// if (!defined('SITE_PATH')) {define('SITE_PATH', $_SERVER['DOCUMENT_ROOT']);}        // ex. D:\WorkSpace_PHP\php7\{sitedev}
// if (!defined('ASSETS_REP')) {define('ASSETS_REP', 'assets');}                       // répertoire des contenus (assets)

// ----------------------------------------------------------------------------------------------------------------------
if (!defined('SITE_URL')) {
    // Récup. Protocole  ex. http || https
    $protocole = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https') === false ? 'http:':'https';
    // Récup. Server Name pour le Host --> localhost:3000 ou sitedev:80
    $host = $_SERVER['SERVER_NAME'];
    $port = $_SERVER['SERVER_PORT'];
    define('SITE_URL', $protocole.'//'.$host.":".$port); // ex. http://sitedev:80
}

if (!defined('ASSETS_PATH')) {define('ASSETS_PATH',SITE_PATH.'/'.ASSETS_REP);}        // ex. D:\WorkSpace_PHP\php7\sitedev\assets
if (!defined('ASSETS_URL')) {define('ASSETS_URL',SITE_URL.'/'.ASSETS_REP);}           // ex. http://sitedev:port/assets
    
