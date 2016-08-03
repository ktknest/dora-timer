'use strict';

angular.module('dora')
/**
 * @ngdoc component
 * @module dora:doraApp
 *
 * @description
 * 初期設定
 */
.component('doraApp', {
  template : `
<div class="app" ng-class="{'app--timeup' : $ctrl.remainingTime === 0}">
  <div class="loading" ng-show="$ctrl.isLoading">
    <i class="fa fa-spinner fa-spin"></i>
  </div>
  <div ng-if="$ctrl.hasMidi">
    <dora-timer remaining-time="$ctrl.remainingTime"></dora-timer>
  </div>
  <div ng-if="$ctrl.isError">
    <dora-error error-message="$ctrl.errorMessage"></dora-error>
  </div>
</div>
  `,
  controller : 'DoraAppController'
})
.controller('DoraAppController', function($timeout, $interval, config, midi) {
  this.isLoading = true;
  this.hasMidi = false;
  this.isError = false;
  this.errorMessage = '';
  this.remainingTime = null;

  init.call(this);

  function init() {
    this.remainingTime = config.defaultRemainingTime;
    midi.create().then(_onMidiCreateSuccess.bind(this), _onMidiCreateError.bind(this));
  }

  /**
   * MIDIデバイスが見つかった場合
   */
  function _onMidiCreateSuccess() {
    midi.sendNoteOn(config.noteNumCheckToArduino);
    this.isLoading = false;
    this.hasMidi = true;
  }

  /**
   * MIDIデバイスが見つからなかった場合
   * @params {string} message
   */
  function _onMidiCreateError(message) {
    this.errorMessage = message;
    this.isLoading = false;
    this.isError = true;
    console.error('midi.create() : ' + message);
  }
});
