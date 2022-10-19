# EduNuageUSB

EduNuageUSB est un logiciel permettant aux enseignants de facilement sauvegarder le contenu de leur clef USB et qui utilisent le cloud nationnal de l'Éducation Nationale.

<img src="https://user-images.githubusercontent.com/53106394/196740520-04b3c2bc-b0c8-4d9b-86c6-b685b6f72da2.png" height="150px" />

## Fonctionnement

### Téléchargement

Cliquez ICI pour télécharger le logiciel. Décompressez le à la racine de votre clef USB.

Vous devriez alors avoir quelque chose de ce genre :

![image](https://user-images.githubusercontent.com/53106394/196743445-862ebbfb-217e-4339-b78f-92d49b6a2ba4.png)

### Première configuration

Ouvrez le dossier du logiciel et exécutez le fichier `EduNuageUSB.exe`.

Cliquez ensuite sur le lien pour se connecter, et connectez vous avec votre identifiants académiques habituels.

Veuillez noter que l'application n'enregistre pas vos identifiants académiques. En revanche, elle génère une mot de passe spécial aléatoire lui permettant d'accéder directement à vos fichier sur le cloud de l'Éducation Nationale. Ce mot de passe ne permet pas d'accéder aux autres applications académiques et reste stocké sur votre clef USB (il n'est pas communiqué à un tier). Attention cependant, toute personne ayant en possession votre clef USB aura en théorie accès à tous vos documents sur votre cloud.

### Sauvegarde

Cliquez sur le bouton `Sauvegarder` pour sauvegarder le contenu de votre clef USB. Vous verrez alors défiller pleins d'informations (en sauvegarde) vous indiquant la progression de la sauvegarde (astuce : la durée à droite de ETA indique le temps restant estimé). Attendez jusqu'à ce que le message vous indiquant que la clef USB a bien été sauvegardé avant de fermer la fenêtre.

<img src="https://user-images.githubusercontent.com/53106394/196750169-ed8eedeb-c85a-4edb-bed7-14042b054627.png" height="250px" align="right" />

Veuillez noter que ce sera le dossier parent au dossier du logiciel qui sera sauvegardé (c'est à dire le dossier dans lequel se trouve le dossier du logiciel). Si vous avez mis le dossier à la racine de votre clef USB, ce sera toute votre clef USB qui sera sauvegardé, mais si vous avez mis le dossier du logiciel dans un dossier `Cours` par exemple, alors ce sera votre dossier `Cours` qui sera sauvegarder.

Veuillez noter que vos documents seront stocké sur le cloud nationnal de l'Éducation Nationnale dans un dossier `EduNuageUSB`. Attention, après la sauvegarde le contenu du dossier `EduNuageUSB` présent sur le cloud de l'EN sera entièrement remplacé par le contenu de votre clef USB. Si par exemple vous sauvegardez une première fois votre clef USB, que vous effacé ensuite par erreur un fichier important de votre clef USB, et que vous sauvegardez à nouveau votre clef USB, alors le fichier effacé par erreur sera perdu.

A noter que le logiciel travail de manière intélligente et ne re-télécharge pas à nouveau les fichiers qui n'ont pas été modifiés. La première sauvegarde prendra donc un peu de temps mais les suivantes devraient être très rapides.

### Restauration

Cliquez sur le bouton `Restaurer` pour restaurer le contenu de votre clef USB.

<img src="https://user-images.githubusercontent.com/53106394/196750715-7e2d42db-764c-4aa3-9c14-f2c8cb4ed67a.png" height="250px" align="right" />


Cette procédure est partiellement non destructive : le contenu sauvegardé viendra s'ajouter au contenu de votre clef USB sans effacer le contenu présent (sauf en cas de doublon, dans ce cas là le contenu sera remplacé). Ainsi si vous avez effacé par erreur un fichier de votre clef USB, vous pouvez appuyer sur le bouton Restaurer poru le récupérer. Même si vous avez depuis votre dernière sauvegarde créé d'autres fichiers sur votre clef USB, ceux-ci ne seront pas supprimés. Attention cependant, si vous avez modifié un fichier, dans ce cas là c'est l'ancienne version du fichier (au moment de votre dernière sauvegarde) qui sera récupérée. Si vous avez modifié des fichiers depuis votre dernière sauvegarde, il est conseillé de se connecter directement via l'interface web du cloud de l'éducation nationnale pour récupérer les fichiers supprimés par erreur.

### Accéder à ses fichiers depuis le web

Les fichiers sont stockés sur le cloud de l'Éducation Nationale. Vous pouvez accéder à tout moment à vos fichiers sauvegarder via l'adresse habituelle : https://nuage.apps.education.fr/

Pratique si vous avez oublié votre clef usb !

### Se déconnecter

Vous pouvez cliquer sur le lien pour se déconnecter si vous le souhaitez. A noter que cela n'effacera pas les fichiers déjà sauvegardé. Il n'est pas utile (c'est même déconseillé) de se déconnecter après chaque utilisation du logiciel.

### Remarques

Les opérations de sauvegardes et de restaurations sont en réalité réalisées par le logiciel `rclone`. EduNuageUSB se contente de simplifier l'usage de ce logiciel rclone (qui s'utilise en ligne de commande) et de faciliter la connexion académique.
