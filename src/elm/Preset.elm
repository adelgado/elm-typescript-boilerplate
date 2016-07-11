module Preset exposing (..)

type alias Preset =
    { name : String
    , presetId : Int
    , oscs :
        { osc1 :
            { waveformType : String
            }
        }
    , overdrive : Bool
    }
