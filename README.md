# Jeu_Memory

Ce projet permet de créer le jeu du 'Memory' en mode WEB (PHP, SQLite3)

- Au commencement du jeu, des cartes sont disposées face cachée à l'écran (28 cartes)
- Le joueur doit cliquer sur deux cartes. Si celles-ci sont identique, la paire est validée. Sinon, les cartes sont retournées face cachée, et le joueur doit sélectionner un nouvelle paire de cartes.
- Un compteur de temps (barre de progression), s'affiche en dessous de plateau.
- Le joueur gagne s'il arrive à découvrir toutes les paires avant la fin du temps imparti (2 minutes).
- Chaque temps de partie effectuée et gagnée est sauvegardé en base de données. Avant le début du jeu, les meilleurs temps sont affichés.

### Pré-requis

Environnement nécessaire pour lancer ce projet...

_Sur Windows_
- Node.JS (v11.12.0), inclu Npm (v6.7.0)
- Git (v2.23.0.windows)
- Serveur WEB avec ses extensions pour PHP (v7.3)
- Extension SQLite3 activée sur PHP
- Un éditeur de texte Visual Studio Code {VCS} (v1.39.2) avec ses extensions pour développer des applications WEB (HTML, PHP, Javascript, CSS, SASS...)

### Installation

_Sur Windows_
- Créer un répertoire cible _exemple_ : ``Jeu_Memory``
- Avec {VSC}, ouvrir ce répertoire et lancer un terminal
- Configurer Git pour ce répertoire
    * ``git init``
    * ``git remote add origin https://github.com/Yvan34725/Jeu_Memory.git``
- Récupérer l'image du repo. : 
    * ``git pull origin master``
- Ouvrir le fichier ``gulpfile.js``
    * A la fin du fichier, dans le fonction ``_browsersync``, modifier le proxy pour qu'il correspondent à votre configuration WEB _exemple_ : ``localhost:80``
- Lancer la récupération de tous les éléments nécessaire pour Gulp
    * ``npm install``
_cette opération peut-être assez longue, elle génére automatiquement un répertoire ``node_modules`` et un fichier ``package-lock.json``, ces éléments ne sont pas à modifier_
- Lancer l'automatiseur de tache Gulp
    * ``gulp``
_après quelques traitements, votre navigateur doit se lancer avec l'application Jeu Memory affichée_

### Environnement de Développement

_Sur Windows_
- Après avoir lancé Gulp, le répertoire ``assets`` est mis à jour avec :
    * ``\css\all-styles.min.css``; fichier compilé des feuilles de styles (_ne pas modifier_)
    * ``\fonts\*`` ; fonts utilisées (FontAwesome / GoogleFont) (_ne pas modifier_)
    * ``\images\*``; images optimisées (_ne pas modifier_)
    * ``\js\all-scripts.min.css``; fichier compilé des javascripts (_ne pas modifier_)

- Les éléments modifiables sont :
    * ``src\scss\**\*.scss`` ; feuilles de styles (SASS) 
    * ``src\fonts\fonts.list`` ; liste des fonts Google nécessaires
    * ``src\images\*`` ; images originales non optimisées
    * ``src\js\**\*.js`` ; fichiers de script Javascript
    * ``assets\php\**\*`` ; fichiers PHP
    * ``index.php`` ; fichier PHP initial

- Le répertoire :
    * ``sqlite`` ; contient la base de donnée

- Le fichier ``src\js\jeu_memory.js`` permet de configurer les divers paramètres du jeu :
    * TEMP_JEU_MAX ; Durée d'une partie (2 minutes par défaut)
    * NB_PAIRESAJOUER ; Nombre de Paire de Carte à installer sur le plateau (14 par défaut; max. 18)
    * NB_COL ; Nombre de colonne pour le plateau (7 par défaut ; max. 12)
    * NB_ROW ; Nombre de ligne pour le plateaux (4 par défault ; max. en fonction des autres paramètres)


## Fabriqué avec

- Visual Studio Code {VSC}
- Gulp

## Versions

**Dernière version :** 2019-11-06

## Auteurs

* **Yvan** _alias_ [Yvan34725]

## License

* Copyright BY-2019
