port module Port exposing (..)

import Preset exposing (..)


port midiStateChange : (Bool -> msg) -> Sub msg


port panic : ({} -> msg) -> Sub msg


port osc1Waveform : String -> Cmd msg


port oscsMix : Int -> Cmd msg


port fmAmount : Int -> Cmd msg

port presetChange : (Preset -> msg) -> Sub msg


port nextPreset : {} -> Cmd msg


port previousPreset : {} -> Cmd msg
