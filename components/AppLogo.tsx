import Svg, { Circle, Polyline } from 'react-native-svg';
import { COLORS } from '../constants/app';

interface AppLogoProps {
  size?: number;
  bgColor?: string;    // couleur de fond du cercle
  checkColor?: string; // couleur du checkmark
}

/**
 * Logo de l'application — cercle avec un checkmark.
 * Réutilisable dans le hero du dashboard, les écrans auth, etc.
 */
export default function AppLogo({
  size = 40,
  bgColor = COLORS.primary,
  checkColor = '#FFFFFF',
}: AppLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Circle cx="32" cy="32" r="30" fill={bgColor} />
      <Polyline
        points="20,33 28,42 44,23"
        stroke={checkColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
