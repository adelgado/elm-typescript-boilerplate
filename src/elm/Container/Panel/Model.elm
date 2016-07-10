module Container.Panel.Model
    exposing
        ( FilterType(..)
        , Model
        , OscillatorWaveform(..)
        , init
        , updateOverdriveSwitch
        , updateOsc2KbdTrack
        , updateFilterTypeBtn
        , updateOsc2WaveformBtn
        , updateOsc1WaveformBtn
        )

import Component.Switch as Switch
import Component.OptionPicker as OptionPicker
import Port
import Preset


type OscillatorWaveform
    = Sawtooth
    | Triangle
    | Sine
    | Square
    | Pulse
    | WhiteNoise


createOscillatorWaveform : String -> OscillatorWaveform
createOscillatorWaveform name =
    case name of
        "sawtooth" ->
            Sawtooth

        "triangle" ->
            Triangle

        "sine" ->
            Sine

        "square" ->
            Square

        "whitenoise" ->
            WhiteNoise

        _ ->
            Debug.crash <| "invalid waveform " ++ (toString name)


type FilterType
    = Lowpass
    | Highpass
    | Bandpass
    | Notch


createFilterType : String -> FilterType
createFilterType name =
    case name of
        "lowpass" ->
            Lowpass

        "highpass" ->
            Highpass

        "bandpass" ->
            Bandpass

        "notch" ->
            Notch

        _ ->
            Debug.crash <| "invalid filter type " ++ (toString name)


type alias Model =
    { filterTypeBtn : OptionPicker.Model FilterType
    , osc2WaveformBtn : OptionPicker.Model OscillatorWaveform
    , osc1WaveformBtn : OptionPicker.Model OscillatorWaveform
    , osc2KbdTrackSwitch : Switch.Model
    , overdriveSwitch : Switch.Model
    }


init : Preset.Preset -> Model
init preset =
    { osc2KbdTrackSwitch =
        Switch.init preset.oscs.osc2.kbdTrack Port.osc2KbdTrack
    , overdriveSwitch =
        Switch.init preset.overdrive Port.overdrive
    , filterTypeBtn =
        OptionPicker.init Port.filterType
            (createFilterType preset.filter.type_)
            [ ( "LP", Lowpass )
            , ( "HP", Highpass )
            , ( "BP", Bandpass )
            , ( "notch", Notch )
            ]
    , osc1WaveformBtn =
        OptionPicker.init Port.osc1Waveform
            (createOscillatorWaveform preset.oscs.osc1.waveformType)
            [ ( "sin", Sine )
            , ( "tri", Triangle )
            , ( "saw", Sawtooth )
            , ( "sqr", Square )
            ]
    , osc2WaveformBtn =
        OptionPicker.init Port.osc2Waveform
            (createOscillatorWaveform preset.oscs.osc2.waveformType)
            [ ( "tri", Triangle )
            , ( "saw", Sawtooth )
            , ( "pulse", Pulse )
            , ( "noise", WhiteNoise )
            ]
    }


updateOsc1WaveformBtn : OptionPicker.Model OscillatorWaveform -> Model -> Model
updateOsc1WaveformBtn btn model =
    { model | osc1WaveformBtn = btn }


updateOsc2WaveformBtn : OptionPicker.Model OscillatorWaveform -> Model -> Model
updateOsc2WaveformBtn btn model =
    { model | osc2WaveformBtn = btn }


updateOsc2KbdTrack : Switch.Model -> Model -> Model
updateOsc2KbdTrack switch model =
    { model | osc2KbdTrackSwitch = switch }


updateFilterTypeBtn : OptionPicker.Model FilterType -> Model -> Model
updateFilterTypeBtn btn model =
    { model | filterTypeBtn = btn }


updateOverdriveSwitch : Switch.Model -> Model -> Model
updateOverdriveSwitch switch model =
    { model | overdriveSwitch = switch }
