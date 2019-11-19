tell application "VOX"
    -- set trackInfo to track & return & artist & " - " & album
    set trackName to track
    set trackArtist to artist
    set trackAlbum to album
    display notification trackAlbum with title trackName subtitle trackArtist
end tell