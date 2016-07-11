module Main.Update exposing (Msg(..), update)

import Container.Panel.Update as PanelUpdate
import Container.Panel.Update as PanelUpdate
import Main.Model as Model
import Port
import Preset


type Msg
    = PanelMsg PanelUpdate.Msg
    | OnMidiStateChange Bool
    | NextPreset
    | PreviousPreset
    | PresetChange Preset.Preset


update : Msg -> Model.Model -> ( Model.Model, Cmd Msg )
update msg model =
    case msg of
        NextPreset ->
            ( model, {} |> Port.nextPreset )

        PreviousPreset ->
            ( model, {} |> Port.previousPreset )

        PresetChange preset ->
            let
                initModel =
                    Model.init preset model.midiSupport

                model' =
                    { initModel
                        | midiConnected = model.midiConnected
                    }
            in
                ( model', Cmd.none )

        PanelMsg subMsg ->
            let
                ( updatedPanel, panelCmd ) =
                    PanelUpdate.update subMsg model.panel
            in
                ( Model.updatePanel updatedPanel model
                , Cmd.map PanelMsg panelCmd
                )

        OnMidiStateChange state ->
            ( { model | midiConnected = state }, Cmd.none )
