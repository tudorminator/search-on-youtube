function run(input, params) {
  const vox = Application("VOX");
  const currentApp = Application.currentApplication();
  currentApp.includeStandardAdditions = true;
  
  const trackName = vox.track().toString().trim();
  const albumName = vox.album().toString().trim();
  const artistName = vox.artist().toString().trim();
  // console.log(app.album(), app.track());
  const dialogText = `${trackName}\n${artistName} - ${albumName}`;
  const icon = Path('/Applications/mPlayers/VOX.app/Contents/Resources/AppIconNew.icns');
  // const icon = Path('/Applications/iTunes.app/Contents/Resources/iTunes.icns');
  // const icon = Path('/Applications/iTunes.app/Contents/Resources/iPodGeneric.icns');
  currentApp.activate();
  currentApp.displayDialog(dialogText, {
    as: 'informational',
    buttons: ['🤘🏼'],
    defaultButton: '🤘🏼',
    withIcon: icon,
    givingUpAfter: 10
  });
  return input;
}
