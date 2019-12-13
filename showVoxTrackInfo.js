function run(input, params) {
  const player = Application("VOX");
  const currentApp = Application.currentApplication();
  currentApp.includeStandardAdditions = true;
  
  const trackName = player.track().toString().trim();
  const albumName = player.album().toString().trim();
  const artistName = player.artist().toString().trim();
  const dialogText = `${trackName}\n\n${artistName} - ${albumName}`;
  const icon = Path('/Applications/mPlayers/VOX.app/Contents/Resources/AppIconNew.icns');
  currentApp.activate();
  currentApp.displayDialog(dialogText, {
    as: 'informational',
    buttons: ['🤘🏼'],
    defaultButton: '🤘🏼',
    withIcon: icon,
    withTitle: `${player.name()} currently playing`,
    givingUpAfter: 10
  });
  return input;
}
