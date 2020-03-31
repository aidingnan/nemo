`netface` provides an RP interface to manage NetworkManager.

```
/org/freedesktop/NetworkManager                                 # NetworkManager
/org/freedesktop/NetworkManager/AgentManager                    # AgentManager
/org/freedesktop/NetworkManager/DnsManager                      # DnsManager
/org/freedesktop/NetworkManager/Settings                        # Settings, addConnection etc.
/org/freedesktop/NetworkManager/AccessPoint/[nnn]               # AccessPoint props and signal
/org/freedesktop/NetworkManager/ActiveConnection/[nn]           # Connection.Active, props and signal
/org/freedesktop/NetworkManager/DHCP4Config/[n]                 # DHCP4Config
/org/freedesktop/NetworkManager/Devices/[n]                     # Device, Device.Wired, Device.Wireless etc.
/org/freedesktop/NetworkManager/IP4Config/[nn]                  # IP4Config
/org/freedesktop/NetworkManager/IP6Config/[nn]                  # IP6Config
/org/freedesktop/NetworkManager/Settings/[n]                    # Settings.Connection
```

The following resources are not exported:

1. NetworkManager/Settings
2. AgentManager
3. DnsManager

最重要的资源是Connection，激活的也是Connection，Connection


业务

1. 获取和观察Access Points列表；
2. 获取和观察Connection列表；
3. 获取和观察ActiveConnection；
4. 获取和观察NM State；
5. 获取和观察WiFi Enabled；

Accesspoints:
1. rescan

Connection:
1. 添加Connection；
2. 删除Connection；
3. 激活Connection；

NetworkManager没有Radio On/Off接口，有`WirelessEnabled`状态。操作Radio最好提供额外的on/off，而不是直接去patch这个值。

https://developer.gnome.org/NetworkManager/stable/spec.html

Request the device to scan. To know when the scan is finished, use the "PropertiesChanged" signal from "org.freedesktop.DBus.Properties" to listen to changes to the "LastScan" property.

