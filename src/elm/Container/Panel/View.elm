module Container.Panel.View exposing (panel)

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


osc1 : Model -> Html Msg
osc1 model =
    div [ class "oscillators__osc1" ]
        [ OptionPicker.optionPicker "Waveform"
            Update.Osc1WaveformChange
            model.osc1WaveformBtn
        ]


view : Model -> Html Msg
view model =
    div [ class "panel-controls" ]
        [ column
            [ osc1 model ] ]


panel : (Msg -> a) -> Model -> Html a
panel panelMsg model =
    Html.App.map panelMsg
        <| view model
