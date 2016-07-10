module Main.View exposing (view)

import Main.Model as Model exposing (Model)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class)
import Main.Update as Update
import Component.Foo exposing (foo)
import Container.Bar.View as BarView


view : Model -> Html Update.Msg
view model =
    div [ class "view" ]
        [ foo
        , BarView.bar Update.BarMsg model.bar
        ]
