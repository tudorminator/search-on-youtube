#!/usr/bin/env osascript -l JavaScript

const currentApp = Application.currentApplication();
currentApp.includeStandardAdditions = true;

const alertIcon = Path('/System/Library/PreferencePanes/Sound.prefPane/Contents/Resources/SoundPref.icns');
const playerIcons = {
  'iTunes': Path('/Applications/iTunes.app/Contents/Resources/iTunes.icns'),
  'Music': Path('/System/Applications/Music.app/Contents/Resources/AppIcon.icns'),
  'VOX': Path('/Applications/mPlayers/VOX.app/Contents/Resources/AppIconNew.icns'),
  'Cog': Path('/Applications/mPlayers/Cog.app/Contents/Resources/Cog Icon Precomposed.icns'),
};
// const voxIcon = Path('/Applications/mPlayers/VOX.app/Contents/Resources/AppIconNew.icns');
// const iTunesIcon = Path('/Applications/iTunes.app/Contents/Resources/iTunes.icns');
const possiblePlayers = ['Music', 'iTunes', 'VOX', 'Cog'];

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
      const stateSymbol = getPlayerState(player);
      const trackInfo = getTrackInfo(player);
      const underline = ''.padEnd(trackInfo.title.replace(/[il\s\W]/g, '').length / 1.1, '─');
      const infoText = `${stateSymbol} ${trackInfo.title}\n${underline}\n${trackInfo.artist}\n${trackInfo.album}${trackInfo.year ? ` (${trackInfo.year})` : ''}`;
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
        const stateSymbol = getPlayerState(player);
        const trackInfo = getTrackInfo(player);
        const headerText = `${stateSymbol} ${player.name()} track:\n`;
        const underline = ''.padEnd(headerText.replace(/[il\s\W]/g, '').length / 1.1, '─');
        infoText.push(headerText, underline, '\n');
        infoText.push(`${trackInfo.title} ∷ ${trackInfo.artist} - ${trackInfo.album}${trackInfo.year ? " (#)".replace('#', trackInfo.year) : ''}\n\n`);
      });
      // infoText.push(`You should really pick ONE player though... 🤣\n\n`);
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
    const browser = Application('Google Chrome');
    players.forEach(player => {
      const trackInfo = getTrackInfo(player);
      const artist = trackInfo.artist.split(/\s/g).join('+');
      const title = trackInfo.title.split(/\s/g).join('+');
      const expr = `"${artist}"+"${title}"`;
      const url = `https://www.youtube.com/results?search_query=${expr}`;
      const newTab = new browser.Tab({ 'url': url });
      browser.windows[0].tabs.push(newTab);
    });
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
const getPlayers = () => {
  const audioPlayers = possiblePlayers.filter(appExists)
  return audioPlayers.map(name => Application(name)).filter(app => app.running());
}

const getTrackInfo = (player) => {
  const playerName = player.name().toLowerCase();
  let trackInfo = {
    'title': 'N/A',
    'album': 'N/A',
    'artist': 'N/A',
    'year': 'N/A', 
  };
  switch (true) {
    case playerName.includes('vox'): {
      // VOX
      trackInfo = {
        'title': player.track().toString().trim(),
        'album': player.album().toString().trim(),
        'artist': player.artist().toString().trim()
      }
      break;
    }
    case playerName.includes('cog'): {
      // Cog
      try {
        const current = player.currententry;
        trackInfo = {
          'title': current.title().toString().trim(),
          'album': current.album().toString().trim(),
          'artist': current.artist().toString().trim(),
          'year': current.year().toString()
        }
      } catch(err){
        console.log(`${player.name()} not playing`)
      }
      break;
    }
    default: {
      // iTunes or Music
      const track = player.currentTrack();
      trackInfo = {
        'artist': track.artist().toString().trim(),
        'album': track.album().toString().trim(),
        'title': track.name().toString().trim(),
        'year': track.year().toString()
      };
    }
  }
  return trackInfo;
};

const getPlayerState = (player) => {
  if(player.name().toLowerCase() === 'cog') {
    try {
      const current = player.currententry;
      return '▶️';
    } catch(err){
      return '⏸';
    }
  }
  return player.playerState() === 'playing' || player.playerState() === 1
    ? '▶️'
    : '⏸';
}

const appExists = appName => {
  try {
    const app = Application(appName);
    return true;
  } catch (err) {
    return false;
  }
}
