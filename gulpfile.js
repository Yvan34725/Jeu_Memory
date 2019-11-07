/**
 * Fichier : gulpfile.js | Automatiseur de Taches
 * Auteur : BY - BAEZA Yvan
 * Copyright : 2019
 * Version : 2019-11-06
 */

// ------ Définition des Constantes Principale
const source = 'src/';                                    // Répertoire Source
const cible = 'assets/';                                  // Répertoire Cible

// ------ Définition des éléments requis
const gulp  = require ('gulp');                            // gulp lui-meme

const gulpif = require ('gulp-if');                         // Permet de faire des conditions
const concat = require ('gulp-concat');                     // Tools de Concatenation de fichiers *
const uglifyes = require('gulp-uglify-es').default;         // Tools de Minification de  fichiers JS inclu ES6
const minify = require ('gulp-clean-css');                  // Tools sur CSS dont Minification de fichiers CSS
const imagemin = require ('gulp-imagemin');                 // Tools sur les images (optimisation taille)
const del  = require ('del');                               // Tools de Destruction d'éléments (fichiers, répertoires)
const sourcemaps = require ('gulp-sourcemaps');             // Tools de Debug sur fichiers JS ou CSS
const autoprefixer = require ('gulp-autoprefixer');         // Tools pour ajouter les préfixes des divers navigateurs aux déclarations CSS
const googlewebfonts = require ('gulp-google-webfonts');    // Tools de Récupération de Fonts Google
const replace = require ('gulp-replace');                   // Tools pour effectuer des remplacements des morceaux de chaine
const sass = require ('gulp-sass');                         // Tools pour gérer les fichiers SASS -> CSS
const rename = require ('gulp-rename');                     // Tools pour renommer des fichiers
const cssbeautify = require ('gulp-cssbeautify');           // Tools pour arranger les fichiers CSS (tabulation, ...)
const browsersyncphp = require ('browser-sync').create();   // Tools pour gérer la synchronisation et le rafraichissement d'un navigateur en dév.


var sourcemapping = false;                                   // Indique si l'on doit intégrer le sourcemapping dans les fichiers CSS et JS pour le débug

// ------ Définitions des Chemins de Compilation(s)
const paths = {
  php:{                                                      // Eléments PHP surveillés
    src: [
      'index.php',
      cible + 'php/**/*.*'
    ]
  },
  scripts: {                                                  // Scripts JS surveillés et Concaténés --> vers cible + 'js' + all-scripts.min.js
    src: [
      'node_modules/jquery/dist/jquery.slim.js',              // Intégre JQUERY
      //'node_modules/bootstrap/dist/js/bootstrap.js',        // Intégre la librairie Javascript BOOTSTRAP simplifiée
      'node_modules/bootstrap/dist/js/bootstrap.bundle.js',   // Intégre la librairie Javascript BOOTSTRAP compléte
      source + 'js/**/*.js'                                 
    ],
    dest: cible + 'js'
  },
  stylesscss: {                                                // Scripts SCSS surveillés et Préprocessés (SASS) --> vers source + 'css' 
    src: [
      source + 'scss/**/*.scss'
    ],
    dest: source + 'css'
  },
  styles: {                                                   // Scripts CSS surveillés et Concaténés --> vers cible + 'css' + all-styles.min.js
    src: [
      'node_modules/bootstrap/dist/css/bootstrap.css',
      source + 'css/**/*.css'
    ],
    dest: cible + 'css'
  },
  images: {                                                    // Images surveillées et Optimisées --> vers cible + 'images'
    src: [
      source + 'images/**/*.+(jpg|jpeg|bmp|gif|png|svg)'
    ],
    dest: cible + 'images'
  },
  awesomefonts: {                                               // Fonts Awesome surveillées et Copiées --> vers cible + 'fonts' pour les *.eot/svg/ttf/woff/woff2 et .css
    src: [                                                      
      'node_modules/font-awesome/fonts/fontawesome-webfont.*',
      'node_modules/font-awesome/css/font-awesome.css'
    ],
    dest: cible + 'fonts',
    filecss: cible + 'fonts/font-awesome.css'
  },
  googlefonts: {                                                // Fonts GoogleFont à générer (liste dans fonts.list) et Copiées --> vers cible + 'fonts' 
    src: [
      source + 'fonts/fonts.list'
    ],
    dest: cible + 'fonts'
  }
};


// Test du fonctionnement de GULP 
// Appel --> gulp hello
function _hello (done) {
  console.log('Tache initiale : Bonjour le Monde');
  done(); 
};
exports.hello = _hello;

// Supprime le contenu des répertoires logs, outs, et du répertoire cible (+sous-rep) sauf le sous-rep 'php'
// Appel --> gulp clean
function _cleanfull (done) {
  del(['logs/*', 'outs/*', cible+'*', '!'+cible+'php*']);
  done();
}
exports.clean = _cleanfull;

// Traitement sur les scripts Javascript
// Appel --> gulp scripts
function _scripts (done) {
  gulp.src(paths.scripts.src)
    .pipe(gulpif(sourcemapping , sourcemaps.init()))  // Si le sourcemapping est activé, lancement de ce dernier
    .pipe(uglifyes())                                 // minifie chaque fichier Javascript traité
    .pipe(concat('all-scripts.min.js'))               // concatene dans le fichier de sortie (all-scripts.min.js)
    .pipe(gulpif(sourcemapping, sourcemaps.write()))  // Si le sourcemapping est activé, écriture du résultat dans le pipe
    .pipe(gulp.dest(paths.scripts.dest));             // génération du fichier de sortie
  done();
}
exports.scripts = _scripts;    

// Traitement sur les styles CSS
// Appel --> gulp styles
function _styles (done) {
  gulp.src(paths.styles.src)
    .pipe(gulpif(sourcemapping, sourcemaps.init()))   // Si le sourcemapping est activé, lancement de ce dernier
    .pipe(minify())                                   // minifie chaque fichier CSS traité
    .pipe(concat('all-styles.min.css'))               // concatene dans le fichier de sortie (all-styles.min.js)
    .pipe(gulpif(sourcemapping, sourcemaps.write()))  // Si le sourcemapping est activé, écriture du résultat dans le pipe
    .pipe(gulp.dest(paths.styles.dest));              // génération du fichier de sortie
  done();
}
exports.styles = _styles;

// Traitement sur les styles SCSS (SASS)
// Appel --> gulp stylesscss
function _stylesscss (done) {
  gulp.src(paths.stylesscss.src)
    .pipe(sass())                                      // Déclenchement du préprocesseur SASS
    .pipe(autoprefixer([                               // Mise en place de l'auto-préfixage (ex. transition-duration: 0.1s; -webkit-transition-duration: 0.1s; -o-transition-duration: 0.1s; )
      'Android 2.3',
      'Android >= 4',
      'Chrome >= 20',
      'Firefox >= 24', 
      'Explorer >= 8',
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6'
    ]))
    .pipe(cssbeautify({ indent: '  ' }))                // Arrangement du fichier résultat, tabulation, ordre des déclarations, ...
    .pipe(rename(function(path){ path.basename = 'scss_' + path.basename; })) // Changement du nom fichier de sortie (ex. test.scss --> scss_test.css)
    .pipe(gulp.dest(paths.stylesscss.dest));            // Génération du fichier de sortie
  done();
}
exports.stylesscss = _stylesscss;

// Traitement sur les fichiers Images
// Appel --> gulp images
function _images (done) {
  gulp.src(paths.images.src)
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))  // Optimisation de l'image (Level 5)
    .pipe(gulp.dest(paths.images.dest));                  // Génération de l'image optimisée
  done();
}
exports.images = _images;

// Traitement des Fonts Awesome
// Appel --> gulp awesomefonts
function _awesomefonts (done) {
  del([cible + 'fonts/font-awesome.css', cible + 'fonts/fontawesome*']);  // Suppression des éventuels fichiers déjà présents dans la cible
  gulp.src(paths.awesomefonts.src)
    .pipe(replace('../fonts/', function(val) { return '';}))              // Modification du contenu du fichier final sur le ciblage des Fonts
    .pipe(gulp.dest(paths.awesomefonts.dest));                            // Génération des fichiers de sortie
  done();
}
exports.awesomefonts = _awesomefonts;

// Traitement des Fonts Google
// Appel --> gulp googlefonts
function _googlefonts (done) {
  del([cible + 'fonts/*','!assets/fonts/font-awesome.css','!assets/fonts/fontawesome*']); // Suppression des éventuels fichiers déjà présents dans la cible (sauf ceux awesome)
  gulp.src(paths.googlefonts.src)
    .pipe(googlewebfonts())                                                 // Récup. du fichier fonts.list et génération des fonts demandées
    .pipe(gulp.dest(paths.googlefonts.dest));                               // Génération des fichiers de sortie
  done();
}
exports.googlefonts = _googlefonts;

// Rafraichi l'affichage du Navigateur (BrowserSync)
// Pas d'appel direct
function _reload(done) {
  browsersyncphp.reload();
  done();
}

// Lance le Navigateur (BrowserSync)
// Pas d'appel direct
function _browsersync(done) {
  
  browsersyncphp.init({
    proxy : 'jeu_memory:8080'                             // Utilisation d'un Proxy, l'application fonctionne sur un Serveur (IIS + PHP, Apache...)
    // server: {
    //   baseDir :'./',                                   // Utilisation directe en stipulant la racine ou se situe le fichier initial (ex. index.php)
    // }
  });
  done();
}

// Lancement de la Surveillance des Répertoires (et contenus) + Reload si Changement
// Pas d'appel direct
function _watch (done) {
  gulp.watch(paths.php.src, gulp.series(_reload));                        // PHP
  gulp.watch(paths.scripts.src, gulp.series(_scripts, _reload));          // Scripts Javascript
  gulp.watch(paths.stylesscss.src, gulp.series(_stylesscss));             // Styles SCSS (SASS)
  gulp.watch(paths.styles.src, gulp.series(_styles, _reload));            // Styles CSS
  gulp.watch(paths.images.src, gulp.series(_images, _reload));            // Images
  gulp.watch(paths.awesomefonts.src, gulp.series(_awesomefonts,_reload)); // Fonts Awesome
  gulp.watch(paths.googlefonts.src, gulp.series(_googlefonts, _reload));  // Fonts Google
  done();
}

// Traitement pour la Génération de toutes les Fonts en même temps (Awesome et Google)
// Pas d'appel direct
const _buildfonts = gulp.parallel(_awesomefonts, _googlefonts);


// Traitement de Build en Mode dev.
// Appel --> gulp build 
const _build = gulp.series(_cleanfull, _stylesscss, gulp.parallel(_styles, _scripts, _images, _buildfonts), _watch, _browsersync);
exports.build = _build;

// Traitement Par défaut (lance le traitement de 'build')
// Appel --> gulp  
gulp.task('default',_build);

