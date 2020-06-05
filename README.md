# nemo

nemo is a network management service for Rockbian.

it speaks RP and listens to `/run/impress/nemo`.

it has its own configuration file for wifi, overriding connections in NetworkManager. 

currently, it talks to NetworkManager via DBus (depends on woodstock). This may be changed in future.
