import FMOscillator from './Oscillator/FMOscillator'
import PulseOscillator from './Oscillator/PulseOscillator'
import NoiseOscillator from './Oscillator/NoiseOscillator'
import ADSR from './ADSR'
import MIDI from './MIDI'
import CONSTANTS from '../Constants'

export default class Synth {
	constructor () {
		this.context = new AudioContext

		this.state = {
			filter: {
				frequency: 12000,
				type: CONSTANTS.FILTER_TYPE.LOWPASS,
				Q: 0,
				amp: new ADSR(this.context, 0, .5, .7, .2, 0),
				distortion : false
			}, 
			amp: new ADSR(this.context, 0, .5, .7, .2, 1),
			oscs: {
				osc1: {
					waveformType: CONSTANTS.WAVEFORM_TYPE.SINE,
					gain: .5,
					fmGain : 0
				},
				osc2: {
					waveformType: CONSTANTS.WAVEFORM_TYPE.TRIANGLE,
					gain: .5,
					semitone: 0,
					detune: 0,
					kbdTrack: true
				},
				pw: 0
			}
		}

		this.initializeMasterOutput()

		this.initializeFilter()

		this.oscillator1 = new FMOscillator(this.context,
			this.state.oscs.osc1.waveformType)

		this.oscillator2 = new FMOscillator(this.context,
			this.state.oscs.osc2.waveformType)

		this.initializeOscillatorsGain()

		this.initializeFMGain()		

	}

	initializeMasterOutput = () => {
		this.masterVolume = this.context.createGain()

		this.masterVolume.gain.value = .1 // this.state.amp.level
		this.masterVolume.connect(this.context.destination)
	}

	initializeFilter = () => {
		this.filter = this.context.createBiquadFilter()
		this.filter.type = this.state.filter.type
		this.filter.frequency.value = this.state.filter.frequency
		this.filter.Q.value = this.state.filter.Q

		this.filter.connect(this.masterVolume)
	}

	initializeOscillatorsGain = () => {
		this.oscillator1Gain = this.context.createGain()
		this.oscillator1Gain.gain.value = this.state.oscs.osc1.gain
		this.oscillator1Gain.connect(this.filter)
		this.oscillator1.connect(this.oscillator1Gain)

		this.oscillator2Gain = this.context.createGain()
		this.oscillator2Gain.gain.value = this.state.oscs.osc2.gain
		this.oscillator2Gain.connect(this.filter)
		this.oscillator2.connect(this.oscillator2Gain)
	}

	initializeFMGain = () => {
		this.fmGains = []

		for (let i = 0; i < 128; i++) {
			this.fmGains[i] = this.context.createGain()
			this.fmGains[i].gain.value = this.state.oscs.osc1.fmGain

			//TODO : MOVE FM GAIN TO OSC CLASS
			this.oscillator2.oscillatorGains[i].connect(this.fmGains[i])
			this.fmGains[i].connect(this.oscillator1.frequencyGains[i])
		}
	}

	onMIDIMessage = (data) => {
		//console.log(data)
		// var cmd = data[0] >> 4
		// var channel = data[0] & 0xf		
		// channel agnostic message type
		const type = data[0] & 0xf0
		const note = data[1]
		const velocity = data[2]
		//debugger

		switch (type) {
			case CONSTANTS.MIDI_EVENT.NOTE_ON:
				this.noteOn(note, velocity)
				break
			case CONSTANTS.MIDI_EVENT.NOTE_OFF:
				this.noteOff(note, velocity)
				break
		}
	}

	noteOn = (midiNote /*, velocity*/) => {
		this.oscillator1.noteOn(midiNote, this.state.amp.on)
		this.oscillator2.noteOn(midiNote, this.state.amp.on)
		//this.state.filter.amp.on(this.filter.frequency)
		
	}

	noteOff = (midiNote /*, velocity*/) => {
		this.oscillator1.noteOff(midiNote, this.state.amp.off)
		this.oscillator2.noteOff(midiNote, this.state.amp.off)
		//const now = this.context.currentTime
		//this.masterVolume.gain.linearRampToValueAtTime(0.1, now + 2)
	}

	panic = () => {
		this.oscillator1.panic()
		this.oscillator2.panic()
	}

	setMasterVolumeGain = (midiValue) => {
		const vol =  MIDI.logScaleToMax(midiValue, 1)
		this.state.amp.level = vol
		this.masterVolume.gain.value = vol
	}

	setOscillatorsBalance = (oscillatorsBalance) => {
		const gainPercentage = Math.abs(oscillatorsBalance) / 100
		this.oscillator1Gain.gain.value = .5
		this.oscillator2Gain.gain.value = .5

		if (oscillatorsBalance > 0) {
			this.oscillator1Gain.gain.value -= gainPercentage
			this.oscillator2Gain.gain.value += gainPercentage
		} else if (oscillatorsBalance < 0) {
			this.oscillator1Gain.gain.value += gainPercentage
			this.oscillator2Gain.gain.value -= gainPercentage
		}
		this.state.oscs.osc1.gain = this.oscillator1Gain.gain.value
		this.state.oscs.osc2.gain = this.oscillator2Gain.gain.value
	}

	setOscillator2Semitone = (oscillatorSemitone) => {
		this.state.oscs.osc2.semitone = oscillatorSemitone
		this.oscillator2.setSemitone(oscillatorSemitone)
	}

	setOscillator2Detune = (oscillatorDetune) => {
		this.state.oscs.osc2.detune = oscillatorDetune
		this.oscillator2.setDetune(oscillatorDetune)
	}

	setFmAmount = (fmAmount) => {
		const amount = 10 * fmAmount
		
		this.state.oscs.osc1.fmGain = amount
		for (let i = 0; i < CONSTANTS.MAX_NOTES ; i++) {
			this.fmGains[i].gain.value = amount
		}
	}

	setPulseWidth = (midiValue) => {
		const pw = MIDI.logScaleToMax(midiValue, .9)

		this.state.oscs.pw = pw
		this.oscillator2.setPulseWidth(pw)
	}

	setOscillator1Waveform = (waveform) => {
		const nextWaveform = waveform.toLowerCase()

		if (CONSTANTS.OSC1_WAVEFORM_TYPES.indexOf(nextWaveform) == -1) {
			throw new Error(`Invalid Waveform Type ${nextWaveform}`)
		}

		this.oscillator1.setWaveform(nextWaveform)
	}
		
	toggleOsc2KbdTrack = (state) => {
		this.state.oscs.osc2.kbdTrack = state
		this.oscillator2.setKbdTrack(state)
	}	
	
	setOscillator2Waveform = (waveform) => {

		const nextWaveform = waveform.toLowerCase()

		if (CONSTANTS.OSC2_WAVEFORM_TYPES.indexOf(nextWaveform) == -1) {
			throw new Error(`Invalid Waveform Type ${nextWaveform}`)
		}

		if (this.oscillator2.type !== CONSTANTS.WAVEFORM_TYPE.NOISE
				&& nextWaveform !== CONSTANTS.WAVEFORM_TYPE.NOISE) {

			if (nextWaveform ===  CONSTANTS.WAVEFORM_TYPE.SQUARE) {
				this.swapOsc2(new PulseOscillator(this.context),
					this.oscillator2Gain)
			}
			else {
				this.oscillator2.setWaveform(nextWaveform)
			}
		}
		else if(this.oscillator2.type !== CONSTANTS.WAVEFORM_TYPE.NOISE
				&& nextWaveform === CONSTANTS.WAVEFORM_TYPE.NOISE) {

			this.swapOsc2(new NoiseOscillator(this.context),
				this.oscillator2Gain)
		}
		else if(this.oscillator2.type === CONSTANTS.WAVEFORM_TYPE.NOISE
				&& nextWaveform !== CONSTANTS.WAVEFORM_TYPE.NOISE) {
			this.swapOsc2(
				new FMOscillator(this.context, nextWaveform),
				this.oscillator2Gain
			)
		}
		this.state.oscs.osc2.waveformType = nextWaveform
	}

	swapOsc2 = (osc, gainB) => {
		const now = this.context.currentTime
		for (const midiNote in this.oscillator2.oscillators) {
			if (this.oscillator2.oscillators.hasOwnProperty(midiNote)) {
				osc.noteOn(midiNote)
				this.oscillator2.noteOff(now, midiNote)
			}
		}
		this.oscillator2 = osc
		this.oscillator2.setPulseWidth(this.state.oscs.pw)
		this.oscillator2.setDetune(this.state.oscs.osc2.detune)
		this.oscillator2.setKbdTrack(this.state.oscs.osc2.kbdTrack)
		this.oscillator2.setSemitone(this.state.oscs.osc2.semitone)

		this.oscillator2.oscillatorGains.map((oscGain, i) =>
			oscGain.connect(this.fmGains[i])
		)
		this.oscillator2.connect(gainB)
	}

	//god this is ugly
	swapOsc1 = (osc, gainB) => {
		const now = this.context.currentTime
		for (const midiNote in this.oscillator1.oscillators) {
			if (this.oscillator1.oscillators.hasOwnProperty(midiNote)) {
				osc.noteOn(midiNote)
				this.oscillator1.noteOff(now, midiNote)
			}
		}
		this.oscillator1 = osc
		this.oscillator1.oscillatorGains.map((oscGain, i) =>
			oscGain.connect(this.fmGains[i])
		)
		this.oscillator1.connect(gainB)
	}


	setFilterCutoff = (midiValue) => {		
		this.filter.frequency.value = MIDI.toFilterCutoffFrequency(midiValue)
	}

	setFilterQ = (midiValue) => {
		this.filter.Q.value = MIDI.toFilterQAmount(midiValue)
	}

	setFilterType = (filterType) => {
		const filterType_ = filterType.toLowerCase()

		if (CONSTANTS.FILTER_TYPES.indexOf(filterType_) == -1) {
			throw new Error('Invalid Filter Type')
		}

		this.filter.type = filterType_
	}


	toggleFilterDistortion = state => {
		this.state.filter.distortion = state
		console.log(this.state.filter.distortion)
	}
}