const Elm: any = require('../elm/Main.elm')

export default class Application {

	private application: ElmComponent<any>

	constructor() {
		this.initializeElmApplication()
		this.initializePorts()
		console.log("TypeScript application constructed")
	}

	private initializeElmApplication () {
		this.application =
			Elm.Main.fullscreen({ exampleInfo: "Hello from TypeScript" })
	}

	private initializePorts () {
		this.application.ports.homerSimpsonPort
			.subscribe(() => {
				this.homerSimpson()
			})

		this.application.ports.bartSimpsonPort
			.subscribe(() => {
				this.bartSimpson()
			})

		// this.application.ports.ampVolume.subscribe(this.synth.amplifier.setMasterVolumeGain)
	}

	homerSimpson = () => {
		// const nextPreset = this.presetManager.next()
		// const synthState = midiSettingsToSynthSettings(nextPreset)
		// this.synth.setState(synthState)
		// this.application.ports.presetChange.send(nextPreset)
	}

	bartSimpson = () => {
		// const previousPreset = this.presetManager.previous()
		// const synthState = midiSettingsToSynthSettings(previousPreset)
		// this.synth.setState(synthState)
		// this.application.ports.presetChange.send(previousPreset)
	}

}
