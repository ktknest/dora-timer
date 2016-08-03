'use strict';

angular.module('dora')
/**
 * @ngdoc constant
 * @module dora:config
 *
 * @description
 * 各種設定
 */
.constant('config', {
  defaultRemainingTime : 60,

  noteOn : 0x90,
  noteOff : 0x80,

  noteNumCheckToArduino : 0,
  noteNumCheckToMidi : 1,
  noteNumTimerOn : 2,
  noteNumTimerOff : 3,
  noteNumSolenoidOn : 4,
  noteNumTimerToggle : 5
});
