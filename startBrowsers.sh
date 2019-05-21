resol="$(xdpyinfo  | grep -oP 'dimensions:\s+\K\S+')"
r1="$(cut -d "x" -f 1 <<< "$resol")"
r2="$(cut -d "x" -f 2 <<< "$resol")"

winSize="$(($r1/2)),$r2"

ARGS="--window-size=$winSize --new-window" 
URL="127.0.0.1:8000/client/lock_screen.html"
google-chrome --new-window --window-size=$winSize --window-position=0,0 -user-data-dir=/tmp/chrome1 $URL &
google-chrome --new-window --window-size=$winSize --window-position=$(($r1/2)),0 -user-data-dir=/tmp/chrome2 $URL &
