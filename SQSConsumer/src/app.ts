import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';
import { dataSource } from './db';
import { Point } from './entities/Point';

async function main() {
  dotenv.config();
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SQS_QUEUE_URL, AWS_REGION } = process.env;
  if (!AWS_ACCESS_KEY_ID) {
    throw new Error(`AWS_ACCESS_KEY_ID 없음`);
  }
  if (!AWS_SECRET_ACCESS_KEY) {
    throw new Error(`AWS_SECRET_ACCESS_KEY 없음`);
  }
  if (!AWS_SQS_QUEUE_URL) {
    throw new Error(`AWS_SQS_QUEUE_URL 없음`);
  }
  if (!AWS_REGION) {
    throw new Error(`AWS_REGION 없음`);
  }

  const client = new SQSClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  const processingInterval = setInterval(() => {
    processMessages(client, AWS_SQS_QUEUE_URL);
  }, 5000);
}

main().catch((err) => {
  console.error(err);
  process.exit();
});

// aws-sdk V3 코드
async function processMessages(client: SQSClient, queueUrl: string) {
  const { Messages } = await client.send(
    new ReceiveMessageCommand({
      AttributeNames: ['SentTimestamp'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 5,
    }),
  );

  console.log(`received messages: `, Messages);

  if (Messages) {
    for (const message of Messages) {
      if (message.Body) {
        const point = JSON.parse(message.Body) as Point;
        await dataSource.getRepository(Point).save(point);
      }

      await client.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        }),
      );
    }
  }
}
