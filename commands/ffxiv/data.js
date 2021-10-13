/*
    IDs from Garland Tools
    
    Has categories for jobs, races, grand company, etc.
    I also imported icons for each of the above into Discord as a global emoji
*/

module.exports = {
    /*
        Items
    */

    // Item Slot Categories
    categoryList: {
        // Tanks
        2: { name: "Gladiator's Arm", emoji: "🗡️" },
        3: { name: "Marauder's Arm", emoji: "🪓" },
        87: { name: "Dark Knight's Arm", emoji: "🗡️" },
        106: { name: "Gunbreaker's Arm", emoji: "🗡️" },

        // Healers
        8: { name: "One-handed Conjurer's Arm", emoji: ":magic_wand:" },
        9: { name: "Two-handed Conjurer's Arm", emoji: "🦯" },
        98: { name: "Scholar's Arm", emoji: "📗" },
        89: { name: "Astrologian's Arm", emoji: "🔮" },

        // Melee DPS
        1: { name: "Pugilist's Arm", emoji: "🥊" },
        5: { name: "Lancer's Arm", emoji: "🔱" },
        84: { name: "Rogue's Arm", emoji: "🗡️" },
        96: { name: "Samurai's Arm", emoji: "🗡️" },

        // Physical Ranged DPS
        4: { name: "Archer's Arm", emoji: "🏹" },
        88: { name: "Machinist's Arm", emoji: "🔫" },
        107: { name: "Dancer's Arm", emoji: "📀" },

        // Magic Ranged DPS
        6: { name: "One-handed Thaumaturge's Arm", emoji: ":magic_wand:" },
        7: { name: "Two-handed Thaumaturge's Arm", emoji: "🦯" },
        10: { name: "Arcanist's Grimoire", emoji: "📕" },
        97: { name: "Red Mage's Arm", emoji: "🦯" },
        105: { name: "Blue Mage's Arm", emoji: "🦯" },

        // Crafters
        24: { name: "Alchemist's Primary Tool", emoji: "💡" },
        25: { name: "Alchemist's Secondary Tool", emoji: "🏺" },
        16: { name: "Armorer's Primary Tool", emoji: "🔨" },
        17: { name: "Armorer's Secondary Tool", emoji: "🔧" },
        14: { name: "Blacksmith's Primary Tool", emoji: "🔨" },
        15: { name: "Blacksmith's Secondary Tool", emoji: "🔧" },
        12: { name: "Carpenters's Primary Tool", emoji: ":carpentry_saw:" },
        13: { name: "Carpenters's Secondary Tool", emoji: "🔨" },
        26: { name: "Culinarian's Primary Tool", emoji: "🍳" },
        27: { name: "Culinarian's Secondary Tool", emoji: "🔪" },
        18: { name: "Goldsmith's Primary Tool", emoji: "🔨" },
        19: { name: "Goldsmith's Secondary Tool", emoji: ":manual_wheelchair:" },
        18: { name: "Leatherworkers's Primary Tool", emoji: "🔪" },
        20: { name: "Leatherworkers's Secondary Tool", emoji: "🧹" },
        22: { name: "Weaver's Primary Tool", emoji: ":sewing_needle:" },
        23: { name: "Weaver's Secondary Tool", emoji: ":manual_wheelchair:" },

        // Gatherers
        30: { name: "Botanist's Primary Tool", emoji: "🪓" },
        31: { name: "Botanist's Secondary Tool", emoji: "🪒" },
        32: { name: "Fisher's Primary Tool", emoji: "🎣" },
        33: { name: "Fisher's Secondary Tool", emoji: "🔱" },
        28: { name: "Miner's Primary Tool", emoji: "⛏️" },
        29: { name: "Miner's Secondary Tool", emoji: "🔨" },

        // Armour
        34: { name: "Head", emoji: "👒" },
        43: { name: "Ring", emoji: "💍" },
        35: { name: "Body", emoji: "🧥" },
        37: { name: "Hands", emoji: "🧤" },
        39: { name: "Waist", emoji: "👖" },
        36: { name: "Legs", emoji: "👖" },
        38: { name: "Feet", emoji: "👟" },

        // Crafted
        44: { emoji: "🧪" }, // ALC
        46: { emoji: "🍔" }, // CUL
        48: { emoji: ":rock:" }, // ???
        49: { emoji: "🔨" }, // BSM

        // Other
        81: { name: "Minion", emoji: "🧸" },
        86: { name: "Triple Triad Card", emoji: "🃏" }
    },

    // Job Short/Long Hand Names
    jobList: {
        // Tanks
        1: { type: "tank", long: "Gladiator", short: "GLA", jobico: "<:gla:869022501307576390>" },
        19: { type: "tank", long: "Paladin", short: "PLD", jobico: "<:pld:869022501555011644>" },
        3: { type: "tank", long: "Marauder", short: "MRD", jobico: "<:mrd:869022501475323954>" },
        21: { type: "tank", long: "Warrior", short: "WAR", jobico: "<:war:869022501437599795>" },
        32: { type: "tank", long: "Dark Knight", short: "DRK", jobico: "<:drk:869022501366284359>" },
        37: { type: "tank", long: "Gunbreaker", short: "GNB", jobico: "<:gnb:869022501311762442>" },

        // Healers
        6: { type: "healer", long: "Conjurer", short: "CNJ", jobico: "<:cnj:869022501269798922>" },
        24: { type: "healer", long: "White Mage", short: "WHM", jobico: "<:whm:869022501311766559>" },
        28: { type: "healer", long: "Scholar", short: "SCH", jobico: "<:sch:869022501605347378>" },
        33: { type: "healer", long: "Astrologian", short: "AST", jobico: "<:ast:869022501131403304>" },

        // Melee DPS
        2: { type: "melee", long: "Pugilist", short: "PGL", jobico: "<:pgl:869022501546651658>" },
        20: { type: "melee", long: "Monk", short: "MNK", jobico: "<:mnk:869022501441773578>" },
        4: { type: "melee", long: "Lancer", short: "LNC", jobico: "<:lnc:869022501412425790>" },
        22: { type: "melee", long: "Dragoon", short: "DRG", jobico: "<:drg:869022501437571102>" },
        29: { type: "melee", long: "Rogue", short: "ROG", jobico: "<:rog:869022501190127698>" },
        30: { type: "melee", long: "Ninja", short: "NIN", jobico: "<:nin:869022501462761573>" },
        34: { type: "melee", long: "Samurai", short: "SAM", jobico: "<:sam:869022501374668821>" },

        // Physical Ranged DPS
        5: { type: "physical", long: "Archer", short: "ARC", jobico: "<:arc:869022501135581255>" },
        23: { type: "physical", long: "Bard", short: "BRD", jobico: "<:brd:869022501068496906>" },
        31: { type: "physical", long: "Machinist", short: "MCH", jobico: "<:mch:869022501458550855>" },
        38: { type: "physical", long: "Dancer", short: "DNC", jobico: "<:dnc:869022501194334289>" },

        // Magical Ranged DPS
        7: { type: "magical", long: "Thaumaturge", short: "THM", jobico: "<:thm:869022501739573248>" },
        25: { type: "magical", long: "Black Mage", short: "BLM", jobico: "<:blm:869022501110444102>" },
        26: { type: "magical", long: "Arcanist", short: "ACN", jobico: "<:smn:869022501622128710>" },
        27: { type: "magical", long: "Summoner", short: "SMN", jobico: "<:smn:869022501622128710>" },
        35: { type: "magical", long: "Red Mage", short: "RDM", jobico: "<:rdm:869022501714415626>" },
        36: { type: "magical", long: "Blue Mage", short: "BLU", jobico: "<:blu:869022501106229268>" },

        // Crafters
        8: { type: "crafter", long: "Carpenter", short: "CRP", jobico: "<:crp:869022501001388113>" },
        9: { type: "crafter", long: "Blacksmith", short: "BSM", jobico: "<:bsm:869022501139808307>" },
        10: { type: "crafter", long: "Armorer", short: "ARM", jobico: "<:arm:869022501064290344>" },
        11: { type: "crafter", long: "Goldsmith", short: "GSM", jobico: "<:gsm:869050398516854835>" },
        12: { type: "crafter", long: "Leatherworker", short: "LTW", jobico: "<:ltw:869022501416607794>" },
        13: { type: "crafter", long: "Weaver", short: "WVR", jobico: "<:wvr:869022501697617990>" },
        14: { type: "crafter", long: "Alchemist", short: "ALC", jobico: "<:alc:869022501047525396>" },
        15: { type: "crafter", long: "Culinarian", short: "CUL", jobico: "<:cul:869022501181718608>" },

        // Gatherers
        16: { type: "gatherer", long: "Miner", short: "MIN", jobico: "<:min:869022501508886588>" },
        17: { type: "gatherer", long: "Botanist", short: "BTN", jobico: "<:btn:869022501336932432>" },
        18: { type: "gatherer", long: "Fisher", short: "FSH", jobico: "<:fsh:869022501286592552>" },
    },

    // Lord of Verminion
    lovType: {
        "Poppet": "<:poppet:870450353559207947>",
        "Gadget": "<:gadget:870450353424969729>",
        "Monster": "<:monster:870450353399824414>",
        "Critter": "<:critter:870450353068462112>"
    },

    // Market Retainers
    retainerCities: {
        1: "<:retlominsa:868259353428389898>",
        2: "<:retgridania:868259092915957850>",
        3: "<:retuldah:868259353428389898>",
        4: "<:retishgard:868259092949528626>",
        7: "<:retkugane:868259093029216306>",
        10: "<:retcrystarium:868259092949512212>"
    },

    // Achievements
    achievementCategories: {
        17: "Character: Commendation",
        18: "Character: Gold Saucer",
        62: "Items: Relic Weapons",
        64: "Items: Anima Weapons"
    },

    /*
        Player/Character
    */

    // Player races
    playerRaces: {
        1: "Hyur",
        2: "Elezen",
        3: "Lalafell",
        4: "Miqo'te",
        5: "Roegadyn",
        6: "Au Ra",
        7: "Hrothgar",
        8: "Viera"
    },

    // Player race tribes
    playerTribes: {
        1: "Midlander",
        2: "Highlander",
        3: "Wildwood",
        4: "Duskwight",
        5: "Plainsfolk",
        6: "Dunesfolk",
        7: "Seeker of the Sun",
        8: "Keeper of the Moon",
        9: "Sea Wolf",
        10: "Hellsguard",
        11: "Raen",
        12: "Xaela",
        13: "Helion",
        14: "The Lost",
        15: "Rava",
        16: "Veena"
    },

    // Player guardians/the Twelve
    playerGuardian: {
        1: { name: "Halone, the Fury", ico: "<:halone:870433246360522833>" },
        2: { name: "Menphina, the Lover", ico: "<:menphina:870433246054318081>" },
        3: { name: "Thaliak, the Scholar", ico: "<:thaliak:870433246406651954>" },
        4: { name: "Nymeia, the Spinner", ico: "<:nymeia:870433245987217409>" },
        5: { name: "Llymlaen, the Navigator", ico: "<:llymlaen:870433246272430120>" },
        6: { name: "Oschon, the Wanderer", ico: "<:oschon:870433246285004820>" },
        7: { name: "Byregot, the Builder", ico: "<:byregot:870433246251466843>" },
        8: { name: "Rhalgr, the Destroyer", ico: "<:rhalgr:870433246368911460>" },
        9: { name: "Azeyma, the Warden", ico: "<:azeyma:870433246259871784>" },
        10: { name: "Nald'thal, the Trader", ico: "<:naldthal:870433246079488091>" },
        11: { name: "Nophica, the Matron", ico: "<:nophica:870433246264041472>" },
        12: { name: "Althyk, the Keeper", ico: "<:althyk:870433246171783248>" },
    },

    // Player starting city
    playerTown: {
        1: { name: "Limsa Lominsa", icon: "<:citylominsa:868985159477784656>" },
        2: { name: "Gridania", icon: "<:citygridania:868984941004869692>" },
        3: { name: "Ul'dah", icon: "<:cityuldah:868984873640157234>" },
    },

    // Grand Company name, title and rank icons
    playerGC: {
        1: {
            company: "Maelstrom", title: "Storm",
            ico: {
                1: "<:storm1:870419647416127549>",
                2: "<:storm2:870419647663575060>",
                3: "<:storm3:870419647642599454>",
                4: "<:storm4:870419647328038913>",
                5: "<:storm5:870419647340621866>",
                6: "<:storm6:870419647630037083>",
                7: "<:storm7:870419647651004466>",
                8: "<:storm8:870419647676157992>",
                9: "<:storm9:870419647663587368>",
                10: "<:storm10:870419647818760193>",
                11: "<:storm11:870419647701323776>",
            }
        },
        2: {
            company: "Order of the Twin Adder", title: "Serpent",
            ico: {
                1: "<:serpent1:870419647558717470>",
                2: "<:serpent2:870419647541940245>",
                3: "<:serpent3:870419647567114280>",
                4: "<:serpent4:870419647520985108>",
                5: "<:serpent5:870419647684563024>",
                6: "<:serpent6:870419647697137704>",
                7: "<:serpent7:870419647550341181>",
                8: "<:serpent8:870419647609077810>",
                9: "<:serpent9:870419647663603783>",
                10: "<:serpent10:870419647655194644>",
                11: "<:serpent11:870419647701323796>",
            }
        },
        3: {
            company: "Immortal Flames", title: "Flame",
            ico: {
                1: "<:flame1:870419645876830249>",
                2: "<:flame2:870419646648557588>",
                3: "<:flame3:870419646245904395>",
                4: "<:flame4:870419646623399997>",
                5: "<:flame5:870419647533572157>",
                6: "<:flame6:870419646443040819>",
                7: "<:flame7:870419646921183282>",
                8: "<:flame8:870419647692939275>",
                9: "<:flame9:870419647416115242>",
                10: "<:flame10:870419647646822490>",
                11: "<:flame:870419647709708388>",
            }
        }
    },

    // Grand Company ranks, <t> is replaced with the title Storm, Serpent or Flame
    gcTitles: {
        0: "Recruit",
        1: "<t> Private Third Class",
        2: "<t> Second Private Second Class",
        3: "<t> Private First Class",
        4: "<t> Corporal",
        5: "<t> Sergeant Third Class",
        6: "<t> Sergeant Second Class",
        7: "<t> Sergeant First Class",
        8: "Chief <t> Sergeant",
        9: "Second <t> Lieutenant",
        10: "First <t> Lieutenant",
        11: "<t> Captain",

        // maybe one day
        12: "Second <t> Commander",
        13: "First <t> Commander",
        14: "High <t> Commander",
        15: "Rear <t> Marshal",
        16: "Vice <t> Marshal",
        17: "<t> Marshal",
        18: "Grand <t> Marshal",
        19: "<t> Champion"
    },

    /*
        Other
    */

    // specific HTML to replace (like bolding for highlight)
    htmlToReplace: [
        [/<br>/g, "\n"],
        [/<span class="highlight-green">/g, "**"],
        [/<span class="highlight-yellow">/g, "**"],
        [/<span class="highlight">/g, "**"],
        [/<span class="alternative">/g, "**"],
        [/<span class="alternative-container">/g, "**"],
        [/<\/span>/g, "**"],
        [/:/g, ""],

        [/<Emphasis>/g, "**"],
        [/<\/Emphasis>/g, "**"]
    ],

    intl: new Intl.NumberFormat("en-US") // format unix to date
}