const {Kafka}= require('kafkajs')

const kafka=new Kafka({
    clientId: 'my-kafka',
    brokers: ['localhost:9092'],
})
const producer=kafka.producer()

async function runProducer(){
await producer.connect()
await producer.send({
    topic: 'test-topic',
    messages:[{
        value:"Hello a** hole!"
    }]
})

await producer.disconnect()
}



runProducer()