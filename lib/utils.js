const sortByKey = (unsortedObject) => {
    const sortedObject = {}
    Object.keys(unsortedObject).sort().forEach((key) => {
        sortedObject[key] = unsortedObject[key]
    })
    return sortedObject
}

module.exports = {
    sortByKey
}