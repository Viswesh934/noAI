//Imagine a bucket instead of a map, we use map anyway

const buckets = new Map()

function tokenBucket(ip){
    const now = Date.now()

    const refillRate = 5 // allowed tokens per sec

    const capacity = 10 // allowed requests at a point of time

    let bucket = buckets.get(ip) || { // get the current value if exists or else the bucket starts full
        tokens: capacity,
        last: now
    }

    const elapsed = (now - bucket.last) / 1000  // time elapsed in the one sec window

    bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRate) // tokens added on demand in chunks without going out of the capacity 

    if(bucket.tokens < 1) return false // if token hits less that 1 it's out
    
    bucket.tokens-=1 // remove tokens from bucket for each request
    bucket.last = now // setting this up to the recent one

    buckets.set(ip,bucket) // updating the main buckets map

    return true

}