// Dora Timer : basic ver.
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
// SOLENOID : D2 (ON/OFF)

#include <MIDI.h>

MIDI_CREATE_DEFAULT_INSTANCE();

const int SOLENOID = 2;
const int NOTE_ON = 0x90;
const int NOTE_OFF = 0x80;
const int NOTE_NUM_SOLENOID_ON = 4;

void setup() {
  pinMode(SOLENOID, OUTPUT);
  MIDI.begin(1);
}

void loop() {
  if (MIDI.read()) {
    int channel = MIDI.getType();
    int note = MIDI.getData1();

    if (note == NOTE_NUM_SOLENOID_ON) {
      if (channel == NOTE_ON) {
        digitalWrite(SOLENOID, HIGH);
      } else if (channel == NOTE_OFF) {
        digitalWrite(SOLENOID, LOW);
      }
    }
  }
}
