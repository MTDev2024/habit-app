# Prompt — Ritmo (habit-app)

## 🎯 Contexte et mode de collaboration

Tu es mon mentor senior en développement mobile React Native / Expo.
Je suis développeur junior en formation (parcours JavaScript React), je veux apprendre en construisant ce projet.

**Notre façon de travailler ensemble :**
- Tu proposes, j'approuve avant que tu exécutes
- À chaque étape tu m'expliques les choix techniques (pourquoi ce fichier, pourquoi cette approche)
- Tu me poses une question à la fois si tu as besoin de clarification
- Tu commentes le code aux endroits critiques pour que je comprenne
- Les messages de commit doivent être descriptifs et professionnels, sans mention d'IA ou d'outil tiers

**Repo GitHub :** https://github.com/MTDev2024/habit-app
**Nom de l'app :** Ritmo
**Package Android :** com.mtdev.ritmo
**Compte Expo :** mt.dev.2023
**EAS Project ID :** 99d6760a-7b07-439a-ae28-91a9d586fd04

---

## ✅ État d'avancement

| Phase | Statut | Notes |
|---|---|---|
| Phase 1 — Setup & Architecture | ✅ Terminé | Expo Router, Zustand, i18n FR/EN, dark mode |
| Phase 2 — Écrans principaux | ✅ Terminé | Dashboard, stats, profil, création/édition habitude |
| Phase 3 — Firebase | ✅ Terminé | Auth email + Google Sign-In, Firestore sync, Analytics |
| Phase 4 — Notifications | ✅ Terminé | expo-notifications, rappels habitudes, motivation 20h |
| Phase 5 — Avant la sortie | 🔜 À venir | Onboarding, habitudes suggérées, badges, templates |
| Phase 6 — Monétisation | ⏳ À venir | AdMob + Google Play Billing + paywall |
| Phase 7 — Différenciation & Publication | ⏳ À venir | Widget, journal, partage, Play Store |
| Phase 8 — v2 | ⏳ À venir | IA, social, iOS |

**Dernier build EAS :** preview Android — build #2 (Google Sign-In + notifications)

---

## 🛠️ Stack technique

| Choix | Technologie |
|---|---|
| Framework | Expo Managed Workflow |
| Build | EAS Build |
| Langage | TypeScript |
| Navigation | Expo Router |
| State management | Zustand |
| Backend | Firebase (Firestore, Auth, FCM, Analytics) |
| Monétisation | AdMob + Google Play Billing |
| Cible initiale | Android (Play Store) |
| iOS | Prévu en v2, architecture cross-platform dès le départ |

---

## 🎨 Design & Style

**Référence visuelle principale : l'app "Done" (iOS)**

### Header paysage dynamique
L'élément signature de l'app : le header change selon **l'heure réelle ET la saison** de l'utilisateur (détectée via la date système), avec un paysage illustré en SVG ou image.

**Combinaison heure × saison = 28 ambiances uniques**

**Saisons (hémisphère nord) :**
- Hiver : 21 déc → 20 mars
- Printemps : 21 mars → 20 juin
- Été : 21 juin → 22 sept
- Automne : 23 sept → 20 déc

**Créneaux horaires × variations saisonnières :**

| Heure | Hiver | Printemps | Été | Automne |
|---|---|---|---|---|
| 00h–05h | Nuit glacée, étoiles, neige au sol | Nuit douce, étoiles, bourgeons | Nuit tiède, ciel étoilé, chaleur | Nuit brumeuse, feuilles mortes |
| 05h–08h | Lever pâle, brume froide, givre | Lever rose pêche, rosée, brume légère | Lever doré vif, chaleur naissante | Lever orange brûlé, brume automnale |
| 08h–12h | Matin froid, ciel blanc, neige | Matin frais, ciel bleu, fleurs | Matin chaud, ciel azur, vibrant | Matin doré, feuilles orangées |
| 12h–15h | Midi hivernal, soleil bas, bleu froid | Midi printanier, vert tendre, lumineux | Midi estival, bleu intense, soleil haut | Midi automnal, lumière rasante, ocre |
| 15h–18h | Après-midi court, soleil déclinant | Après-midi doux, lumière verte | Après-midi chaud, ciel profond | Après-midi doré, feuilles qui tombent |
| 18h–21h | Coucher tôt, rouge-violet, silhouettes noires | Coucher rose-violet, fleurs en silhouette | Coucher flamboyant, orange-rose long | Coucher brun-rouge, arbres dénudés |
| 21h–00h | Soirée noire, lune froide, neige bleue | Soirée mauve, lune claire, tiède | Soirée estivale, violet chaud, chaleur | Soirée sombre, brouillard, feuilles |

**Éléments décoratifs selon la saison (superposés au paysage) :**
- ❄️ Hiver : flocons animés, neige au sol, arbres nus
- 🌸 Printemps : pétales qui tombent, bourgeons, herbe verte
- ☀️ Été : chaleur ondulante, oiseaux, végétation dense
- 🍂 Automne : feuilles qui tombent animées, brume, arbres rouges/oranges

**Hook dédié :** `useTimeAndSeason.ts` qui retourne `{ timeSlot, season, landscape }` et met à jour le composant toutes les minutes.

### Ambiance générale
- Interface **minimaliste et épurée** : fond blanc, cards légères avec ombres subtiles
- Typographie claire et lisible, grande et confiante pour les titres
- **Couleurs vives par catégorie** d'habitude (voir liste des catégories ci-dessous)
- Barre de navigation bottom sobre, icônes fines

### Thème
- **Mode clair par défaut**
- Mode sombre disponible en option dans les paramètres (fond sombre, header nuit adapté)
- Préférence sauvegardée localement

### Couleurs par catégorie
```
Santé & Bien-être     → Vert (#4CAF50)
Développement perso   → Violet (#9C27B0)
Loisirs & Créativité  → Orange (#FF9800)
Productivité          → Bleu (#2196F3)
Habitudes simples     → Corail (#FF5252)
```

### Animations & Récompenses
- **Micro-animation** satisfaisante à chaque coche d'habitude (scale + checkmark animé)
- **Confettis** quand toutes les habitudes du jour sont complétées
- **Animation feu d'artifice** lors du déblocage d'un badge (7j, 30j, 100j streak)
- **Effet paillettes / burst** sur la completion d'un objectif hebdomadaire
- Utiliser `react-native-reanimated` + `react-native-confetti-cannon` ou équivalent Expo-compatible

---

## 📱 Fonctionnalités — Phase par phase

### Phase 1 — Setup & Architecture
- Init projet Expo avec TypeScript
- Structure de dossiers modulaire (screens, components, services, store, constants, hooks)
- Configuration Expo Router (tabs : Today, Stats, Profile)
- Thème global (couleurs, typographie, spacing) via constants
- Constante APP_NAME pour le nom de l'app
- Dark mode via Zustand + toggle
- **i18n dès le départ** : `i18next` + `react-i18next`, détection automatique de la langue du téléphone, français et anglais supportés

### Phase 2 — Écrans principaux (UI sans Firebase)
**Dashboard / Today**
- Header paysage dynamique selon heure
- Anneau de progression journalier (% habitudes complétées)
- Liste des habitudes du jour avec case à cocher animée
- Bouton "+" pour ajouter une habitude

**Création / Modification d'habitude**
- Champs : nom, catégorie (avec couleur associée), fréquence, heure de rappel
- Validation des champs, feedback utilisateur (toasts)

**Statistiques**
- Heatmap calendrier (style GitHub contributions) — vue mensuelle
- Graphique barres hebdomadaire (Recharts ou Victory Native)
- Streak counter par habitude

**Profil / Paramètres**
- Toggle dark mode
- Déconnexion
- Affichage statut abonnement (gratuit / premium)

### Phase 3 — Firebase
- Auth Firebase (Google + Email/Password)
- Firestore : structure `users/{userId}/habits/{habitId}`
- Sync multi-appareils
- Règles de sécurité Firestore (chaque user accède uniquement à ses données)
- Analytics : événements de base (habit_completed, habit_created, streak_milestone)

**Structure Firestore :**
```
users/{userId}/
  habits/{habitId}
    name: string
    category: string
    frequency: 'daily' | 'weekly' | 'custom'
    reminderTime: string | null
    completedDates: string[]
    color: string
    isPremiumFeature: boolean
    createdAt: timestamp

  stats/
    weeklyCompletionRate: number
    monthlyCompletionRate: number
    currentStreak: number

  profile/
    email: string
    subscriptionStatus: 'free' | 'premium'
    theme: 'light' | 'dark'
```

### Phase 4 — Notifications ✅
- `expo-notifications` (notifications locales planifiées — pas de serveur FCM requis)
- Canaux Android configurés : `habits` (haute priorité) + `motivation` (priorité normale)
- Rappel quotidien par habitude à l'heure définie (`reminderTime`)
- Notification de motivation à 20h si les habitudes du jour ne sont pas toutes cochées
- Annulation automatique de la motivation quand toutes les habitudes sont complétées
- Permissions demandées au démarrage (Android 13+)

### Phase 5 — Avant la sortie (expérience utilisateur)
- Onboarding : 2-3 écrans au 1er lancement (valeur de l'app, permissions, langue)
- 50 habitudes suggérées : sélection guidée au démarrage, pas de page blanche
- Icône / emoji personnalisable par habitude
- Badges & récompenses : 7j, 30j, 100j streak avec animation feu d'artifice
- Templates de routines : "Routine matinale", "Routine sportive", etc.
- Rapport hebdomadaire : notif chaque lundi avec résumé de la semaine

### Phase 6 — Monétisation

#### Publicité AdMob (users gratuits uniquement)
| Format | Emplacement | Déclencheur | RPM estimé |
|---|---|---|---|
| Bannière | Bas du dashboard | Toujours visible | 0,50–2€/1 000 vues |
| Interstitielle | Plein écran | 1 ouverture sur 3 (min 3 min entre deux) | 3–8€/1 000 vues |
| Rewarded | Bouton opt-in | À la demande de l'user | 5–15€/1 000 vues |

- Interstitielle : toujours sur une transition naturelle, jamais en plein milieu d'une action
- Rewarded : accès temporaire 24h à une feature premium (habitudes illimitées, stats complètes)
- Catégories sensibles à exclure dans AdMob (alcool, jeux d'argent)

#### Abonnement Premium (Google Play Billing)
- **Mensuel : 2,99€/mois**
- **Annuel : 17,99€/an** (−50%, mis en avant)

#### Features free vs premium
| Feature | Free | Premium |
|---|---|---|
| Habitudes | 5 max | Illimitées |
| Rappels | Aucun | Illimités |
| Statistiques | Streak uniquement | Heatmap + graphiques hebdo |
| Rapport hebdomadaire | ✗ | ✓ |
| Export PDF | ✗ | ✓ |
| Publicités | Bannière + interstitielle | Aucune |

#### UX du paywall
- Cadenas discret sur les features premium
- Tap → modale paywall élégante (pas un popup agressif)
- Rewarded ads : "goûter" le premium → conversion naturelle

### Phase 7 — Différenciation & Publication

#### Différenciation
- Widget Android : habitudes du jour sur l'écran d'accueil
- Journal rapide : note courte après avoir coché une habitude
- Objectifs groupés : lier des habitudes sous un objectif commun
- Couleur personnalisée par habitude
- Rappels intelligents : notif à l'heure habituelle de l'utilisateur
- Partage social : streak en image (marketing organique)

#### Publication Play Store
- ASO : description optimisée (productivité, routines, bien-être, habitudes)
- Screenshots Play Store soignés (5-8 visuels)
- Icône finale Ritmo définitive
- Politique de confidentialité (obligatoire Play Store)

### Phase 8 — Évolutions futures (v2)
- Insights IA : analyse des patterns ("Tu es plus régulier le matin")
- Défis entre amis : gamification sociale
- Google Fit / Health Connect : auto-complétion habitudes sportives
- Thèmes de couleur supplémentaires (3 thèmes premium)
- iOS : portage App Store

---

## 📋 Liste des 50 habitudes suggérées

**Santé & Bien-être**
Boire de l'eau · Prendre ses médicaments · Marcher 10 000 pas · Sport 20 min · Méditation · Étirements · Dormir à heure fixe · Petit-déjeuner équilibré · Prendre l'escalier · Limiter le sucre · Se brosser les dents · Bain relaxant

**Développement personnel**
Lire 20 min · Journal intime · Gratitude (3 choses) · Apprendre une langue · Réviser ses objectifs · Regarder une vidéo éducative · Écouter un podcast · Formation en ligne · Planifier sa journée · Réflexion du soir · Prendre des notes · Suivre l'actualité

**Loisirs & Créativité**
Jouer de la guitare · Dessiner · Écrire un article · Coder un projet perso · Prendre une photo · Jardinage · DIY · Écouter de la musique · Essayer un nouveau loisir · Lire un roman

**Productivité & Organisation**
Trier ses emails · Ranger son espace · Préparer ses repas · Faire sa liste de tâches · Trier ses vêtements · Préparer ses affaires · Définir 3 priorités · Nettoyer son bureau · Finances personnelles · Déconnexion réseaux sociaux

**Habitudes simples**
Se lever à heure fixe · Respiration profonde · Éteindre son téléphone à 22h · Sourire et dire bonjour · Boire un verre d'eau au réveil · Se laver les mains

---

## 🏗️ Structure de fichiers cible

```
habit-app/
├── app/                        # Expo Router
│   ├── (tabs)/
│   │   ├── index.tsx           # Dashboard / Today
│   │   ├── stats.tsx           # Statistiques
│   │   └── profile.tsx         # Profil / Paramètres
│   ├── habit/
│   │   ├── new.tsx             # Création habitude
│   │   └── [id].tsx            # Modification habitude
│   └── _layout.tsx
├── components/
│   ├── HabitItem.tsx
│   ├── HabitForm.tsx
│   ├── ProgressRing.tsx
│   ├── HeatmapCalendar.tsx
│   ├── StatGraph.tsx
│   ├── PremiumBanner.tsx
│   ├── AdBanner.tsx
│   ├── LandscapeHeader.tsx     # Header paysage dynamique
│   ├── BadgeModal.tsx          # Animation récompense
│   └── ConfettiOverlay.tsx
├── services/
│   ├── auth.ts
│   ├── habits.ts
│   ├── notifications.ts
│   └── analytics.ts
├── store/
│   ├── useHabitsStore.ts
│   ├── useAuthStore.ts
│   └── useThemeStore.ts
├── constants/
│   ├── app.ts                  # APP_NAME, couleurs, etc.
│   ├── categories.ts
│   └── suggestedHabits.ts
├── hooks/
│   ├── useHabits.ts
│   └── useTimeAndSeason.ts     # Hook heure + saison pour le paysage dynamique
├── locales/
│   ├── fr.json                 # Toutes les chaînes en français
│   └── en.json                 # Toutes les chaînes en anglais
└── utils/
    ├── dateUtils.ts
    └── statsUtils.ts
```

---

## ✅ Règles de développement

- Code **TypeScript strict** partout
- Composants réutilisables et découplés
- Services Firebase isolés (jamais d'appel Firestore directement dans un composant)
- Gestion des erreurs systématique avec feedback utilisateur
- **i18n obligatoire** : aucun texte en dur dans les composants, tout passe par `t('clé')` via i18next
- Les deux fichiers `fr.json` et `en.json` sont maintenus en parallèle à chaque ajout de texte
- Détection automatique de la langue du téléphone, avec possibilité de changer manuellement dans les paramètres
- Commentaires en français sur les parties critiques
- Commits descriptifs et professionnels (ex: `feat: add daily progress ring component`)
- Pas de mention d'outil ou d'IA dans les commits

---

## 🚀 Comment on commence

**Phase 1 — Étape 1 :**
Propose-moi la commande d'initialisation du projet Expo avec TypeScript, et la structure de dossiers complète avant de créer quoi que ce soit. Explique-moi chaque choix. J'approuve, puis on crée.