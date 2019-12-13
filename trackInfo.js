#!/usr/bin/env osascript -l JavaScript

const currentApp = Application.currentApplication();
currentApp.includeStandardAdditions = true;

const alertIcon = Path('/System/Library/PreferencePanes/Sound.prefPane/Contents/Resources/SoundPref.icns');
const playerIcons = {
  'iTunes': Path('/Applications/iTunes.app/Contents/Resources/iTunes.icns'),
  'VOX': Path('/Applications/mPlayers/VOX.app/Contents/Resources/AppIconNew.icns')
};
const voxIcon = Path('/Applications/mPlayers/VOX.app/Contents/Resources/AppIconNew.icns');
const iTunesIcon = Path('/Applications/iTunes.app/Contents/Resources/iTunes.icns');
const audioPlayers = ['iTunes', 'VOX'];

function run(argv) {
  if (argv.indexOf('--search') > -1) {
    doYoutubeSearch();
  } else {
    showInfo();
  }
};

const showInfo = () => {
  const players = getPlayers();
  switch (players.length) {
    case 0: {
      currentApp.displayDialog(`Nothin' playin', man!`, {
        buttons: ['👎'],
        defaultButton: '👎',
        withIcon: alertIcon,
        withTitle: `Bummer!`,
        givingUpAfter: 10
      });
      break;
    }
    case 1: {
      const player = players.pop();
      const playerName = player.name();
      const trackInfo = getTrackInfo(player);
      const underline = ''.padEnd(trackInfo.title.replace(/[il\s\W]/g, '').length / 1.4, '─');
      const infoText = `${trackInfo.title}\n${underline}\n${trackInfo.artist}\n${trackInfo.album}${trackInfo.year ? " (#)".replace('#', trackInfo.year) : ''}`;
      currentApp.displayDialog(infoText, {
        buttons: ['🤘🏼'],
        defaultButton: '🤘🏼',
        withIcon: playerIcons[playerName] || alertIcon,
        withTitle: `${playerName} currently playing`,
        givingUpAfter: 10
      });
      break;
    }
    default: {
      let infoText = [];
      players.forEach(player => {
        const trackInfo = getTrackInfo(player);
        const headerText = `${player.name()} is currently playing:\n`;
        const underline = ''.padEnd(headerText.replace(/[il ]/g, '').length / 1.7, '─');
        infoText.push(headerText, underline, '\n');
        infoText.push(`${trackInfo.title} ∷ ${trackInfo.artist} - ${trackInfo.album}${trackInfo.year ? " (#)".replace('#', trackInfo.year) : ''}\n\n`);
      });
      infoText.push(`You should really pick ONE player though... 🤣\n\n`);
      currentApp.displayDialog(infoText.join(''), {
        buttons: ['🤘🏼✌🏼👌🏼'],
        defaultButton: '🤘🏼✌🏼👌🏼',
        withIcon: alertIcon,
        withTitle: `Bummer!`
      });
    }
  }
};

const doYoutubeSearch = () => {
  const players = getPlayers();
  if(players.length){
    const trackInfo = getTrackInfo(players.pop());
    const expr = encodeURIComponent(`"${trackInfo.artist}" "${trackInfo.title}"`);
    const url = `https://www.youtube.com/results?search_query=${expr}`;
    const browser = Application('Google Chrome');
    const newTab = new browser.Tab({ 'url': url });
    browser.windows[0].tabs.push(newTab);
    browser.activate();
  }
};

// const system = Application("System Events");
// const processes = system.processes.whose({ backgroundOnly: { '=': false } });
// const players = processes.name()
//   .filter(name => audioPlayers.indexOf(name) > -1)
//   .map(name => Application(name))
//   .filter(player => player.playerState() === 'playing' || player.playerState() === 1);
// return players;
const getPlayers = () => audioPlayers.map(name => Application(name))
      .filter(app => app.running() && (app.playerState() === 'playing' || app.playerState() === 1));

const getTrackInfo = (player) => {
  const playerName = player.name();
  let trackInfo = {};
  if (playerName.toLowerCase().includes('itunes')) {
    const track = player.currentTrack();
    trackInfo = {
      'artist': track.artist().trim(),
      'album': track.album().trim(),
      'title': track.name().trim(),
      'year': track.year()
    };
  } else {
    // VOX
    trackInfo = {
      'title': player.track().toString().trim(),
      'album': player.album().toString().trim(),
      'artist': player.artist().toString().trim()
    }
  }
  return trackInfo;
};