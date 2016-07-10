module Container.Bar.View exposing (keyboard)

import Html exposing (Html, div, ul, li)
import Html.Events
import Html.Attributes exposing (class)
import Html.App
import Container.Bar.Model as Model exposing (Model)
import Container.Bar.Update as Update exposing (Msg)
import String
import Midi


view : Model -> Html Msg
view model =
    let
        keys =
            List.map3 (key model)
                onScreenKeyboardKeys
                [0..127]
                Midi.midiNoteOctaves
    in
        div [ class "virtual-keyboard" ]
            [ ul
                [ class "keyboard"
                , Html.Events.onMouseDown Update.MouseDown
                ]
                keys
            ]
