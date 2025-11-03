export default function hexToRgb(hex: string): number[] {
    // Delete the hash if present
    hex = hex.replace(/^#/, '');
  
    // If short hex format (#abc)
    if (hex.length === 3) {
      hex = hex.split('').map(function (hex) {
        return hex + hex;
      }).join('');
    }
  
    // Convert to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    return [r, g, b];
  }