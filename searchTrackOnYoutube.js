const player = Application('iTunes');
const track = player.currentTrack();
const trackInfo = {
	'artist': track.artist().trim(),
	'album': track.album().trim(),
	'title': track.name().trim()
};
const expr = encodeURIComponent(`"${trackInfo.artist}" "${trackInfo.title}" "${trackInfo.album}"`);
const url = `https://www.youtube.com/results?search_query=${expr}`;

// console.log(url);
const browser = Application('Google Chrome');
const newTab = new browser.Tab({ 'url': url });
browser.windows[0].tabs.push(newTab);
browser.activate();