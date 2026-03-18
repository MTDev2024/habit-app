import { TimeSlot, Season } from '../hooks/useTimeAndSeason';

// Configuration d'un paysage (1 combinaison heure × saison)
export interface LandscapeConfig {
  // Couleurs du dégradé de ciel : 3 stops du haut vers le bas
  skyGradient: [string, string, string];
  // Couleur de la couche de collines en arrière-plan
  terrainBackColor: string;
  // Couleur du terrain principal (avant-plan)
  terrainFrontColor: string;
  // Corps céleste à afficher
  skyBody: 'sun' | 'moon' | 'none';
  // Position verticale du corps céleste — 0 (haut du ciel) → 1 (horizon)
  skyBodyY: number;
  // Couleur du soleil ou de la lune
  skyBodyColor: string;
  // Couleur du halo lumineux autour du corps céleste (avec transparence)
  skyBodyGlow: string;
  // Afficher les étoiles (scènes nocturnes uniquement)
  starsVisible: boolean;
  // Description lisible pour le debug et l'accessibilité
  description: string;
}

// Type clé = combinaison ex: "morning_winter"
export type LandscapeKey = `${TimeSlot}_${Season}`;

// Table des 28 paysages (7 créneaux × 4 saisons)
export const LANDSCAPES: Record<LandscapeKey, LandscapeConfig> = {

  // ── NUIT (00h–05h) ─────────────────────────────────────────────────────────
  night_winter: {
    skyGradient: ['#050810', '#0a1020', '#121830'],
    terrainBackColor: '#1a2540', terrainFrontColor: '#c8d8e8',
    skyBody: 'moon', skyBodyY: 0.2, skyBodyColor: '#e8eef5', skyBodyGlow: '#a0b0c035',
    starsVisible: true, description: 'Nuit glacée, étoiles, neige au sol',
  },
  night_spring: {
    skyGradient: ['#080820', '#10103a', '#1a1a50'],
    terrainBackColor: '#182818', terrainFrontColor: '#283828',
    skyBody: 'moon', skyBodyY: 0.25, skyBodyColor: '#f0f4e8', skyBodyGlow: '#f0f4e822',
    starsVisible: true, description: 'Nuit douce, étoiles, bourgeons',
  },
  night_summer: {
    skyGradient: ['#060810', '#0c1228', '#181838'],
    terrainBackColor: '#0d2010', terrainFrontColor: '#152e18',
    skyBody: 'moon', skyBodyY: 0.3, skyBodyColor: '#fffff0', skyBodyGlow: '#fffff020',
    starsVisible: true, description: 'Nuit tiède, ciel étoilé',
  },
  night_autumn: {
    skyGradient: ['#080808', '#101010', '#181518'],
    terrainBackColor: '#1a1210', terrainFrontColor: '#201810',
    skyBody: 'moon', skyBodyY: 0.35, skyBodyColor: '#e0d8c0', skyBodyGlow: '#e0d8c018',
    starsVisible: true, description: 'Nuit brumeuse, feuilles mortes',
  },

  // ── AUBE (05h–08h) ──────────────────────────────────────────────────────────
  dawn_winter: {
    skyGradient: ['#5a7890', '#a8c4d8', '#d8eaf5'],
    terrainBackColor: '#708090', terrainFrontColor: '#daeaf5',
    skyBody: 'sun', skyBodyY: 0.75, skyBodyColor: '#ffd0a0', skyBodyGlow: '#ffd0a045',
    starsVisible: false, description: 'Lever pâle, brume froide, givre',
  },
  dawn_spring: {
    skyGradient: ['#e04870', '#f88060', '#ffd0b0'],
    terrainBackColor: '#3a6a30', terrainFrontColor: '#5a8a50',
    skyBody: 'sun', skyBodyY: 0.75, skyBodyColor: '#ffee80', skyBodyGlow: '#ffee8055',
    starsVisible: false, description: 'Lever rose pêche, rosée, brume légère',
  },
  dawn_summer: {
    skyGradient: ['#cc5500', '#f08820', '#ffc040'],
    terrainBackColor: '#1a4020', terrainFrontColor: '#2a6030',
    skyBody: 'sun', skyBodyY: 0.72, skyBodyColor: '#fff060', skyBodyGlow: '#fff06060',
    starsVisible: false, description: 'Lever doré vif, chaleur naissante',
  },
  dawn_autumn: {
    skyGradient: ['#aa3800', '#d06018', '#f09040'],
    terrainBackColor: '#5a3020', terrainFrontColor: '#7a4830',
    skyBody: 'sun', skyBodyY: 0.75, skyBodyColor: '#ffd060', skyBodyGlow: '#ffd06055',
    starsVisible: false, description: 'Lever orange brûlé, brume automnale',
  },

  // ── MATIN (08h–12h) ─────────────────────────────────────────────────────────
  morning_winter: {
    skyGradient: ['#a0b8cc', '#c8d8e8', '#e8f0f8'],
    terrainBackColor: '#708090', terrainFrontColor: '#dce8f2',
    skyBody: 'sun', skyBodyY: 0.48, skyBodyColor: '#fff0c0', skyBodyGlow: '#fff0c038',
    starsVisible: false, description: 'Matin froid, ciel blanc, neige',
  },
  morning_spring: {
    skyGradient: ['#1880c8', '#40a8e8', '#90d0ff'],
    terrainBackColor: '#3a7030', terrainFrontColor: '#5a9850',
    skyBody: 'sun', skyBodyY: 0.32, skyBodyColor: '#ffe050', skyBodyGlow: '#ffe05050',
    starsVisible: false, description: 'Matin frais, ciel bleu, fleurs',
  },
  morning_summer: {
    skyGradient: ['#0060b0', '#1088d8', '#40b0f8'],
    terrainBackColor: '#1a5020', terrainFrontColor: '#2a7030',
    skyBody: 'sun', skyBodyY: 0.28, skyBodyColor: '#fff040', skyBodyGlow: '#fff04060',
    starsVisible: false, description: 'Matin chaud, ciel azur, vibrant',
  },
  morning_autumn: {
    skyGradient: ['#c09008', '#e0b020', '#f8d840'],
    terrainBackColor: '#7a4020', terrainFrontColor: '#a06030',
    skyBody: 'sun', skyBodyY: 0.38, skyBodyColor: '#ffe880', skyBodyGlow: '#ffe88050',
    starsVisible: false, description: 'Matin doré, feuilles orangées',
  },

  // ── MIDI (12h–15h) ──────────────────────────────────────────────────────────
  noon_winter: {
    skyGradient: ['#5878a0', '#7898b8', '#9ab8cc'],
    terrainBackColor: '#506070', terrainFrontColor: '#c0d5e5',
    skyBody: 'sun', skyBodyY: 0.1, skyBodyColor: '#f0e8d0', skyBodyGlow: '#f0e8d030',
    starsVisible: false, description: 'Midi hivernal, soleil bas, bleu froid',
  },
  noon_spring: {
    skyGradient: ['#30a040', '#60c060', '#98e080'],
    terrainBackColor: '#286028', terrainFrontColor: '#489045',
    skyBody: 'sun', skyBodyY: 0.08, skyBodyColor: '#ffe840', skyBodyGlow: '#ffe84060',
    starsVisible: false, description: 'Midi printanier, vert tendre, lumineux',
  },
  noon_summer: {
    skyGradient: ['#0058b0', '#0080d0', '#10a0f0'],
    terrainBackColor: '#104818', terrainFrontColor: '#186025',
    skyBody: 'sun', skyBodyY: 0.05, skyBodyColor: '#fff030', skyBodyGlow: '#fff03070',
    starsVisible: false, description: 'Midi estival, bleu intense, soleil haut',
  },
  noon_autumn: {
    skyGradient: ['#c05808', '#de7818', '#f8a030'],
    terrainBackColor: '#682e18', terrainFrontColor: '#985028',
    skyBody: 'sun', skyBodyY: 0.15, skyBodyColor: '#ffe060', skyBodyGlow: '#ffe06050',
    starsVisible: false, description: 'Midi automnal, lumière rasante, ocre',
  },

  // ── APRÈS-MIDI (15h–18h) ────────────────────────────────────────────────────
  afternoon_winter: {
    skyGradient: ['#485868', '#607888', '#7890a0'],
    terrainBackColor: '#485560', terrainFrontColor: '#b0c8d5',
    skyBody: 'sun', skyBodyY: 0.55, skyBodyColor: '#f0d8a0', skyBodyGlow: '#f0d8a030',
    starsVisible: false, description: 'Après-midi court, soleil déclinant',
  },
  afternoon_spring: {
    skyGradient: ['#58b058', '#80c870', '#b0e098'],
    terrainBackColor: '#286028', terrainFrontColor: '#489048',
    skyBody: 'sun', skyBodyY: 0.38, skyBodyColor: '#ffe848', skyBodyGlow: '#ffe84850',
    starsVisible: false, description: 'Après-midi doux, lumière verte',
  },
  afternoon_summer: {
    skyGradient: ['#0048a0', '#0060c0', '#1080e0'],
    terrainBackColor: '#0e3818', terrainFrontColor: '#165020',
    skyBody: 'sun', skyBodyY: 0.33, skyBodyColor: '#ffe030', skyBodyGlow: '#ffe03060',
    starsVisible: false, description: 'Après-midi chaud, ciel profond',
  },
  afternoon_autumn: {
    skyGradient: ['#b04808', '#d07018', '#e89038'],
    terrainBackColor: '#5a3818', terrainFrontColor: '#885030',
    skyBody: 'sun', skyBodyY: 0.5, skyBodyColor: '#ffd060', skyBodyGlow: '#ffd06050',
    starsVisible: false, description: 'Après-midi doré, feuilles qui tombent',
  },

  // ── SOIRÉE (18h–21h) ────────────────────────────────────────────────────────
  evening_winter: {
    skyGradient: ['#320048', '#5a0860', '#881870'],
    terrainBackColor: '#180028', terrainFrontColor: '#0e0018',
    skyBody: 'sun', skyBodyY: 0.78, skyBodyColor: '#ff8060', skyBodyGlow: '#ff806060',
    starsVisible: false, description: 'Coucher tôt, rouge-violet, silhouettes noires',
  },
  evening_spring: {
    skyGradient: ['#8838b8', '#b858a0', '#e888b8'],
    terrainBackColor: '#182808', terrainFrontColor: '#0e1e06',
    skyBody: 'sun', skyBodyY: 0.75, skyBodyColor: '#ffa070', skyBodyGlow: '#ffa07060',
    starsVisible: false, description: 'Coucher rose-violet, fleurs en silhouette',
  },
  evening_summer: {
    skyGradient: ['#d03800', '#e86010', '#f89030'],
    terrainBackColor: '#081508', terrainFrontColor: '#060e04',
    skyBody: 'sun', skyBodyY: 0.73, skyBodyColor: '#ffb060', skyBodyGlow: '#ffb06070',
    starsVisible: false, description: 'Coucher flamboyant, orange-rose long',
  },
  evening_autumn: {
    skyGradient: ['#581808', '#802818', '#a84830'],
    terrainBackColor: '#200a05', terrainFrontColor: '#150806',
    skyBody: 'sun', skyBodyY: 0.76, skyBodyColor: '#ff9050', skyBodyGlow: '#ff905060',
    starsVisible: false, description: 'Coucher brun-rouge, arbres dénudés',
  },

  // ── FIN DE SOIRÉE (21h–00h) ─────────────────────────────────────────────────
  lateEvening_winter: {
    skyGradient: ['#040710', '#080c18', '#0d1222'],
    terrainBackColor: '#0e1628', terrainFrontColor: '#b0c8d8',
    skyBody: 'moon', skyBodyY: 0.15, skyBodyColor: '#d0dce8', skyBodyGlow: '#d0dce828',
    starsVisible: true, description: 'Soirée noire, lune froide, neige bleue',
  },
  lateEvening_spring: {
    skyGradient: ['#180638', '#280e50', '#381868'],
    terrainBackColor: '#0e1608', terrainFrontColor: '#162510',
    skyBody: 'moon', skyBodyY: 0.2, skyBodyColor: '#f0f0e0', skyBodyGlow: '#f0f0e025',
    starsVisible: true, description: 'Soirée mauve, lune claire, tiède',
  },
  lateEvening_summer: {
    skyGradient: ['#0e051e', '#180838', '#240e50'],
    terrainBackColor: '#060e05', terrainFrontColor: '#0c1808',
    skyBody: 'moon', skyBodyY: 0.25, skyBodyColor: '#fffff0', skyBodyGlow: '#fffff020',
    starsVisible: true, description: 'Soirée estivale, violet chaud',
  },
  lateEvening_autumn: {
    skyGradient: ['#060606', '#0c0a0e', '#100e16'],
    terrainBackColor: '#0e0a08', terrainFrontColor: '#160e0c',
    skyBody: 'moon', skyBodyY: 0.3, skyBodyColor: '#d8d0b8', skyBodyGlow: '#d8d0b818',
    starsVisible: true, description: 'Soirée sombre, brouillard, feuilles',
  },
};
