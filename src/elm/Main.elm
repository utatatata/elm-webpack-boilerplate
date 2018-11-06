module Main exposing (main)

import Browser exposing (Document)
import Html exposing (..)


type alias Model =
    { greeting : String
    }



-- MODEL


init : String -> ( Model, Cmd Msg )
init greeting =
    ( { greeting = greeting
      }
    , Cmd.none
    )



-- VIEW


view : Model -> Document Msg
view model =
    { title = "Elm Webpack Boilerplate"
    , body =
        [ div []
            [ text "Hello" ]
        ]
    }



-- UPDATE


type Msg
    = None


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( None, _ ) ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- MAIN


main : Program String Model Msg
main =
    Browser.document
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
