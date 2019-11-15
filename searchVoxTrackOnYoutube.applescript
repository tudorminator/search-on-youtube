tell application "VOX"
	set trackInfo to quote & artist & quote & " - " & quote & track & quote
end tell

tell application "Google Chrome"
	make new tab at first window with properties {URL:"https://www.youtube.com/results?search_query=" & trackInfo}
	activate
end tell
