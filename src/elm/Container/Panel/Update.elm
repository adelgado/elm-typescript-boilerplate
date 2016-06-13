module Container.Panel.Update exposing (..)

--where

import Container.Panel.Model as Model exposing (..)
import Components.Knob as Knob
import Port exposing (..)


type Msg
    = Oscillator1WaveformChange OscillatorWaveform
    | Oscillator2WaveformChange OscillatorWaveform
    | Oscillator2SemitoneChange Knob.Msg
    | Oscillator2DetuneChange Knob.Msg
    | FMAmountChange Knob.Msg
    | PulseWidthChange Knob.Msg
    | OscillatorsMixChange Knob.Msg
    | MasterVolumeChange Knob.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        updateMap childUpdate childMsg getChild reduxor msg' =
            let
                ( updatedChildModel, childCmd ) =
                    childUpdate childMsg (getChild model)
            in
                ( reduxor updatedChildModel model
                , Cmd.map msg' childCmd
                )
    in
        case msg of
            MasterVolumeChange subMsg ->
                updateMap Knob.update
                    subMsg
                    .masterVolumeKnob
                    setMasterVolume
                    MasterVolumeChange

            OscillatorsMixChange subMsg ->
                updateMap Knob.update
                    subMsg
                    .oscillatorsMixKnob
                    setOscillatorsMix
                    OscillatorsMixChange

            Oscillator2SemitoneChange subMsg ->
                updateMap Knob.update
                    subMsg
                    .oscillator2SemitoneKnob
                    setOscillator2Semitone
                    Oscillator2SemitoneChange

            Oscillator2DetuneChange subMsg ->
                updateMap Knob.update
                    subMsg
                    .oscillator2DetuneKnob
                    setOscillator2Detune
                    Oscillator2DetuneChange

            FMAmountChange subMsg ->
                updateMap Knob.update
                    subMsg
                    .fmAmountKnob
                    setFmAmount
                    FMAmountChange

            PulseWidthChange subMsg ->
                updateMap Knob.update
                    subMsg
                    .pulseWidthKnob
                    setPulseWidth
                    PulseWidthChange

            Oscillator1WaveformChange waveform ->
                ( setOscillator1Waveform model waveform
                , toString waveform |> oscillator1WaveformPort
                )

            Oscillator2WaveformChange waveform ->
                ( setOscillator2Waveform model waveform
                , toString waveform |> oscillator2WaveformPort
                )
