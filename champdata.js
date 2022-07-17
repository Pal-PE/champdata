//   /$$$$$$  /$$   /$$  /$$$$$$  /$$      /$$ /$$$$$$$        /$$$$$$$   /$$$$$$  /$$$$$$$$ /$$$$$$ 
//  /$$__  $$| $$  | $$ /$$__  $$| $$$    /$$$| $$__  $$      | $$__  $$ /$$__  $$|__  $$__//$$__  $$
// | $$  \__/| $$  | $$| $$  \ $$| $$$$  /$$$$| $$  \ $$      | $$  \ $$| $$  \ $$   | $$  | $$  \ $$
// | $$      | $$$$$$$$| $$$$$$$$| $$ $$/$$ $$| $$$$$$$/      | $$  | $$| $$$$$$$$   | $$  | $$$$$$$$
// | $$      | $$__  $$| $$__  $$| $$  $$$| $$| $$____/       | $$  | $$| $$__  $$   | $$  | $$__  $$
// | $$    $$| $$  | $$| $$  | $$| $$\  $ | $$| $$            | $$  | $$| $$  | $$   | $$  | $$  | $$
// |  $$$$$$/| $$  | $$| $$  | $$| $$ \/  | $$| $$            | $$$$$$$/| $$  | $$   | $$  | $$  | $$
// \______/ |__/  |__/|__/  |__/|__/     |__/|__/            |_______/ |__/  |__/   |__/  |__/  |__/
                                                                                                 
// Inserts and updates champion data so that it's up to date with Riot's newest patch

const fetch = require(`node-fetch`)

// Get League's latest patch number
const getCurrentVersion = async (cb) => {

    const versions = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)

    try {
        if (versions.ok) {
            const data = await versions.json()
            const latest = data[0]
            return cb(latest)
        } else {
            console.error(`An error occured when getting the game's current version (1)`)
            console.log(versions)
            return cb(false)
        }
    } catch(err) {
        console.log(`An error occured when getting the game's current version (2)`)
        console.error(err)
        return cb(false)
    }

}

// Get the champion data for a specific patch
const getChampsByPatch = async (version, cb) => {

    const champs = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)

    try {
        if (champs.ok) {
            const data = await champs.json()
            return cb(data)
        } else {
            console.error(`An error occured when getting the given patches champions (${verison}) (1)`)
            console.log(champs)
            return cb(false)
        }
    } catch(err) {
        console.log(`An error occured when getting the given patches champions (${verison}) (2)`)
        console.error(err)
        return cb(false)
    }

}

// Collect the most up to date version of champions and insert/update it with the database
const collectChampData = async () => {

    let currentVersion
    await getCurrentVersion((data => {
        currentVersion = data
    }))

    if (!currentVersion) return

    let champs
    await getChampsByPatch(currentVersion, (data => {
        champs = data
    }))

    if (!champs) return

    return champs

}

// Collect the champion data for any given patch
const collectOldChampData = async (version) => {

    let champs
    await getChampsByPatch(version, (data => {
        champs = data
    }))

    if (!champs) return

    return champs

}

// Module exports
module.exports = {
    collectChampData,
    collectOldChampData
}