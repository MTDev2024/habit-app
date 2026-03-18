import React from 'react';
import Svg, { Path, Circle, Ellipse, Rect, Line, G } from 'react-native-svg';
import { Season } from '../../hooks/useTimeAndSeason';
import { LandscapeConfig } from '../../constants/landscapes';

interface TerrainSVGProps {
  width: number;
  height: number;
  config: LandscapeConfig;
  season: Season;
}

// ── Chemins SVG du terrain ──────────────────────────────────────────────────
// viewBox "0 0 400 220" — les courbes cubiques créent des collines naturelles

// Couche arrière : collines lointaines (y ≈ 138–155)
const TERRAIN_BACK = 'M0,155 C70,138 140,150 200,142 C260,134 320,146 380,138 L400,140 L400,220 L0,220 Z';

// Couche avant : terrain principal (y ≈ 162–178)
const TERRAIN_FRONT = 'M0,178 C70,162 140,174 200,166 C260,158 320,170 380,162 L400,163 L400,220 L0,220 Z';

// ── Positions des arbres le long du terrain avant ──────────────────────────
// [x, baseY, échelle] — baseY ≈ hauteur du terrain à cette position x
const TREE_POSITIONS: [number, number, number][] = [
  [50,  173, 1.0],
  [95,  168, 0.82],
  [160, 172, 1.08],
  [230, 164, 0.92],
  [295, 161, 1.0],
  [350, 168, 0.85],
  [388, 162, 1.05],
];

// ── Positions fixes des étoiles (aléatoires en apparence mais reproductibles) ──
const STAR_POSITIONS: [number, number, number][] = [
  [28, 14, 1.5], [72, 32, 1.0], [108, 18, 2.0], [158, 28, 1.5],
  [198, 12, 1.0], [242, 40, 1.5], [278, 22, 2.0], [318, 36, 1.0],
  [354, 14, 1.5], [388, 28, 1.0], [52, 52, 1.0], [132, 58, 1.5],
  [192, 62, 1.0], [258, 48, 2.0], [308, 66, 1.5], [372, 55, 1.0],
];

// ── Corps céleste : soleil ──────────────────────────────────────────────────
interface CelestialProps { cx: number; cy: number; config: LandscapeConfig; }

function Sun({ cx, cy, config }: CelestialProps) {
  return (
    <G>
      {/* Halo externe diffus */}
      <Circle cx={cx} cy={cy} r={36} fill={config.skyBodyGlow} />
      {/* Halo interne */}
      <Circle cx={cx} cy={cy} r={24} fill={config.skyBodyGlow} />
      {/* Corps du soleil */}
      <Circle cx={cx} cy={cy} r={16} fill={config.skyBodyColor} />
    </G>
  );
}

// ── Corps céleste : lune ────────────────────────────────────────────────────
function Moon({ cx, cy, config }: CelestialProps) {
  return (
    <G>
      {/* Halo lunaire subtil */}
      <Circle cx={cx} cy={cy} r={24} fill={config.skyBodyGlow} />
      {/* Corps de la lune */}
      <Circle cx={cx} cy={cy} r={13} fill={config.skyBodyColor} />
    </G>
  );
}

// ── Arbre nu (hiver) ────────────────────────────────────────────────────────
interface TreeProps { x: number; baseY: number; scale: number; }

function BareTree({ x, baseY, scale: s }: TreeProps) {
  const h = 32 * s;
  return (
    <G>
      {/* Tronc */}
      <Line x1={x} y1={baseY} x2={x} y2={baseY - h} stroke="#1a2030" strokeWidth={2 * s} />
      {/* Branches basses */}
      <Line x1={x} y1={baseY - h * 0.42} x2={x - 16 * s} y2={baseY - h * 0.58} stroke="#1a2030" strokeWidth={1.5 * s} />
      <Line x1={x} y1={baseY - h * 0.42} x2={x + 16 * s} y2={baseY - h * 0.58} stroke="#1a2030" strokeWidth={1.5 * s} />
      {/* Branches hautes */}
      <Line x1={x} y1={baseY - h * 0.62} x2={x - 10 * s} y2={baseY - h * 0.76} stroke="#1a2030" strokeWidth={1.2 * s} />
      <Line x1={x} y1={baseY - h * 0.62} x2={x + 10 * s} y2={baseY - h * 0.76} stroke="#1a2030" strokeWidth={1.2 * s} />
      {/* Petites branches sommitales */}
      <Line x1={x} y1={baseY - h * 0.8} x2={x - 6 * s} y2={baseY - h * 0.92} stroke="#1a2030" strokeWidth={s} />
      <Line x1={x} y1={baseY - h * 0.8} x2={x + 6 * s} y2={baseY - h * 0.92} stroke="#1a2030" strokeWidth={s} />
    </G>
  );
}

// ── Arbre feuillu (printemps / été) ─────────────────────────────────────────
interface LeafyTreeProps extends TreeProps { leafColor: string; }

function LeafyTree({ x, baseY, scale: s, leafColor }: LeafyTreeProps) {
  const trunkH = 22 * s;
  const crownR = 16 * s;
  return (
    <G>
      <Rect x={x - 2.5 * s} y={baseY - trunkH} width={5 * s} height={trunkH} fill="#5D4037" />
      <Circle cx={x} cy={baseY - trunkH - crownR * 0.7} r={crownR} fill={leafColor} />
    </G>
  );
}

// ── Arbre automnal (couronne clairsemée, couleurs chaudes) ──────────────────
function AutumnTree({ x, baseY, scale: s }: TreeProps) {
  const trunkH = 26 * s;
  const leaf = '#D4621A';
  return (
    <G>
      <Rect x={x - 2.5 * s} y={baseY - trunkH} width={5 * s} height={trunkH} fill="#4E342E" />
      {/* Couronne principale */}
      <Ellipse cx={x} cy={baseY - trunkH - 10 * s} rx={13 * s} ry={10 * s} fill={leaf} />
      {/* Touffes latérales pour un aspect clairsemé */}
      <Ellipse cx={x - 9 * s} cy={baseY - trunkH - 4 * s} rx={7 * s} ry={6 * s} fill={leaf} />
      <Ellipse cx={x + 9 * s} cy={baseY - trunkH - 4 * s} rx={7 * s} ry={6 * s} fill={leaf} />
    </G>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────
export default function TerrainSVG({ width, height, config, season }: TerrainSVGProps) {
  // Position du corps céleste dans le viewBox (400 × 220)
  // skyBodyY → 0 (très haut) à 1 (horizon) mappé sur la zone de ciel (≈ 0–170px)
  const skyBodyX = 295;
  const skyBodyY_px = config.skyBodyY * 170;

  // Couleur des feuilles selon la saison
  const leafColor = season === 'summer' ? '#1B5E20' : '#4CAF50';

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 400 220"
      // xMidYMax slice : remplit le conteneur, terrain toujours visible en bas
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Étoiles — nuits uniquement */}
      {config.starsVisible && STAR_POSITIONS.map(([sx, sy, sr]) => (
        <Circle key={`s${sx}${sy}`} cx={sx} cy={sy} r={sr} fill="#ffffff" opacity={0.75} />
      ))}

      {/* Corps céleste (rendu AVANT le terrain pour l'effet coucher de soleil) */}
      {config.skyBody === 'sun' && <Sun cx={skyBodyX} cy={skyBodyY_px} config={config} />}
      {config.skyBody === 'moon' && <Moon cx={skyBodyX} cy={skyBodyY_px} config={config} />}

      {/* Collines arrière */}
      <Path d={TERRAIN_BACK} fill={config.terrainBackColor} />

      {/* Terrain avant */}
      <Path d={TERRAIN_FRONT} fill={config.terrainFrontColor} />

      {/* Arbres — rendus SUR le terrain avant selon la saison */}
      {season === 'winter' && TREE_POSITIONS.map(([tx, ty, ts], i) => (
        <BareTree key={i} x={tx} baseY={ty} scale={ts} />
      ))}
      {(season === 'spring' || season === 'summer') && TREE_POSITIONS.map(([tx, ty, ts], i) => (
        <LeafyTree key={i} x={tx} baseY={ty} scale={ts} leafColor={leafColor} />
      ))}
      {season === 'autumn' && TREE_POSITIONS.map(([tx, ty, ts], i) => (
        <AutumnTree key={i} x={tx} baseY={ty} scale={ts} />
      ))}
    </Svg>
  );
}
