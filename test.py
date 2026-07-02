# litrage = 196
# ingredients = ['Extrait de Terre', 'Once de Terre', 'Pierre de Bois', 'Pierre de Feu', 'Extrait de Eau', 'Once de Terre', 'Once de Feu', 'Extrait de Feu', 'Essence de Bois', 'Extrait de Bois', 'Once de Terre', 'Pierre de Eau', 'Once de Eau', 'Once de Eau', 'Once de Bois']

# for ingredient in ingredients:
#     if "Terre" in ingredient or "Bois" in ingredient:
#         litrage += 0
#     elif "Feu" in ingredient:
#         litrage += 10
#     elif "Eau" in ingredient:
#         litrage += 5

# print(litrage)

cristaux = 491
recettes = [1, 1, 1, 3, 3, 2, 4, 3, 1, 1, 4, 4, 4, 1, 3, 3, 3, 2, 4, 3, 1, 3, 3, 1]
somme = 0

for cristaux in range(cristaux, cristaux - len(recettes), -1):
    for recette in recettes:
        if recette == 1:
            somme += cristaux * 2 - 50
        elif recette == 2:
            somme += cristaux + 40
        elif recette == 3:
            somme += cristaux - 10
        elif recette == 4:
            somme += cristaux * 3

print(somme)