// Dora Timer : app ver.
//
// FYI :
// http://qiita.com/tadfmac/items/9136f47ae1eea99a4ef7
// @author tadfmac
//
// Using :
// - DualMoco : http://morecatlab.akiba.coocan.jp/lab/index.php/aruino/midi-firmware-for-arduino-uno-moco/
// - MIDI Library : http://playground.arduino.cc/Main/MIDILibrary
//
// Device:
// LED
//  RED     : D13
//  GREEN   : D12
// BUTTON   : D8 (Timer ON/OFF)
// SOLENOID : D2 (ON/OFF)

#include <MIDI.h>

MIDI_CREATE_DEFAULT_INSTANCE();

const int SOLENOID = 2;
const int RED_LED = 13;
const int GREEN_LED = 12;
const int BUTTON = 8;

const int NOTE_ON = 0x90;
const int NOTE_OFF = 0x80;

const int NOTE_NUM_CHECK_TO_ARDUINO = 0;
const int NOTE_NUM_CHECK_MIDI = 1;
const int NOTE_NUM_TIMER_ON = 2;
const int NOTE_NUM_TIMER_OFF = 3;
const int NOTE_NUM_SOLENOID_ON = 4;
const int NOTE_NUM_TIMER_TOGGLE = 5;

void setup() {
  pinMode(SOLENOID, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(BUTTON, INPUT);

  // Launch MIDI with default options
  MIDI.begin(1);
}

int button = 0;
boolean isConnect = false;

void loop() {
  if (MIDI.read()) {
    runReadMode();
  } else {
    runWriteMode();
  }
}

void runReadMode() {
  int channel = MIDI.getType();
  int note = MIDI.getData1();

  switch(note) {
  case NOTE_NUM_CHECK_TO_ARDUINO: // PCとの疎通確認
    if (channel == NOTE_ON) {
      MIDI.sendNoteOn(NOTE_NUM_CHECK_MIDI, 0x0f, 1);
      digitalWrite(RED_LED, HIGH);
      isConnect = true;
    }
    break;

  case NOTE_NUM_TIMER_ON: // Timer開始
    if (channel == NOTE_ON) {
      digitalWrite(GREEN_LED, HIGH);
      digitalWrite(RED_LED, LOW);
    }
    break;

  case NOTE_NUM_TIMER_OFF: // Timer停止
    if (channel == NOTE_ON) {
      digitalWrite(GREEN_LED, LOW);
      digitalWrite(RED_LED, HIGH);
    }
    break;

  case NOTE_NUM_SOLENOID_ON: // ソレノイド制御
    if (channel == NOTE_ON) {
      digitalWrite(SOLENOID, HIGH);
    } else if (channel == NOTE_OFF) {
      digitalWrite(SOLENOID, LOW);
    }
    break;

  default:
    break;
  }
}

void runWriteMode() {
  int nowbutton;

  // Button (Note ON/OFF)
  nowbutton = digitalRead(BUTTON);
  if(nowbutton != button){
    if(nowbutton == HIGH) {
      MIDI.sendNoteOn(NOTE_NUM_TIMER_TOGGLE, 0x0f, 1);
    }
    delay(50);
  }
  button = nowbutton;
}
