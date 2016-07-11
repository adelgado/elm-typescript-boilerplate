import MIDI from '../MIDI'
import CONSTANTS from '../Constants'
import { BaseOscillator } from './Oscillator/BaseOscillator'

export default class VCA {

	public context: AudioContext

	public input: Array<GainNode>

	constructor (context: AudioContext) {
		this.context = context
		for (let i = 0; i < 128; i++) {
			this.input[i] = context.createGain()
		}
	}
}
