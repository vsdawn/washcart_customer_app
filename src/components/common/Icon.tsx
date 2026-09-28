import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { colors } from '../../theme/colors';

export type IconName =
  | 'shirt-outline'
  | 'sparkles-outline'
  | 'water-outline'
  | 'flame-outline'
  | 'footsteps-outline'
  | 'bed-outline'
  | 'layers-outline'
  | 'diamond-outline'
  | 'location-outline'
  | 'notifications-outline'
  | 'search-outline'
  | 'arrow-back'
  | 'chevron-forward'
  | 'chevron-down'
  | 'add'
  | 'remove'
  | 'close'
  | 'check-circle'
  | 'time-outline'
  | 'star'
  | 'star-outline'
  | 'home-outline'
  | 'receipt-outline'
  | 'pricetag-outline'
  | 'person-outline'
  | 'card-outline'
  | 'qr-code-outline'
  | 'account-balance-outline'
  | 'wallet-outline'
  | 'cash-outline'
  | 'help-circle-outline'
  | 'headset-outline'
  | 'share-social-outline'
  | 'log-out-outline'
  | 'shield-checkmark-outline'
  | 'trash-outline'
  | 'pencil-outline'
  | 'truck-outline'
  | 'calendar-outline'
  | 'iron-outline'
  | 'dry-cleaning-outline'
  | 'washer-outline'
  | 'bag-outline'
  | 'shoe-outline'
  | 'rupee-outline'
  | 'package-outline'
  | 'document-text-outline'
  | 'arrow-forward'
  | 'checkmark'
  | 'radio-on'
  | 'radio-off'
  | 'alert-circle-outline';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = colors.text }) => {
  const renderPath = () => {
    switch (name) {
      case 'shirt-outline':
      case 'home-outline':
        return <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color} />;
      case 'receipt-outline':
        return (
          <Path
            d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2l-1.5 1.5L6 2l-1.5 1.5L3 2v20z"
            fill={color}
          />
        );
      case 'pricetag-outline':
        return (
          <Path
            d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"
            fill={color}
          />
        );
      case 'person-outline':
        return (
          <Path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill={color}
          />
        );
      case 'location-outline':
        return (
          <Path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            fill={color}
          />
        );
      case 'notifications-outline':
        return (
          <Path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            fill={color}
          />
        );
      case 'search-outline':
        return (
          <Path
            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            fill={color}
          />
        );
      case 'arrow-back':
        return <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={color} />;
      case 'chevron-forward':
        return <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill={color} />;
      case 'chevron-down':
        return <Path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" fill={color} />;
      case 'add':
        return <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill={color} />;
      case 'remove':
        return <Path d="M19 13H5v-2h14v2z" fill={color} />;
      case 'close':
        return (
          <Path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill={color}
          />
        );
      case 'check-circle':
        return (
          <Path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill={color}
          />
        );
      case 'star':
        return (
          <Path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={color}
          />
        );
      case 'star-outline':
        return (
          <Path
            d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
            fill={color}
          />
        );
      case 'card-outline':
        return (
          <Path
            d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
            fill={color}
          />
        );
      case 'truck-outline':
        return (
          <Path
            d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-3.5H18c0-1.66-1.34-3-3-3s-3 1.34-3 3H9V9h6v3h3.5l1.5 2v1zm-4.5 3.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
            fill={color}
          />
        );
      case 'trash-outline':
        return (
          <Path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            fill={color}
          />
        );
      case 'pencil-outline':
        return (
          <Path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            fill={color}
          />
        );
      case 'time-outline':
        return (
          <Path
            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
            fill={color}
          />
        );
      case 'shield-checkmark-outline':
        return (
          <Path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
            fill={color}
          />
        );
      case 'calendar-outline':
        return <Path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z" fill={color} />;
      case 'iron-outline':
        return <Path d="M10 11V8c0-1.1.9-2 2-2h8v2h-8v3h-2zM3 18c0-3.87 3.13-7 7-7h11v7H3zm2.3-2H19v-3h-9c-2.27 0-4.2 1.26-4.7 3zM2 20h20v1.5H2z" fill={color} />;
      case 'dry-cleaning-outline':
        return <Path d="M19.56 11.36L13 8.44V7c0-.55-.45-1-1-1s-1-.45-1-1 .45-1 1-1 1 .45 1 1h2c0-1.84-1.66-3.3-3.56-2.95-1.18.22-2.15 1.17-2.38 2.35-.3 1.56.6 2.94 1.94 3.42v.63l-6.56 2.92c-.88.38-1.44 1.25-1.44 2.2v.01C3 14.92 4.08 16 5.42 16H7v6h10v-6h1.58c1.34 0 2.42-1.08 2.42-2.42v-.01c0-.95-.56-1.82-1.44-2.21zM15 20H9v-5h6v5zm3.58-6H17v-1H7v1H5.42c-.23 0-.42-.19-.42-.43 0-.17.1-.32.25-.39l6.75-3 6.75 3c.15.07.25.22.25.39 0 .24-.19.43-.42.43z" fill={color} />;
      case 'washer-outline':
        return <Path d="M9.17 16.83c1.56 1.56 4.1 1.56 5.66 0 1.56-1.56 1.56-4.1 0-5.66l-5.66 5.66zM18 2.01L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM10 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM7 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill={color} />;
      case 'bag-outline':
        return <Path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" fill={color} />;
      case 'shoe-outline':
        return <Path d="M2 17v-4.5L3.6 7h1.9l1 2.2h1.8L9 7h3.2l2.9 4.4 4.7 1.4c1.3.4 2.2 1.6 2.2 3V17H2zm2-2h16v-.2c0-.45-.3-.85-.73-.98l-5.43-1.63L11.13 9h-.7l-.73 2.2H5.2l-.6-1.4L4 12.8V15zM2 18.5h20V20H2z" fill={color} />;
      case 'rupee-outline':
        return <Path d="M13.66 7c-.56-1.18-1.76-2-3.16-2H6V3h12v2h-3.26c.48.58.84 1.26 1.05 2H18v2h-2.02c-.25 2.8-2.61 5-5.48 5h-.73l6.73 7h-2.77L7 14v-2h3.5c1.76 0 3.22-1.3 3.46-3H6V7h7.66z" fill={color} />;
      case 'package-outline':
        return <Path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.81.97H5.44l.8-.97zM5 19V8h14v11H5zm8.45-9h-2.9v3H8l4 4 4-4h-2.55z" fill={color} />;
      case 'document-text-outline':
        return <Path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill={color} />;
      case 'arrow-forward':
        return <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill={color} />;
      case 'checkmark':
        return <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={color} />;
      case 'radio-on':
        return <Path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill={color} />;
      case 'radio-off':
        return <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill={color} />;
      case 'alert-circle-outline':
      default:
        return (
          <Path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            fill={color}
          />
        );
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G>{renderPath()}</G>
    </Svg>
  );
};

export default Icon;
