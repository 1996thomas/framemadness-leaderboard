import os
import json

dossier = '../public/final_sub'

donnees_fusionnees = []

for fichier in os.listdir(dossier):
    chemin_complet = os.path.join(dossier, fichier)
    
    if os.path.isfile(chemin_complet) and fichier.endswith('.json'):
        with open(chemin_complet, 'r', encoding='utf-8') as f:
            donnees = json.load(f)
            donnees_fusionnees.append(donnees)

fichier_sortie = './donnees_fusionnees.json'

with open(fichier_sortie, 'w', encoding='utf-8') as f:
    json.dump(donnees_fusionnees, f, ensure_ascii=False, indent=4)

print(f"Les données ont été fusionnées dans {fichier_sortie}")
