const store = new Map() // {ip: timestamps}

function slidingWindow(ip){
    const now = Date.now()

    const windowMs = 60*1000

    // Use a sliding window instead of normal counts

    let timestamps = store.get(ip) || []

    // Filter out requests that expired in the last 60 sec window

    timestamps = timestamps.filter(t => t.now -t < windowMs)

    if (timestamps.length >=10){
        return false
    }

    timestamps.push(now)
    store.set(ip,timestamps)

    return true
}