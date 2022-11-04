<a href="https://github.com/DegrangeM/EduNuageUSB/releases/latest">![Télécharger](https://user-images.githubusercontent.com/53106394/196756439-2fe9eded-d7a3-4e40-a088-789b017d955b.svg)</a>

_Lisez attentivement les instructions avant d'exécuter le logiciel._

# EduNuageUSB

EduNuageUSB est un logiciel permettant aux enseignants de facilement sauvegarder le contenu de leur clef USB et qui utilise le [cloud de l'Éducation Nationale](https://nuage.apps.education.fr/) (offrant 100 Go de stockage).

<img src="https://user-images.githubusercontent.com/53106394/196740520-04b3c2bc-b0c8-4d9b-86c6-b685b6f72da2.png" height="150px" />

## Fonctionnement

### Téléchargement

Cliquez <a href="https://github.com/DegrangeM/EduNuageUSB/releases/latest">ici</a> pour télécharger le logiciel. Décompressez le à la racine de votre clef USB.

Vous devriez alors avoir quelque chose de ce genre :

![image](https://user-images.githubusercontent.com/53106394/196743445-862ebbfb-217e-4339-b78f-92d49b6a2ba4.png)

### Première configuration

Ouvrez le dossier du logiciel et exécutez le fichier `EduNuageUSB.exe`.

Cliquez ensuite sur le lien pour se connecter, et connectez vous avec votre identifiants académiques habituels.

Veuillez noter que l'application n'enregistre pas vos identifiants académiques. En revanche, elle génère un mot de passe spécial aléatoire lui permettant d'accéder directement à vos fichiers sur le cloud de l'Éducation Nationale. Ce mot de passe ne permet pas d'accéder aux autres applications académiques et reste stocké sur votre clef USB (il n'est pas communiqué à un tier). Attention cependant, toute personne ayant en possession votre clef USB aura en théorie accès à tous vos documents sur votre cloud.

### Sauvegarde

Cliquez sur le bouton `Sauvegarder` pour sauvegarder le contenu de votre clef USB. Vous verrez alors défiller pleins d'informations (en sauvegarde) vous indiquant la progression de la sauvegarde (astuce : la durée à droite de ETA indique le temps restant estimé). Attendez jusqu'à ce que le message vous indiquant que la clef USB a bien été sauvegardé avant de fermer la fenêtre (si la sauvegarde a été très rapide, pensez à regarder si il n'y a pas eu de message d'erreur en anglais).

<img src="https://user-images.githubusercontent.com/53106394/196750169-ed8eedeb-c85a-4edb-bed7-14042b054627.png" height="250px" align="right" />

Veuillez noter que ce sera le dossier parent au dossier du logiciel qui sera sauvegardé (c'est à dire le dossier dans lequel se trouve le dossier du logiciel). Si vous avez mis le dossier à la racine de votre clef USB, ce sera toute votre clef USB qui sera sauvegardé, mais si vous avez mis le dossier du logiciel dans un dossier `Cours` par exemple, alors ce sera votre dossier `Cours` qui sera sauvegarder.

Veuillez noter que vos documents seront stockés sur le cloud national de l'Éducation Nationale dans un dossier `EduNuageUSB`. Attention, après la sauvegarde le contenu du dossier `EduNuageUSB` présent sur le cloud de l'EN sera entièrement remplacé par le contenu de votre clef USB. Si par exemple vous sauvegardez une première fois votre clef USB, que vous effacez ensuite par erreur un fichier important de votre clef USB, et que vous sauvegardez à nouveau votre clef USB, alors le fichier effacé par erreur sera perdu.

A noter que le logiciel travail de manière intelligente et ne re-télécharge pas à nouveau les fichiers qui n'ont pas été modifiés. La première sauvegarde prendra donc un peu de temps mais les suivantes devraient être très rapides.

### Restauration

Cliquez sur le bouton `Restaurer` pour restaurer le contenu de votre clef USB.

<img src="https://user-images.githubusercontent.com/53106394/196750715-7e2d42db-764c-4aa3-9c14-f2c8cb4ed67a.png" height="250px" align="right" />


Cette procédure est partiellement non destructive : le contenu sauvegardé viendra s'ajouter au contenu de votre clef USB sans effacer le contenu présent (sauf en cas de doublon, dans ce cas-là le contenu sera remplacé). Ainsi si vous avez effacé par erreur un fichier de votre clef USB, vous pouvez appuyer sur le bouton Restaurer pour le récupérer. Même si vous avez depuis votre dernière sauvegarde créée d'autres fichiers sur votre clef USB, ceux-ci ne seront pas supprimés. Attention cependant, si vous avez modifié un fichier, dans ce cas-là c'est l'ancienne version du fichier (au moment de votre dernière sauvegarde) qui sera récupérée. Si vous avez modifié des fichiers depuis votre dernière sauvegarde, il est conseillé de se connecter directement via l'interface web du cloud de l'éducation nationale pour récupérer les fichiers supprimés par erreur.

### Accéder à ses fichiers depuis le web

Les fichiers sont stockés sur le cloud de l'Éducation Nationale. Vous pouvez accéder à tout moment à vos fichiers sauvegarder via l'adresse habituelle : https://nuage.apps.education.fr/

Pratique si vous avez oublié votre clef usb !

Vous pouvez aussi, une fois connecté à EduNuageUSB, cliquer sur votre nom afin d'ouvrir directement la version web du cloud de l'Éducation Nationale (avec le dossier contenant vos fichiers sauvegardés d'ouvert) sur votre navigateur habituels. Il faudra en revanche vous reconnecter.

### Se déconnecter

Vous pouvez cliquer sur le lien pour se déconnecter si vous le souhaitez. A noter que cela n'effacera pas les fichiers déjà sauvegardé. Il n'est pas utile (c'est même déconseillé) de se déconnecter après chaque utilisation du logiciel. Si vous souhaitez en savoir plus sur la sécurité, vous pouvez cliquer <a href="https://github.com/DegrangeM/EduNuageUSB/wiki/S%C3%A9curit%C3%A9">ici</a>.

### Remarques

- Les opérations de sauvegardes et de restaurations sont en réalité réalisées par le logiciel `rclone`. EduNuageUSB se contente de simplifier l'usage de ce logiciel rclone (qui s'utilise en ligne de commande) et de faciliter la connexion académique.

- Avant toute première utilisation, il est conseillé d'effectuer une sauvegarde de ses fichiers (sur le cloud et sur sa clef USB) ailleurs en cas de mauvaise manipulation ou de dysfonctionnement du logiciel (normalement tout devrait fonctionner mais je ne suis pas responsable de toute perte de documents).

- Si vous ne souhaitez pas sauvegarder un dossier, vous pouvez créer un fichier ` nepassauvegarder.txt` dans ce dossier (le contenu du fichier peut être vide). Ce dossier ne sera alors pas sauvegardé.

### Comparaison avec le client de synchronisation classique de Nextcloud

Pour synchroniser des fichiers sur votre ordinateurs en temps réel, vous pouvez utiliser le client de synchronisation Nextcloud ([tutoriel](https://forum.eole.education/t/tuto-mettre-en-place-la-synchronisation-entre-nextcloud-et-son-ordinateur/69)). Ce client officiel de synchronisation Nextcloud qui s'installe sur votre ordinateur a l'avantage de synchroniser en temps réels vos fichiers. En revanche, ce logiciel ne fonctionne pas bien avec les clefs USB : il faut l'installer sur chaque ordinateur sur lequel vous souhaitez utiliser votre clef et peut ne plus fonctionner en cas de changement de lettre de votre clef USB (ex : `F:\`, `G:\`, etc.). EduNuageUSB n'a pas ce problème, et permet en plus d'éviter d'avoir en permnance le logiciel de synchronisation qui tourne sur votre ordinateur. De plus, EduNuageUSB est très simple à configurer. De plus, dans le cadre de sauvegardes, il peut être justement problématique que la synchrisation se fasse en temps réel afin de ne pas synchroniser la suppression d'un fichier (même si, heureusement, NextCloud dispose d'une corbeille).

|                               | Application Nextcloud | EduNuageUSB |
|-------------------------------|:---------------------:|:-----------:|
| Facile à configurer           |          Non          |     Oui     |
| Facile à utiliser             |          Oui          |     Oui     |
| Synchronisation en temps réel |          Oui          |     Non     |
| Fonctionne avec les clefs USB |     Partiellement     |     Oui     |
