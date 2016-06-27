import BaseOscillator from './BaseOscillator'

export default class NoiseOscillator extends BaseOscillator {

	constructor (context) {
		super(context)

		this.type = 'whitenoise'
	}

	noteOn = (midiNote) => {
		const midiNoteKey = midiNote.toString()

		if (midiNoteKey in this.oscillators) {
			return
		}

		const channels = 2
		// Create an empty two-second stereo buffer at the
		// sample rate of the AudioContext
		const frameCount = this.context.sampleRate * 2.0

		const myArrayBuffer =
			this.context.createBuffer(2, frameCount, this.context.sampleRate)


		for (let channel = 0; channel < channels; channel++) {
			// This gives us the actual ArrayBuffer that contains the data
			const nowBuffering = myArrayBuffer.getChannelData(channel)
			for (let i = 0; i < frameCount; i++) {
				// Math.random() is in [0; 1.0]
				// audio needs to be in [-1.0; 1.0]
				nowBuffering[i] = Math.random() * 2 - 1
			}
		}

		const noiseOsc = this.context.createBufferSource()
		noiseOsc.buffer = myArrayBuffer
		noiseOsc.loop = true
		noiseOsc.onended = () => {
			delete this.oscillators[midiNoteKey]
		}

		const gain = this.oscillatorGains[midiNoteKey]
		noiseOsc.connect(gain)
		noiseOsc.connect(this.frequencyGains[midiNote].gain)
		gain.connect(this.output)
		noiseOsc.start(this.context.currentTime)
		this.oscillators[midiNoteKey] = noiseOsc
	}

}