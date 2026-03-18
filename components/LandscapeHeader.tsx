import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTimeAndSeason } from '../hooks/useTimeAndSeason';
import { LANDSCAPES } from '../constants/landscapes';
import TerrainSVG from './landscape/TerrainSVG';
import SeasonParticles from './landscape/SeasonParticles';

// Hauteur fixe du header en pixels
export const LANDSCAPE_HEADER_HEIGHT = 220;

/**
 * LandscapeHeader — l'élément signature de l'app.
 *
 * Compose trois couches empilées :
 *   1. LinearGradient   → dégradé de ciel (couleurs selon heure + saison)
 *   2. TerrainSVG       → terrain, arbres, soleil/lune, étoiles en SVG
 *   3. SeasonParticles  → flocons / pétales / feuilles animés (Reanimated)
 *
 * Le hook useTimeAndSeason fournit le landscapeKey qui sélectionne
 * automatiquement la bonne configuration parmi les 28 disponibles.
 */
export default function LandscapeHeader() {
  const { width } = useWindowDimensions();
  const { landscapeKey, season } = useTimeAndSeason();

  // Récupération de la config du paysage actif (fallback sur morning_spring)
  const config = LANDSCAPES[landscapeKey] ?? LANDSCAPES['morning_spring'];

  return (
    <View style={[styles.container, { width }]}>
      {/* Couche 1 : dégradé de ciel */}
      <LinearGradient
        colors={config.skyGradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Couche 2 : terrain SVG (collines, arbres, corps céleste) */}
      <TerrainSVG
        width={width}
        height={LANDSCAPE_HEADER_HEIGHT}
        config={config}
        season={season}
      />

      {/* Couche 3 : particules animées selon la saison */}
      <SeasonParticles
        season={season}
        width={width}
        height={LANDSCAPE_HEADER_HEIGHT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: LANDSCAPE_HEADER_HEIGHT,
    overflow: 'hidden',
  },
});
