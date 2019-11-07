<?php
/**
 * Fichier : classes.inc | Fichiers de définition des Classes
 * Auteur : BY - BAEZA Yvan
 * Copyright : 2019
 * Version : 2019-11-06
 */

/**
 * Classe cSQLite | Permet de gérer une base de données de type SQLite3
 */
class cSQLite {
        
    // ------ Définition des attributs
    public  $_pathbase;             // Chemin de la base de données (sans '\' final)
    public  $_nomfiledb;            // Nom du fichier de base de données *.db

    private $_connexion;            // Objet Connexion
    private $_requete;              // Objet Requete
    private $_erreur;               // Message d'Erreur en cas de problème
    

    // ------ Définition des Méthodes
    // - Constructeur
    public function __construct ($pathbase, $nomfiledb) {
        // Initialiser les attributs
        $this->_pathbase = $pathbase;
        $this->_nomfiledb = $nomfiledb;
    }
    
    // - Destructeur
    public function __destruct() {
        $this::deconnexion();
    }

    // - Conversion de l'objet en chaine
    public function __toString() {
        // Retourne juste le pathbase et le nomfiledb
        return "__toString = $this->_pathbase - $this->_nomfiledb";
    }

    // - Les Getteurs et Setteurs
    /**
     * Fonction getErreur() - Retourne le texte de l'erreur stockée
     * @public
     * @param aucun
     * @return [string] Texte de l'erreur stockée
     */
    public function getErreur() {
        return $this->_erreur;
    }

    // - Les Méthodes diverses
    /**
     * Fonction connexion() - Ouverture d'une Connexion à la Base de Donnée
     * @public
     * @param aucun
     * @return [boolean] 'true', connexion établie | 'false' probléme -> getErreur retourne le message d'erreur
     */
    public function connexion() {
        // Ouvrir la base de donnée et gérer les éventuelles exceptions
        try {
            // Si un objet requete est déjà présent, le cloturer
            if ($this->_requete) {$this->_requete->close();};
            // Lancement de la connexion en instanciant un bojet SQLite3
            $this->_connexion = new SQLite3("$this->_pathbase/$this->_nomfiledb");
            $ok = true;
        } catch (Exception $e) {
            $this->_erreur = "Exception - ".$e->getMessage();
            $ok = false;
        } catch (Error $e) {
            $this->_erreur = "Erreur - ".$e->getMessage();
            $ok = false;
        }
        return($ok);
    }

    /**
     * Fonction deconnexion() - Fermeture de la Connexion à la Base de Donnée
     * @public
     * @param aucun
     * @return [boolean] 'true', déconnexion effectuée | 'false' probléme -> getErreur retourne le message d'erreur
     */
    public function deconnexion() {
        // Fermer la connexion à la base de donnée et gérer les éventuelles exceptions
        try 
        {
            if ($this->_connexion) {
                // Si un objet requete est déjà présent, le cloturer
                if ($this->_requete) {$this->_requete->close();};
                // Cloture de la connexion
                $this->_connexion->close();
                $ok = true;
            } else {
                $this->_erreur = "EProg - Déconnexion non nécessaire ! Connexion non établie";
                $ok = false;
            }
        } catch (Exception $e) {
            $this->_erreur = "Exception - ".$e->getMessage();
            $ok = false;
        } catch (Error $e) {
            $this->_erreur = "Erreur - ".$e->getMessage();
            $ok = false;
        }
        return($ok);
    }

    /**
     * Fonction createTableScores() - Création de la Table 'Scores' dans la Base de Données
     * @public
     * @param aucun
     * @return [boolean] 'true', création effectuée | 'false' probléme -> getErreur retourne le message d'erreur
     */
    public function createTableScores() {
        try
        {
            if ($this->_connexion) {
                // Texte de la Requete de Création de la Table si Inexistante
                $sql = 'CREATE TABLE IF NOT EXISTS scores (';
                $sql .='sc_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,';       // Identifiant unique automatique pour chaque score
                $sql .='timeuniq INTEGER NOT NULL UNIQUE,';                     // TimeStamp unique pour éviter tout doublon lié au 'submit'
                $sql .='nom VARCHAR(50) NOT NULL,';                             // Nom du joueur
                $sql .='dureems INTEGER NOT NULL,';                             // Durée en milliseconde de la partie
                $sql .='createat TEXT NOT NULL)';                               // Jour (JJ/MM/AAAA) de la partie
                // Exécuter la Requete
                $ok = (bool) ($this->_connexion->query($sql));
                // Récuperer le message d'erreur eventuel
                if (!$ok) {
                    $this->_erreur = $this->_connexion->lastErrorMsg();
                } else {
                    // Texte de la Requete d'Ajout de l'index sur Duree
                    $sql = 'CREATE INDEX IF NOT EXISTS idx_dureems ';            // Index sur la durée pour optimiser la requete de sélection des
                    $sql .= 'ON scores (dureems)';                               // scores classée par durée.
                    // Exécuter la Requete
                    $ok = (bool) ($this->_connexion->query($sql));
                    // Récuperer le message d'erreur eventuel
                    if (!$ok) {
                        $this->_erreur = $this->_connexion->lastErrorMsg();
                    }
                }
            } else {
                // La connexion n'est pas établie - Erreur
                $this->_erreur = "EProg - Création Table 'Scores impossible' ! Connexion non établie";
                $ok = false;
            }
        } catch (Exception $e) {
            $this->_erreur = "Exception - ".$e->getMessage();
            $ok = false;
        } catch (Error $e) {
            $this->_erreur = "Erreur - ".$e->getMessage();
            $ok = false;
        }
        return($ok);
    }

    /**
     * Fonction selectAllScores() - Sélection de tous les scores classés par ordre Croissant (+petit -> +grand)
     * @public
     * @param aucun
     * @return [boolean] 'true', sélection effectuée | 'false' probléme -> getErreur retourne le message d'erreur
     */
    public function selectAllScores() {
        try
        {
            if ($this->_connexion) {
                // Fermeture d'une éventuelle Requete précédente
                if ($this->_requete) {$this->_requete->close();};
                // Texte de la Requete
                $sql = 'SELECT sc_id, nom, dureems, createat FROM scores ORDER BY dureems ASC';
                // Exécuter la Requete
                $ok = (bool) ($this->_requete = $this->_connexion->query($sql));
                // Récuperer le message d'erreur eventuel
                if (!$ok) {
                    $this->_erreur = "EProg - ".$this->_connexion->lastErrorMsg();
                }
            } else {
                // La connexion n'est pas établie - Erreur
                $this->_erreur = "EProg - Sélection impossible ! Connexion non établie";
                $ok = false;
            }
        } catch (Exception $e) {
            $this->_erreur = "Exception - ".$e->getMessage();
            $ok = false;
        } catch (Error $e) {
            $this->_erreur = "Erreur - ".$e->getMessage();
            $ok = false;
        }
        return($ok);
    }

    /**
     * Fonction recupEnregSuivant() - Sélection de tous les scores classés par ordre Croissant (+petit -> +grand)
     * @public
     * @param [objet par ref.] &$enreg, objet correspondant à un enregistrement de la requete, celui-ci étant passé 
     *                                  par référence, il sert également de paramètre de sortie de la méthode.
     * @return [boolean] 'true', lecture effectuée | 'false' probléme -> getErreur retourne le message d'erreur
     */
    public function recupEnregSuivant(&$enreg) {
        try
        {
            if ($this->_connexion && $this->_requete) {
                // Lecture enregistrement suivant dans la requete
                $ok = (bool) ($enreg = $this->_requete->fetchArray());
                // Si fetchArray retourne FALSE, on verifie si c'est lié à une erreur ou non
                if (!$ok) {
                    if (in_array($this->_connexion->lastErrorCode(), [0, 100, 101])) {
                        // Pas d'erreur
                        // 0 - Pas d'erreur ! (au cas où)
                        // 100 - une ligne a été retournée
                        // 101 - plus de ligne à lire (no more rows available)
                        $ok = NULL; // Retourne NULL au lieu de FALSE
                    } else {
                        // Erreur
                        $this->_erreur = "EProg - ".$this->_connexion->lastErrorMsg();
                    }
                }
                return $ok;
            } else {
                // La connexion n'est pas établie ou la Requete n'existe pas - Erreur
                $this->_erreur = "EProg - Récupération impossible ! Connexion ou Requête invalide";
                $ok = false;
            }
        } catch (Exception $e) {
            $this->_erreur = "Exception - ".$e->getMessage();
            $ok = false;
        } catch (Error $e) {
            $this->_erreur = "Erreur - ".$e->getMessage();
            $ok = false;
        }
        return($ok);
    }

    /**
     * Fonction insertScore() - Insérer une nouvel enregistrement (score) dans la Table (Scores)
     * @public
     * @param [objet] &enreg, objet correspondant à l'enregistrement à stocker (INSERT)
     * @param [int par ref.] &$identifiant, int qui contiendra l'identifiant (sc_id) du nouvel enregistrement, celui-ci étant passé
     *                       par référence, il sert également de paramètre de sortie de la méthode.
     * @return [boolean] 'true', ajout effectué | 'false' probléme -> getErreur retourne le message d'erreur
     */
    public function insertScore($enreg, &$identifiant) {
        
        // format param $enreg -- (['nom'=>'...', 'dureems'=>..., 'timeuniq'=>...])
        try
        {
            if ($this->_connexion) {
                // Fermeutre d'une éventuelle précédente Requete
                if ($this->_requete) {$this->_requete->close();};
                // Texte de la Requete
                $sql = 'INSERT INTO scores (nom,dureems,timeuniq,createat) VALUES (?,?,?,?)';
                // Préparer la Requete
                $ok = (bool) ($this->_requete = $this->_connexion->prepare($sql));
                // Liéer les Paramètres de la Requete avec la source ($enreg)
                if ($ok) {
                    $ok =   $this->_requete->bindParam(1,$enreg['nom'])
                            && $this->_requete->bindParam(2,$enreg['dureems'])
                            && $this->_requete->bindParam(3,$enreg['timeuniq'])
                            && $this->_requete->bindParam(4, date('d/m/Y'));    // Affectation directe, Jour sur 2 chiffres / Mois sur 2 chiffres / Année sur 4 chiffres
                }
                // Exécuter la requête
                if ($ok) {
                    $ok = (bool) $this->_requete->execute();
                }
                if (!$ok) {
                    // Erreur d'exécution
                    $this->_erreur = "EProg - ".$this->_connexion->lastErrorMsg();
                } else {
                    // Requête effectuée, récupération de l'identifiant automatique
                    $identifiant = $this->_connexion->lastInsertRowId();
                }
            } else {
                // La connexion n'est pas établie - Erreur
                $this->_erreur = "EProg - Ajout Score impossible ! Connexion non établie";
                $ok = false;
            }
        } catch (Exception $e) {
            $this->_erreur = "Exception - ".$e->getMessage();
            $ok = false;
        } catch (Error $e) {
            $this->_erreur = "Erreur - ".$e->getMessage();
            $ok = false;
        }
        return($ok);
    }
 }