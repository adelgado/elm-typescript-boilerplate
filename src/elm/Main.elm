module Main exposing (main, subscriptions)

import Html.App
import Port
import Main.Model as Model
import Main.Update as Update
import Main.View as View


main : Program Model.InitialFlags
main =
    Html.App.programWithFlags
        { init =
            \flags ->
                ( Model.init flags.preset flags.midiSupport, Cmd.none )
        , view = View.view
        , update = Update.update
        , subscriptions = subscriptions
        }


subscriptions : Model.Model -> Sub Update.Msg
subscriptions model =
    Sub.batch
        [ Port.midiStateChange Update.OnMidiStateChange
        , Port.presetChange <| Update.PresetChange
        ]
