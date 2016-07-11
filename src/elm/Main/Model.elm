module Main.Model
    exposing
        ( init
        , Model
        , InitialFlags
        , updatePanel
        )

import Container.Panel.Model as PanelModel
import Preset


type alias InitialFlags =
    { preset : Preset.Preset
    , midiSupport : Bool
    }


type alias Model =
    { panel : PanelModel.Model
    , midiConnected : Bool
    , midiMsgInLedOn : Bool
    , midiSupport : Bool
    , presetName : String
    , presetId : Int
    }


init : Preset.Preset -> Bool -> Model
init preset midiSupport =
    { panel = PanelModel.init preset
    , midiConnected = False
    , midiMsgInLedOn = False
    , midiSupport = midiSupport
    , presetName = preset.name
    , presetId = preset.presetId
    }


updatePanel : PanelModel.Model -> Model -> Model
updatePanel panel model =
    { model | panel = panel }
