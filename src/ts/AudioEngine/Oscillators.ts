import MIDI from '../MIDI'
import CONSTANTS from '../Constants'
import Osc1 from './Osc1'
import { BaseOscillator } from './Oscillator/BaseOscillator'

type WaveformType = string

export interface OscillatorsState {
	mix: number
	pw: number
	osc1: any
}

// TODO: move set state to Oscillator.js
export default class Oscillators {

	public context: AudioContext
	public state: OscillatorsState = {
		osc1: {}, 
	} as OscillatorsState

	public oscillator1: Osc1

	constructor (context: AudioContext) {
		this.context = context

		this.oscillator1 = new Osc1(context)
	}

	public setState = (state: OscillatorsState) => {
		this.oscillator1.setState(state.osc1)
		this.setPulseWidth(state.pw)
	}

	setPulseWidth = (pw_: number) => {
		const pw = MIDI.logScaleToMax(pw_, .9)
		this.state.pw = pw
	}

	_newOscillator = (waveformType: WaveformType): BaseOscillator => {
		return new BaseOscillator(this.context, "waveform")
	}

	panic = () => {
		this.oscillator1.panic()
	}

	noteOn = (midiNote: number, noteOnCb: any /*, velocity*/) => {
		this.oscillator1.noteOn(midiNote, noteOnCb)
	}

	noteOff = (midiNote: number, noteOffCb: any /*, velocity*/) => {
		this.oscillator1.noteOff(midiNote, noteOffCb)
	}
}
