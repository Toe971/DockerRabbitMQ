const amqp = require('amqplib');
const os = require("os");

const exchange = 'raspi_sensors'

const hostname = os.hostname();
console.log(hostname)

const publisher = 'JoshuaGTX1070'
const subscriber = 'MasterPi'

const msg = 'Hello bois'
const routingKey = "test.test"
const queue = "testqueue"

// can split to child process in the future, leave it fugly for now
const main = async () => {


    const conn = (hostname === publisher) ? await amqp.connect('amqp://localhost') : await amqp.connect('amqp://raspi1:raspi1@192.168.1.55:5672')

    const channel = await conn.createChannel()

    // declare exchange, publishing to a non-exisiting exchange is forbidden
    await channel.assertExchange(exchange, 'direct', {
        durable: false
    })

    if (hostname != publisher) {
        channel.publish(exchange, routingKey, Buffer.from(msg))
        console.log(` [x] Sent with routingKey ${routingKey}: ${msg}`)

        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 500)
    } else {
        const q = await channel.assertQueue(queue, {
            durable: false
        })
        channel.bindQueue(q.queue, exchange, routingKey)
        const msgHandler = msg => {
            console.log(` [x] Received: ${msg}`)
        }
        await channel.consume(q.queue, msgHandler, {
            noAck: true
        })
    }
}

main().catch(console.warn);
