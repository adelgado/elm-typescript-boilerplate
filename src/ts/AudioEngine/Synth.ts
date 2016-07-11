import Oscillators from './Oscillators'
import CONSTANTS from '../Constants'


export default class Synth {

	public context: AudioContext
	public oscillators: Oscillators

	constructor(state: any) {
		this.context = new AudioContext

		this.oscillators = new Oscillators(this.context)
		this.oscillators.setState(state.oscs)
	}

	setState = (state: any) => {
		this.oscillators.setState(state.oscs)
	}

	onMIDIMessage = (data: any) => {
		const type = data[0] & 0xf0
		const note = data[1]

		switch (type) {
			case CONSTANTS.MIDI_EVENT.NOTE_ON:
				break
			case CONSTANTS.MIDI_EVENT.NOTE_OFF:
				break
		}
	}
}
