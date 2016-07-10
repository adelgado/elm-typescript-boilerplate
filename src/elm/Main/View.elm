module Main.View exposing (view)

import Main.Model as Model exposing (Model)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import Container.OnScreenKeyboard.View as KbdView
import Container.Panel.View as PanelView
import Main.Update as Update


view : Model -> Html Update.Msg
view model =
    div [ class "dashboard" ]
        [ PanelView.panel Update.PanelMsg
            model.panel
        , KbdView.keyboard Update.OnScreenKeyboardMsg
            model.onScreenKeyboard
        ]
