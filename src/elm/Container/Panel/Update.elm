module Container.Panel.Update exposing (..)

--where

import Container.Panel.Model as Model exposing (..)
import Component.Knob as Knob
import Component.NordButton as Button


type Msg
    = Oscillator1WaveformChange Button.Msg
    | Oscillator2WaveformChange Button.Msg
    | FilterTypeChange Button.Msg
    | MouseUp
    | MouseMove Int


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

        updateKnobs : Msg -> Knob.Msg -> ( Model, Cmd Msg )
        updateKnobs  msg' knobMsg =
            let
                ( knobs, cmds ) =
                    List.unzip
                        <| List.map
                            --(Knob.update << knobMsg)
                            (\knob -> Knob.update knobMsg knob)
                            model.knobs
            in
                ( { model | knobs = knobs }
                , Cmd.map (always msg') <| Cmd.batch cmds
                )
    in
        case msg of
            Oscillator1WaveformChange subMsg ->
                updateMap Button.update
                    subMsg
                    .oscillator1WaveformBtn
                    updateOscillator1WaveformBtn
                    Oscillator1WaveformChange

            Oscillator2WaveformChange subMsg ->
                updateMap Button.update
                    subMsg
                    .oscillator2WaveformBtn
                    updateOscillator2WaveformBtn
                    Oscillator2WaveformChange

            FilterTypeChange subMsg ->
                updateMap Button.update
                    subMsg
                    .filterTypeBtn
                    updateFilterTypeBtn
                    FilterTypeChange

            MouseUp ->
                updateKnobs MouseUp Knob.MouseUp
 

            MouseMove yPos ->
                updateKnobs (MouseMove yPos) (Knob.MouseMove yPos)
