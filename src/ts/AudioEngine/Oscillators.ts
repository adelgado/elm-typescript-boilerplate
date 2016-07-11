import MIDI from '../MIDI'
import CONSTANTS from '../Constants'
import FMOscillator from './Oscillator/FMOscillator'
import PulseOscillator from './Oscillator/PulseOscillator'
import Osc1 from './Osc1'
import NoiseOscillator from './Oscillator/NoiseOscillator'
import { BaseOscillator } from './Oscillator/BaseOscillator'
import DualMixer from './DualMixer'

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

	public mixer:DualMixer

	constructor (context: AudioContext) {
		this.context = context

		/* AudioNode graph routing */

		this.mixer = new DualMixer(context)

		/* create oscillator nodes */
		this.oscillator1 = new Osc1(context)
	}

	public setState = (state: OscillatorsState) => {
		this.oscillator1.setState(state.osc1)
		this.mixer.setState(state.mix)
		this.setPulseWidth(state.pw)
	}

	setPulseWidth = (pw_: number) => {
		const pw = MIDI.logScaleToMax(pw_, .9)
		this.state.pw = pw
	}

	_newOscillator = (waveformType: WaveformType): BaseOscillator => {
		if (waveformType == CONSTANTS.WAVEFORM_TYPE.PULSE) {
			return new PulseOscillator(this.context)
		} else if (waveformType == CONSTANTS.WAVEFORM_TYPE.NOISE) {
			return new NoiseOscillator(this.context)
		} else {
			return new FMOscillator(this.context, waveformType)
		}
	}

	connect = (node: any) => {
		this.mixer.channel1.connect(node)
		this.mixer.channel2.connect(node)
	}

	disconnect = (node: any) => {
		this.mixer.channel1.disconnect(node)
		this.mixer.channel2.disconnect(node)
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
