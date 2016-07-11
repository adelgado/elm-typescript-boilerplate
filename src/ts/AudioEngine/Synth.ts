import Oscillators from './Oscillators'
import {Overdrive} from './Overdrive'
import VCA from './VCA'
import CONSTANTS from '../Constants'


export default class Synth {

	public context: AudioContext
	public overdrive: Overdrive
	public oscillators: Oscillators
	private vca: VCA

	constructor(state: any) {
		this.context = new AudioContext

		this.overdrive = new Overdrive(this.context)
		this.overdrive.setState(state.overdrive)

		this.oscillators = new Oscillators(this.context)
		this.oscillators.setState(state.oscs)
	}

	setState = (state: any) => {
		this.overdrive.setState(state.overdrive)
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
