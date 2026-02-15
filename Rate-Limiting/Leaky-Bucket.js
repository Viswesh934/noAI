// uses a map of buckets just like the other one, but this mirrors token bucket

const buckets = new Map() // uses ip : { queue : [], lastLeak: }

function leakyBucket(ip){

    const now = Date.now()

    const capacity = 10 // add a capacity to the bucket
    
    const leakRate = 1/1000 // Instead of refilling we will leak the requests, 1 request per second

    let bucket= buckets.get(ip) ||
    {
        queue: [],
        lastleak: now
    }

    // get the elapsed time between now and the last leak
    const elapsed = now - bucket.lastleak
    const leaks= Math.floor(elapsed*leakRate)

    if (leaks>0){
        bucket.queue.splice(0,leaks)
        bucket.lastleak = now
    }

    if (bucket.queue.length >= capacity){
        buckets.set(ip,bucket)
        return false
    }

    bucket.queue.push(now)
    buckets.set(ip,bucket)

    return true
}