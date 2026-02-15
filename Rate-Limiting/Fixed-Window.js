const store = new Map() // {count: , start: }

function fixedWindow(ip){
    const now = Date.now()
    const windowMs = 60 * 1000
 
    // Get the ip from the map if exists
    let entry = store.get(ip)

    // Primary check for the stuff

    if (!entry || now- entry.start > windowMs){
        entry = {count:0, start: now}
    }

    entry.count++

    store.set(ip,entry)

    // block if more than 10 entries

    if(entry.count >10){
        return false
    }

    return true
}