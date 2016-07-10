module Container.Panel.View exposing (panel)

import Component.Switch as Switch
import Component.OptionPicker as OptionPicker
import Html exposing (Html, div, span, text, table, tr, td)
import Html.Attributes exposing (class)
import Html.App
import Container.Panel.Model as Model exposing (Model)
import Container.Panel.Update as Update exposing (Msg)


type Bevel
    = WithBevel
    | WithoutBevel


section : Bevel -> String -> List (Html a) -> Html a
section bevelType title content =
    let
        sectionClass =
            case bevelType of
                WithBevel ->
                    "section section--with-bevel"

                WithoutBevel ->
                    "section"
    in
        div [ class sectionClass ]
            [ div [ class "section__title" ]
                [ text title ]
            , div [ class "section__content" ] content
            ]


column : List (Html a) -> Html a
column content =
    div [ class "panel-controls__column" ] content


amplifier : Model -> Html Msg
amplifier model =
    section WithoutBevel
        "amplifier" [ ]


filter : Model -> Html Msg
filter model =
    section WithoutBevel
        "filter" []


osc1 : Model -> Html Msg
osc1 model =
    div [ class "oscillators__osc1" ]
        [ OptionPicker.optionPicker "Waveform"
            Update.Osc1WaveformChange
            model.osc1WaveformBtn
        , span [ class "oscillators__label" ] [ text "OSC 1" ]
        ]


osc2 : Model -> Html Msg
osc2 model =
    div [ class "oscillators__osc2" ]
        [ OptionPicker.optionPicker "Waveform"
            Update.Osc2WaveformChange
            model.osc2WaveformBtn
        , span [ class "oscillators__label" ] [ text "OSC 2" ]
        , Switch.switch "kbd track"
            Update.Osc2KbdTrackToggle
            model.osc2KbdTrackSwitch
        ]


oscillatorSection : Model -> Html Msg
oscillatorSection model =
    section WithBevel
        "oscillators"
        [ osc1 model
        , osc2 model
        , div [ class "oscillators__extra" ]
            []
        ]


view : Model -> Html Msg
view model =
    div [ class "panel-controls" ]
        [ column [ oscillatorSection model ]
        , column
            [ amplifier model
            , filter model
            ]
        , instructions
        ]


panel : (Msg -> a) -> Model -> Html a
panel panelMsg model =
    Html.App.map panelMsg
        <| view model


instructions : Html a
instructions =
    let
        hotKeys =
            [ "Z"
            , "X"
            , "C"
            , "V"
            , "A"
            , "W"
            , "S"
            , "E"
            , "D"
            , "F"
            , "T"
            , "G"
            , "Y"
            , "H"
            , "U"
            , "J"
            , "K"
            , "O"
            , "L"
            , "P"
            ]

        instructions =
            [ "octave down", "octave up", "velocity down", "velocity up" ]
                ++ (List.map ((++) "play ")
                        [ "C"
                        , "C#"
                        , "D"
                        , "D#"
                        , "E"
                        , "F"
                        , "F#"
                        , "G"
                        , "G#"
                        , "A"
                        , "A#"
                        , "B"
                        , "C 8va"
                        , "C# 8va"
                        , "D 8va"
                        , "D# 8va"
                        ]
                   )
    in
        div [ class "panel-controls__instructions" ]
            [ span [ class "instructions__title" ] [ text "INSTRUCTIONS" ]
            , table [ class "instructions" ]
                <| List.map2
                    (\hotkey instruction ->
                        tr [ class "instructions__entry" ]
                            [ td [] [ text hotkey ]
                            , td [ class "instructions__label" ] [ text instruction ]
                            ]
                    )
                    hotKeys
                    instructions
            ]
