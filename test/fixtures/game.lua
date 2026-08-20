-- Fixture sintética — NÃO é o game.lua real do jogo.
-- Reproduz só o FORMATO do bloco de definição de baralhos (P_CENTER_POOLS.Back), com nomes e
-- IDs inventados, cobrindo os casos que o parser de BEE-4 precisa lidar. Ver README.md.

return {
    P_CENTER_POOLS = {
        Back = {
            deck_alpha=    {name = "Fixture Deck Alpha",    stake = 1, unlocked = true,  order = 1,  pos = {x=0,y=0}, set = "Back", config = {}, discovered = true},
            deck_bravo=    {name = "Fixture Deck Bravo",    stake = 1, unlocked = false, order = 2,  pos = {x=0,y=2}, set = "Back", config = {dollars = 10}, unlock_condition = {type = 'discover_amount', amount = 20}},
            deck_charlie=  {name = "Fixture Deck Charlie",  stake = 1, unlocked = false, order = 3,  pos = {x=1,y=2}, set = "Back", config = {joker_slot = 1}, unlock_condition = {type = 'discover_amount', amount = 50}},
            deck_delta=    {name = "Fixture Deck Delta",    stake = 1, unlocked = false, order = 4,  pos = {x=2,y=2}, set = "Back", config = {consumable_slot = -1}, unlock_condition = {type = 'discover_amount', amount = 75}},
            deck_echo=     {name = "Fixture Deck Echo",     stake = 1, unlocked = false, order = 5,  pos = {x=3,y=2}, set = "Back", config = {consumables = {'c_fixture_one', 'c_fixture_one'}}, unlock_condition = {type = 'discover_amount', amount = 100}},
            deck_foxtrot=  {name = "Fixture Deck Foxtrot",  stake = 1, unlocked = false, order = 6,  pos = {x=0,y=3}, set = "Back", config = {dollars = 25, joker_slot = 2, consumable_slot = 1}, unlock_condition = {type = 'win_deck', deck = 'deck_alpha'}},
            deck_golf=     {name = "Fixture Deck Golf",     stake = 1, unlocked = false, order = 7,  pos = {x=3,y=0}, set = "Back", config = {hands = -1, joker_slot = 1}, unlock_condition = {type = 'win_deck', deck = 'deck_bravo'}},
            deck_hotel=    {name = "Fixture Deck Hotel",    stake = 1, unlocked = false, order = 8,  pos = {x=6,y=2}, set = "Back", config = {discards = 2}, unlock_condition = {type = 'win_deck', deck = 'deck_charlie'}},
            deck_india=    {name = "Fixture Deck India",    stake = 1, unlocked = false, order = 9,  pos = {x=3,y=3}, set = "Back", config = {some_unknown_flag = true}, unlock_condition = {type = 'win_deck', deck = 'deck_delta'}},
            deck_juliet=   {name = "Fixture Deck Juliet",   stake = 1, unlocked = false, order = 10, pos = {x=1,y=3}, set = "Back", config = {voucher = 'v_fixture_voucher'}, unlock_condition = {type = 'win_deck', deck = 'deck_echo'}},
            deck_kilo=     {name = "Fixture Deck Kilo",     stake = 1, unlocked = false, order = 11, pos = {x=3,y=4}, set = "Back", config = {dollars = -5}, unlock_condition = {type = 'win_stake', stake = 2}},
            deck_lima=     {name = "Fixture Deck Lima",     stake = 1, unlocked = false, order = 12, pos = {x=4,y=3}, set = "Back", config = {consumables = {'c_fixture_two'}}, unlock_condition = {type = 'win_stake', stake = 3}},
            deck_mike=     {name = "Fixture Deck Mike",     stake = 1, unlocked = false, order = 13, pos = {x=2,y=4}, set = "Back", config = {hand_size = 2, joker_slot = -1}, unlock_condition = {type = 'win_stake', stake = 4}},
            deck_november= {name = "Fixture Deck November", stake = 1, unlocked = false, order = 14, pos = {x=4,y=2}, set = "Back", config = {}, unlock_condition = {type = 'win_stake', stake = 5}},
            deck_oscar=    {name = "Fixture Deck Oscar",    stake = 1, unlocked = false, order = 15, pos = {x=2,y=3}, set = "Back", config = {ante_scaling = 2}, unlock_condition = {type = 'win_stake', stake = 7}},
            deck_challenge={name = "Fixture Challenge Deck",stake = 1, unlocked = true,  order = 16, pos = {x=0,y=4}, set = "Back", config = {}, omit = true},
        },
        Tarot = {
            c_fixture_tarot_one=    {name = "The Fixture Fool", order = 1, discovered = false, cost = 3, pos = {x=0,y=0}, set = "Tarot", consumeable = true},
            c_fixture_tarot_two=    {name = "The Fixture Star", order = 2, discovered = false, cost = 3, pos = {x=1,y=0}, set = "Tarot", consumeable = true},
        },
        Planet = {
            c_fixture_planet_one=   {name = "Fixture Mercury",  order = 1, discovered = false, cost = 3, pos = {x=0,y=3}, set = "Planet", consumeable = true},
            c_fixture_planet_two=   {name = "Fixture Venus",    order = 2, discovered = false, cost = 3, pos = {x=1,y=3}, set = "Planet", consumeable = true},
        },
        Spectral = {
            c_fixture_spectral_one= {name = "Fixture Wraith",     order = 1, discovered = false, cost = 4, pos = {x=0,y=5}, set = "Spectral", consumeable = true},
            c_fixture_spectral_two= {name = "Fixture Ectoplasm",  order = 2, discovered = false, cost = 4, pos = {x=1,y=5}, set = "Spectral", consumeable = true},
        },
    },
}
