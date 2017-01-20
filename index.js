var soundtouch = require('soundtouch');
var inherits = require('util').inherits;
var Service, Characteristic, VolumeCharacteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-soundtouch", "SoundTouchPreset", SoundTouchAccessory);
};

//
// SoundTouch Accessory
//

function SoundTouchAccessory(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"];
    this.room = config["room"];
    this.preset = config["preset"];

    if (!this.room) throw new Error("You must provide a config value for 'room'.");
    if (!this.preset) throw new Error("You must provide a config value for 'preset'");

    this.service = new Service.Switch(this.name);

    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this._getOn.bind(this))
        .on('set', this._setOn.bind(this));

    // begin searching for a SoundTouch device with the given name
    this.search();
}

SoundTouchAccessory.prototype.search = function() {
    var accessory = this;
    accessory.soundtouch = soundtouch;

    accessory.soundtouch.search(function(device) {

        if (accessory.room != device.name) {
            accessory.log("Ignoring device because the room name '%s' does not match the desired name '%s'.", device.name, accessory.room);
            return;
        }

        accessory.log("Found Bose SoundTouch device: %s", device.name);

        accessory.device = device;

        //we found the device, so stop looking
        soundtouch.stopSearching();
    }, function(device) {
        accessory.log("Bose SoundTouch device goes offline: %s", device.name);
    });
};

SoundTouchAccessory.prototype.getInformationService = function() {
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer, 'Bose SoundTouch')
        .setCharacteristic(Characteristic.Model, '1.0.0')
        .setCharacteristic(Characteristic.SerialNumber, this.room);
    return informationService;
};

SoundTouchAccessory.prototype.getServices = function() {
    return [this.service, this.getInformationService()];
};

SoundTouchAccessory.prototype._getOn = function(callback) {
    if (!this.device) {
        this.log.warn("Ignoring request; SoundTouch device has not yet been discovered.");
        callback(new Error("SoundTouch has not been discovered yet."));
        return;
    }

    var accessory = this;

    this.device.isAlive(function(isOn) {
        accessory.log('Check if is playing: %s', isOn);
        callback(null, isOn);
    });
};

SoundTouchAccessory.prototype._setOn = function(on, callback) {
    if (!this.device) {
        this.log.warn("Ignoring request; SoundTouch device has not yet been discovered.");
        callback(new Error("SoundTouch has not been discovered yet."));
        return;
    }

    var accessory = this;
    var preset = "PRESET_" + this.preset;

    if (on) {
        this.device.powerOn((isTurnedOn) => {
            this.log(isTurnedOn ? 'Power On' : 'Was already powered on');
            this.device.pressKey(preset, (json) => {
              console.log(json);
              callback(null);
            });
        });
    } else {
        this.device.pause((json) => {
            callback(null);
            console.log(json);
          });
    }
};
