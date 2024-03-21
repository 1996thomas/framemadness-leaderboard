import os
import json

# Chemin vers le dossier contenant vos fichiers JSON
dossier = '../public/dossier sans titre'

# Liste pour stocker les données de tous les fichiers
donnees_fusionnees = []

# Parcourir tous les fichiers du dossier spécifié
for fichier in os.listdir(dossier):
    # Construire le chemin complet du fichier
    chemin_complet = os.path.join(dossier, fichier)
    
    # Vérifier si le fichier courant est un fichier JSON
    if os.path.isfile(chemin_complet) and fichier.endswith('.json'):
        # Ouvrir et lire le fichier JSON
        with open(chemin_complet, 'r', encoding='utf-8') as f:
            donnees = json.load(f)
            # Ajouter les données du fichier à notre liste fusionnée
            donnees_fusionnees.append(donnees)

# Chemin du fichier JSON de sortie
fichier_sortie = './donnees_fusionnees.json'

# Écrire les données fusionnées dans un nouveau fichier JSON
with open(fichier_sortie, 'w', encoding='utf-8') as f:
    json.dump(donnees_fusionnees, f, ensure_ascii=False, indent=4)

print(f"Les données ont été fusionnées dans {fichier_sortie}")
