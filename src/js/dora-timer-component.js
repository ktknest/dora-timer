'use strict';

angular.module('dora')
/**
 * @ngdoc component
 * @module dora:doraTimer
 *
 * @params {number} remainingTime
 *
 * @description
 * タイマー表示＆制御
 */
.component('doraTimer', {
  template : `
<div class="count" ng-bind="$ctrl.remainingTime | time" ng-class="{'count--disabled':$ctrl.isSetting}"></div>
<div class="controler-box">
  <div ng-hide="$ctrl.isSetting">
    <button type="button" class="controler-box__btn" ng-click="$ctrl.play()" ng-show="!$ctrl.isPlaying">
      <i class="fa fa-play"></i>
    </button>
    <button type="button" class="controler-box__btn" ng-click="$ctrl.pause()" ng-show="$ctrl.isPlaying">
      <i class="fa fa-pause"></i>
    </button>
    <button type="button" class="controler-box__btn" ng-click="$ctrl.reset()" ng-disabled="!$ctrl.canRefresh">
      <i class="fa fa-refresh"></i>
    </button>
    <button type="button" class="controler-box__btn" ng-click="$ctrl.openSetting()" ng-disabled="$ctrl.isPlaying">
      <i class="fa fa-gear"></i>
    </button>
  </div>
  <form name="setting" novalidate ng-show="$ctrl.isSetting">
    <input type="number" name="defaultRemainingTime" ng-model="$ctrl.defaultRemainingTime" min="0" max="3600" class="controler-box__input">
    <button type="button" class="controler-box__btn" ng-click="$ctrl.closeSetting(setting.$dirty)" ng-disabled="setting.$invalid">
      <i class="fa fa-check"></i>
    </button>
  </form>
</div>
  `,
  controller : 'DoraTimerController',
  bindings : {
    remainingTime : '='
  }
})
.controller('DoraTimerController', function($scope, $timeout, $interval, config, midi) {

  let countdownInterval = null;
  let countStartDate = null;
  let countStartRemainingTime = null;

  this.isPlaying = false;
  this.canRefresh = false;
  this.isSetting = false;
  this.defaultRemainingTime = null;

  this.play = play;
  this.pause = pause;
  this.reset = reset;
  this.openSetting = openSetting;
  this.closeSetting = closeSetting;

  this._playToggle = _playToggle;
  this._countdown = _countdown;
  this._onComplete = _onComplete;
  this._onMidiEvent = _onMidiEvent;

  init.call(this);

  function init() {
    this.defaultRemainingTime = config.defaultRemainingTime;
    midi.setHandler(this._onMidiEvent.bind(this));
  }

  /**
   * 開始
   */
  function play() {
    if (this.remainingTime === 0) {
      this.reset();
    }

    this.isPlaying = true;
    this.canRefresh = false;
    countStartDate = Date.now();
    countStartRemainingTime = this.remainingTime;
    countdownInterval = $interval(this._countdown.bind(this), 1000);
    midi.sendNoteOn(config.noteNumTimerOn);
  }

  /**
   * 一時停止
   */
  function pause() {
    this.isPlaying = false;
    this.canRefresh = this.remainingTime < this.defaultRemainingTime;
    $interval.cancel(countdownInterval);
    midi.sendNoteOn(config.noteNumTimerOff);
  }

  /**
   * リセット
   */
  function reset() {
    this.remainingTime = this.defaultRemainingTime;
    this.canRefresh = false;
  }

  /**
   * 残り時間設定モードに切り替える
   */
  function openSetting() {
    this.isSetting = true;
  }

  /**
   * 残り時間設定モードを完了
   * @params {boolean} dirty
   */
  function closeSetting(dirty) {
    this.isSetting = false;
    if (dirty) {
      this.reset();
    }
  }

  /**
   * 開始停止の切り替え
   */
  function _playToggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * カウントダウン処理
   */
  function _countdown() {
    var remainingTime = countStartRemainingTime - Math.floor((Date.now() - countStartDate) / 1000);
    if (remainingTime <= 0) {
      remainingTime = 0;
    }
    this.remainingTime = remainingTime;
    if (this.remainingTime <= 0) {
      this._onComplete();
    }
  }

  /**
   * タイマー終了時
   */
  function _onComplete() {
    this.pause();
    midi.sendNoteToggle(config.noteNumSolenoidOn);
  }

  /**
   * MIDIデバイスからの信号受診時の処理
   * @params {Object} evt
   */
  function _onMidiEvent(evt) {
    if (evt.data[0] === config.noteOn && evt.data[1] === config.noteNumTimerToggle) {
      this._playToggle();
    }
  }
});
