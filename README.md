# MusicApp

### Installer le site sur debian

- Pour installer le site, il faut d'abord installer certains paquets :
    `$ sudo apt-get install apache2 mariadb-server php php-mysql python3 python3-pip`
- Il faut ensuite lancer mariaDB et apache2:
    `$ sudo service apache2 start`
    `$ sudo service mariadb start`

- Une fois la base de donnée et le service web lancé, il faut configurer mariaDB:
    - Rentrer dans mariaDB avec la commande suivante:
        `$ sudo mariadb -u root`
    - Créer un nouvel utilisateur:
    `MariaDB [(none)]> CREATE USER 'isen'@'localhost' IDENTIFIED BY 'isen29';`
    
    `MariaDB [(none)]> create database music DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;`

    `MariaDB [(none)]> GRANT ALL PRIVILEGES ON music.* TO 'isen'@'localhost'  WITH GRANT OPTION;`
    
    `MariaDB [(none)]> exit`
    - Se placer dans le terminal à la racine du projet puis executer la commandes suivantes pour créer la structure de la base de donnée:
    `$ mariadb -u isen -p music < bdd.sql`
    - Avant de lancer le script python, il faut installer des dépendances:
    `$ python3 -m pip install datetime mariadb mutagen`
    - Si le module mariadb ne s'installe pas essayé la commande suivante:
    `$ sudo apt install libmariadb3 libmariadb-dev`
    - Puis lancer le script python gestionBdd.py, afin de remplir la base de donnée:
    `./gestionBdd.py`
- Il faut désormais configure apache2:
    - Exécuter les commandes suivante en remplaçant NOM_DOMAINE_SERVER par le nom de domaine du server et CHEMIN_RACINE_ARCHIVE par le résultat de la commande 'pwd' lorsque l'on de place dans la racine de l'archive :
    `$ sudo -i`

         ```
        $ echo '<VirtualHost *:80>
            ServerName NOM_DOMAINE_SERVER
            DocumentRoot CHEMIN_RACINE_ARCHIVE/site
            <Directory "CHEMIN_RACINE_ARCHIVE/site">
                    Options -Indexes
            </Directory>
        </VirtualHost>' > /etc/apache2/sites-enabled/projetCIR2.conf
        ```
        
        `$ sudo a2ensite projetCIR2.conf`
        
        `$ sudo service apache2 reload`

### Version des logiciels utillisés:

- Apache2: Apache/2.4.57
- mariaDB: Ver 15.1 Distrib 10.11.3-MariaDB
- Python: Python 3.11.2
- Modules python:
    - mariadb==1.1.6
    - mutagen==1.46.0
    - parsedatetime==2.6
- Php: PHP 7.4.33

### Arborescence de l'archive

```
.
├── bdd.sql
├── gestionBdd.py
├── README.md
├── schemaBDD.mcd
└── site
    ├── assets
    │   ├── bootstrap-5.3.0-dist
    │   │   ├── css
    │   │   │   ├── bootstrap.css
    │   │   │   ├── ...
    │   │   │   └── bootstrap-utilities.rtl.min.css.map
    │   │   └── js
    │   │       ├── bootstrap.bundle.js
    │   │       ├── ...
    │   │       └── bootstrap.min.js.map
    │   ├── css
    │   │   ├── bootstrap.min.css
    │   │   └── style.css
    │   ├── img
    │   │   ├── album.jpeg
    │   │   ├── detail-icon.png
    │   │   ├── dot.svg
    │   │   ├── heart-icon.png
    │   │   ├── home-icon.png
    │   │   ├── profil-icon.png
    │   │   └── search-icon.png
    │   ├── js
    │   │   ├── account.js
    │   │   ├── ajax.js
    │   │   ├── album.js
    │   │   ├── artist.js
    │   │   ├── authentification.js
    │   │   ├── bootstrap.min.js
    │   │   ├── createAccount.js
    │   │   ├── home.js
    │   │   ├── playlist.js
    │   │   └── track.js
    │   └── ressources
    │       ├── album_img
    │       │   ├── album.jpeg
    │       │   ├── bleach.jpeg
    │       │   ├── mon-coeur-avait-raison.jpeg
    │       │   ├── nevermind.jpeg
    │       │   └── paradise.jpeg
    │       ├── artist_img
    │       │   ├── artist.jpeg
    │       │   ├── gims.jpeg
    │       │   ├── lana-del-rey.jpeg
    │       │   └── nirvana.jpeg
    │       └── musique
    │           ├── american.mp3
    │           ├── bella.mp3
    │           ├── critical.mp3
    │           ├── school.mp3
    │           └── trm.mp3
    ├── index.html
    └── php
        ├── constants.php
        ├── mydatabase.php
        └── request.php
```
