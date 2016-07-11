module Container.Panel.Update exposing (Msg(..), update)

import Container.Panel.Model as Model exposing (Model)
import Component.OptionPicker as OptionPicker


type Msg
    = Osc1WaveformChange OptionPicker.Msg

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
            Osc1WaveformChange subMsg ->
                updateMap OptionPicker.update
                    subMsg
                    .osc1WaveformBtn
                    Model.updateOsc1WaveformBtn
                    Osc1WaveformChange
