// import AWS from 'aws-sdk';
import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';

dotenv.config();

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

// aws-sdk V3 코드
async function processMessages() {
  const queueUrl = AWS_SQS_QUEUE_URL!;

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
        console.log(message.Body);
        const { userId, points } = JSON.parse(message.Body);
        console.log(`Processing points for user ${userId}, points: ${points}`);
        // TODO: 포인트 생성 처리
      }

      await client.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        }),
      );
    }

    // aws의 공식 example인데 async/await 코드를 foreach 안에서 처리하는지 모르겠다.
    // Messages.forEach(async (message) => {
    //   if (message.Body) {
    //     console.log(message.Body);
    //     const { userId, points } = JSON.parse(message.Body);
    //   }

    //   await client.send(
    //     new DeleteMessageCommand({
    //       QueueUrl: queueUrl,
    //       ReceiptHandle: message.ReceiptHandle,
    //     }),
    //   );
    // });
  }
}

// aws-sdk V2 코드
// AWS.config.update({
//   credentials: {
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   },
//   region: AWS_REGION,
// });
// const sqs = new AWS.SQS();

// async function processMessages() {
//   const queueUrl = AWS_SQS_QUEUE_URL!;
//   const params = {
//     QueueUrl: queueUrl,
//     MaxNumberOfMessages: 10, // 가져올 메시지 수
//   };

//   try {
//     const data = await sqs.receiveMessage(params).promise();

//     if (data.Messages) {
//       for (const message of data.Messages) {
//         if (!message.Body) {
//           continue;
//         }
//         const { userId, points } = JSON.parse(message.Body);

//         // TODO: 포인트 생성 및 지급 작업 수행
//         console.log(`Processing points for user ${userId}, points: ${points}`);

//         // 메시지 삭제
//         if (!message.ReceiptHandle) {
//           continue;
//         }
//         const deleteParams = {
//           QueueUrl: queueUrl,
//           ReceiptHandle: message.ReceiptHandle,
//         };
//         await sqs.deleteMessage(deleteParams).promise();
//       }
//     }
//   } catch (error) {
//     console.error('Error processing messages:', error);
//   }
// }

// 일정 간격으로 메시지 처리 작업 실행
const processingInterval = setInterval(processMessages, 5000);
