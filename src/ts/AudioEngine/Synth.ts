import Oscillators from './Oscillators'
import {Filter} from './Filter'
import {Overdrive} from './Overdrive'
import VCA from './VCA'
import CONSTANTS from '../Constants'


export default class Synth {

	public context: AudioContext
	public overdrive: Overdrive
	public filter: Filter
	public oscillators: Oscillators
	private vca: VCA

	constructor(state: any) {
		this.context = new AudioContext

		this.overdrive = new Overdrive(this.context)
		this.overdrive.setState(state.overdrive)

		this.filter = new Filter(this.context)
		this.filter.setState(state.filter)
		this.filter.connect(this.overdrive.input)

		this.oscillators = new Oscillators(this.context)
		this.oscillators.setState(state.oscs)
	}

	setState = (state: any) => {
		this.overdrive.setState(state.overdrive)
		this.filter.setState(state.filter)
		this.oscillators.setState(state.oscs)
	}

	onMIDIMessage = (data: any) => {
		const type = data[0] & 0xf0
		const note = data[1]

		switch (type) {
			case CONSTANTS.MIDI_EVENT.NOTE_ON:
				this.filter.noteOn()
				break
			case CONSTANTS.MIDI_EVENT.NOTE_OFF:
				this.filter.noteOff()
				break
		}
	}
}
