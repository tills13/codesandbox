import amqp from "amqplib";

let connection: amqp.Connection;

export async function amqpConnection() {
  if (!connection) {
    connection = await amqp.connect(`amqp://${process.env.AMQP_HOST}:5672`);
  }

  return connection;
}

export async function createChannel(q: string) {
  const connection = await amqpConnection();
  const channel = await connection.createChannel();

  await channel.assertQueue(q);

  return channel;
}

export async function initializeProjectChannel() {
  return createChannel("initializeProject");
}
