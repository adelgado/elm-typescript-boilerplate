module Component.Hello exposing (foo)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)


foo : Html msg
foo =
    div
        [ class "foo" ]
        [ text "Hello from Foo!" ]
