<?php

/**
 * Fichier : commun.inc | Fonctions Communes et Génériques
 * Auteur : BY - BAEZA Yvan
 * Copyright : 2019
 * Version : 2019-11-06
 */


/**
 * Fonction by_vers_page (Retourne une Chaine avec tous les caractères HTML  + spéciaux ' et " encodés + tous les sauts de ligne '\n' encodés en '<br />')
 *
 * @param [string] $valeur, texte à analyser
 * @return [string] chaine convertie
 */
function by_vers_page(string $valeur): string {

    return nl2br(by_vers_formulaire($valeur));

}

/**
 * Fonction by_vers_formulaire (Retourne une Chaine avec tous les caractères HTML  + spéciaux ' et " encodés)
 *
 * @param [string] $valeur, texte à analyser
 * @return [string] chaine convertie
 */
function by_vers_formulaire(string $valeur): string {

    return htmlentities($valeur, ENT_QUOTES, 'UTF-8');

}

/**
 * Fonction by_dureems_vers_texte (Retourne une Chaine contenant la durée en milliseconde d'entrée formatée en -> 'x' min 'y' sec 'z' msec)
 *
 * @param [int] $dureems, durée en milliseconde à convertir
 * @return [string] chaine convertie
 */
function by_dureems_vers_texte(int $dureems): string {

    // Récupération des milièmes de seconde
    $milliemes = $dureems % 1000;
    // Récupération des secondes
    $_secondes = (int) ($dureems / 1000);
    $secondes = $_secondes % 60;
    // Récupération des minutes
    $_minutes = (int) ($_secondes / 60);
    $minutes =  $_minutes % 60;

    return $minutes." min ".sprintf("%'02d",$secondes)." sec ".sprintf("%'03d",$milliemes)." msec";

}
