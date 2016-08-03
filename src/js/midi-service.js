'use strict';

angular.module('dora')
/**
 * @ngdoc service
 * @module dora:midi
 *
 * @description
 * MIDI中継用サービス
 */
.service('midi', function($window, $q, $timeout, $rootScope, config) {

  this.create = create;
  this.setHandler = setHandler;
  this.sendNoteOn = sendNoteOn;
  this.sendNoteOff = sendNoteOff;
  this.sendNoteToggle = sendNoteToggle;

  let midi = null;
  let onMidi = angular.noop;
  const inputs = [];
  const outputs = [];

  /**
   * MIDIデバイスの確認、各初期処理
   * @returns {Promise}
   */
  function create() {
    const deffered = $q.defer();

    $window.navigator.requestMIDIAccess().then(function(m) {
      midi = m;

      const it = midi.inputs.values();
      for (var i = it.next(); !i.done; i = it.next()){
        inputs.push(i.value);
      }

      const ot = midi.outputs.values();
      for (var o = ot.next(); !o.done; o = ot.next()){
        outputs.push(o.value);
      }

      for (var cnt = 0; cnt < inputs.length; cnt++){
        inputs[cnt].onmidimessage = _onMidiWrapper;
      }

      if (outputs.length > 0) {
        deffered.resolve();
      } else {
        deffered.reject('Device not found.');
      }
    }, deffered.reject);

    return deffered.promise;
  }

  /**
   * MIDI信号を受信した際のコールバック処理を設定
   * @params {Function} callback
   */
  function setHandler(callback) {
    if (angular.isFunction(callback)) {
      onMidi = function(evt) {
        if (evt.data[2] !== 0) {
          callback(evt);
          $rootScope.$digest();
        }
      };
    }
  }

  /**
   * NoteOnの信号を送信
   * @params {number} note
   */
  function sendNoteOn(note) {
    note = note || 0;
    if (outputs.length > 0) {
      outputs[0].send([config.noteOn, note, 0x7f]);
    }
  }

  /**
   * NoteOffの信号を送信
   * @params {number} note
   */
  function sendNoteOff(note) {
    note = note || 0;
    if (outputs.length > 0) {
      outputs[0].send([config.noteOff, note, 0x7f]);
    }
  }

  /**
   * NoteOn/Offの切り替え
   * @params {number} note
   * @params {number} delay
   */
  function sendNoteToggle(note, delay) {
    delay = delay || 100;
    sendNoteOn(note);
    $timeout(function() {
      sendNoteOff(note);
    }, delay);
  }

  function _onMidiWrapper(evt) {
    onMidi(evt);
  }

});
