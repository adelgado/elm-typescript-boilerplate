module Preset exposing (..)

import Midi exposing (..)

type alias Preset =
    { name : String
    , presetId : Int
    , oscs :
        { osc1 :
            { waveformType : String
            , fmAmount : MidiValue
            }
        , pw : MidiValue
        , mix : MidiValue
        }
    , overdrive : Bool
    }
