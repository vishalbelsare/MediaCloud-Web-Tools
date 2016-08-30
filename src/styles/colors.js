
let appColors = {
  light: '#990000',
  dark: '#330000',
};

export function setAppColors(newAppColors) {
  appColors = newAppColors;
}

export function getBrandColors() {
  return appColors;
}

export function getBrandDarkColor() {
  return appColors.dark;
}

export function getBrandLightColor() {
  return appColors.light;
}
