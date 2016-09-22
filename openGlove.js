var serialPortLibrary = require("serialport");
var serialPortConstructor = require("serialport").SerialPort;
var events = require("events");
var util = require('util');
var Communication = require('./communication')
var MessageGenerator = require('./messageGenerator');

/**
 * Represents an OpenGlove device instance. Provide methods for communication with the device, initialize and activate vibration motors, besides others actuators and sensors
 * @author Rodrigo Monsalve Lagos
 */

function OpenGlove() {

	this.ANALOG_READ_COMMAND = "Analog Read";
	this.DIGITAL_READ_COMMAND = "Digital Read";

	this.readQueue =[];

	this.communication;
	this.messageGenerator = new MessageGenerator();

}

OpenGlove.prototype = new events.EventEmitter;

/** @function openPort
 * @description Open the communication with the port and baudrate specified. Emits "open" event on sucessfully communication
 * @param {String} portName - Name of the serial port to open a communication
 * @param {Number} baudRate - Data rate in bits per second. Use one of these values: 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, or 115200
 */

OpenGlove.prototype.openPort = function(portName, baudRate) {

	this.communication = new Communication(portName,baudRate);
	var self = this;

	this.communication.on('open',function(){

		self.emit('open','');
		self.communication.on('data', function(data){
			self.emit('data', data);
		});

	});
	
}

/**
 * @function closePort
 * @description Close the current active serial communication
 * @param {Function} callback - Optional callback function. It must have like "function(){}"
 */

OpenGlove.prototype.closePort = function(callback) {

	if (callback) {
		this.communication.closePort(callback);
	} else {
		this.communication.closePort();
	}
	
}

/**
 * @function getPortNames
 * @description List all active serial ports names.
 * @param {Function} callback - An optional callback function with the form function(err, portNames). Portnames is an array with the names of all active serial ports.  
 * @return {Array} If no callback is provided, returns an array with the names of all active serial ports.
 */

OpenGlove.prototype.getPortNames = function(callback) {

	if (callback) {
		this.communication.getPortNames(callback);
	} else {
		this.communication.getPortNames();
	}
}

/**
 * @function initializeMotor
 * @description Initialize pins like motors in the control software
 * @param {Array} pins - Array of pins that are initialized
 * @param {Function} callback - An optional callback function with the form "function(err)".
 */

OpenGlove.prototype.initializeMotor = function(pins, callback) {

	var message = this.messageGenerator.initializeMotor(pins);
	if(callback) {
		this.communication.write(message, callback); 
	}
	else{
		this.communication.write(message); 
		return;
	}
}

/**
 * @function activateMotor
 * @description Activate motors with analog or digital values. Each motor is activated with the value with the same index
 * @param {Array} pins - Array of pins where are connected the motors
 * @param {Array} values - Array with the intensities to activate the motors. It can be "HIGH" or "LOW" in digital mode or a number bewteen 0 and 255 in analog mode
 * @param {Function} callback - An optional callback function with the form "function(err)".
 */

OpenGlove.prototype.activateMotor = function(pins, values, callback) {

	var message = this.messageGenerator.activateMotor(pins, values);
	if(callback) {
		this.communication.write(message, callback); 
		return;
	}
	else{
		this.communication.write(message); 
		return;
	}
		
	
}

/**
 * @function analogRead
 * @description Send a message to read the input voltage from a analog pin
 * @param {Number} pin - Number of the analog pin to be readed
 * @param {Function} callback - An optional callback function with the form "function(err)".
 */

OpenGlove.prototype.analogRead = function(pin, callback) {

	var message = this.messageGenerator.analogRead(pin);
	if(callback) {
		this.communication.write(message, callback); 
		return;
	}
	else{
		this.communication.write(message); 
		return;
	} 
}

/**
 * @function digitalRead
 * @description Send a message to read a value from a digital pin
 * @param {Number} pin - Number of the digital pin to be readed
 * @param {Function} callback - An optional callback function with the form "function(err)".
 */

OpenGlove.prototype.digitalRead = function(pin, callback) {

	var message = this.messageGenerator.digitalRead(pin);
	if(callback) {
		this.communication.write(message, callback); 
		return;
	}
	else{
		this.communication.write(message); 
		return;
	} 
}

/**
 * @function pinMode
 * @description Initialize multiples pins in input or output mode. Each pin is initialized with the mode in the same index
 * @param {Array} pins - Array with the numbers of the pins to be initialized
 * @param {Array} modes - Array with the modes to initialize the pins, it can be "INPUT" or "OUTPUT"
 * @param {Function} callback - An optional callback function with the form "function(err)".
 */

OpenGlove.prototype.pinMode = function(pins, modes, callback) {

	var message = this.messageGenerator.pinMode(pins, modes);
	if(callback) {
		this.communication.write(message, callback); 
		return;
	}
	else{
		this.communication.write(message); 
		return;
	} 
}

/**
 * @function digitalWrite
 * @description Write values on digital pins. Each motor is activated with the value with the same index
 * @param {Array} pins - Array with the numbers of the pins to be initialized
 * @param {Array} values - Array with the values to write on the pins, it can be "HIGH" or "LOW"
 * @param {Function} callback - An optional callback function with the form "function(err)".
 */

OpenGlove.prototype.digitalWrite = function(pins, values, callback) {

	var message = this.messageGenerator.digitalWrite(pins, values);
	if(callback) {
		this.communication.write(message, callback); 
		return;
	}
	else{
		this.communication.write(message); 
		return;
	} 
}

/**
 * @function analogWrite
 * @description Write analog values to pins. Each motor is activated with the value with the same index
 * @param {Array} pins - Array with the numbers of the pins to be writed
 * @param {Array} values - Array with the values to write on the pins, it can be between 0 (always off) and 255 (always on)
 * @param {Function} callback - An optional callback function with the form "function(err)".
 */

OpenGlove.prototype.analogWrite = function(pins, values, callback) {

	var message = this.messageGenerator.analogWrite(pins,values);
	if(callback) {
		this.communication.write(message, callback); 
		return;
	}
	else{
		this.communication.write(message); 
		return;
	}
}

module.exports = OpenGlove;

