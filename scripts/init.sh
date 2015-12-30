#1/bin/sh

mkdir -p /var/run
mkdir -p /var/log
mkdir -p /var/lock
mkdir -p /var/state
mkdir -p /tmp/.uci
chmod 0700 /tmp/.uci
mkdir -p /tmp/.jail
touch /var/log/wtmp
touch /var/log/lastlog

/bin/sh
