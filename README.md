#Homebridge-soundtouch

[Bose SoundTouch](https://www.bose.com/soundtouch-systems.html) plugin for [Homebridge](https://github.com/nfarina/homebridge)

This allows you to play and pause Presets on your SoundTouch devices with HomeKit and Siri.

##Installation
1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-soundtouch-preset
3. Update your configuration file. See the sample below.

##Configuration
Example config.json:

```
    "accessories": [
		{
			"accessory": "SoundTouch-Preset",
			"name": "Preset",
			"room": "Bathroom",
      "preset": "1"
		}
	],
```

Fields:

* "accessory": Must always be "SoundTouch-Preset" (required)
* "name": The name you want to use to control the SoundTouch.
* "room": Should match exactly with the name of the SoundTouch device.
* "preset": Preset number you wish to play.

Don't use soundtouch or music as name, because Siri will try to open the SoundTouch or Apple Music app.

Controlling the volume with Siri is not possible, because volume is not (yet) supported as a Characteristic.
In fact, for HomeKit this accessory is treated like a switch (because music accessories are not supported).

##Connecting

1. Install the Insteon+ app on your iPhone or iPad.
2. Add a home
3. Add a device and select the found 'HomeBridge' accessory (pin code is 031-45-154)


##Siri (English)

* Hey Siri, turn Preset on
* Hey Siri, turn Preset off
