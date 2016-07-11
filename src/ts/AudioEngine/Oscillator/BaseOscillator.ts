export type WaveformType = string

export class BaseOscillator {

	public output: GainNode
	public voiceGains: Array<GainNode>
	public frequencyGains: Array<GainNode>
	public kbdTrack: boolean
	public voices: any
	public fmAmount: GainNode
	public type: string

	protected context: AudioContext

	constructor(context: AudioContext, waveformType: WaveformType) {
		this.context = context
		this.output = this.context.createGain()
		this.output.gain.value = .5
		this.voices = {}
		this.voiceGains = []
		this.frequencyGains = []
		this.kbdTrack = true
		this.type = waveformType

		for (let i = 0; i < 128; i++) {
			//TODO: create FM osc and let it holdd the gains,
			// instead of the modular like it is
			this.frequencyGains[i] = this.context.createGain()
			this.voiceGains[i] = this.context.createGain()
			this.voiceGains[i].connect(this.output)
		}
	}

	panic = () => {
		for (let midiNote in this.voices) {
			if (this.voices.hasOwnProperty(midiNote)) {
				this.voices[midiNote].stop()
			}
		}
	}

	frequencyFromNoteNumber = (note: number) => {
		const note_: number = this.kbdTrack ? note : 60
		return 440 * Math.pow(2, (note_ - 69) / 12)
	}

	noteOn = (midiNote: number, noteOnAmpCB: any) => {
		const midiNoteKey = midiNote.toString()
		const now = this.context.currentTime

		if (midiNoteKey in this.voices) {
			this.voices[midiNoteKey].stop(now)
			this.frequencyGains[midiNote].disconnect()
			this.voices[midiNoteKey].disconnect()

			delete this.voices[midiNoteKey]
		}

		this.voices[midiNoteKey].onended = () => {
			this.voices[midiNoteKey].disconnect()
			delete this.voices[midiNoteKey]
		}
		this.voices[midiNoteKey].start(now)

		if (noteOnAmpCB) {
			noteOnAmpCB(this.voiceGains[midiNote].gain)
		}
	}

	noteOff = (midiNote: number, noteOffAmpCB: any) => {
		const midiNoteKey = midiNote.toString()
		const osc = this.voices[midiNoteKey]

		if (!osc) {
			return
		}

		const voiceGain = this.voiceGains[midiNote].gain
		const releaseTime = noteOffAmpCB(voiceGain)

		osc.stop(releaseTime)
	}

	public setSemitone(semitone: number): void { }
	public setDetune(detune: number): void { }
	public setPulseWidth(pw: number): void { }
	public setWaveform(waveform: string): void { }

}
