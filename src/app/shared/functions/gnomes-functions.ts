export function getGnomeImage(color: string, imageCase: 'cantando' | 'normal' | 'festejo'): string {
  return 'gnome-game/svg/gnomes/' + color + '/' + color + '_' + imageCase + '.svg';
}
export function getGnomeAudio(sound: string): string {
  return 'gnome-game/sounds/' + sound;
}
