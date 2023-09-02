import { SQSClient, SendMessageBatchCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export class AwsClient {
  private client;
  private queueUrl;

  constructor() {
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

    this.queueUrl = AWS_SQS_QUEUE_URL;
    this.client = new SQSClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async sendSqsMessage(MessageBody: string | undefined) {
    const response = await this.client.send(
      new SendMessageCommand({
        MessageBody,
        QueueUrl: this.queueUrl,
      }),
    );
    return response;
  }

  public async sendBulkSqsMessage(messageBodys: string[]) {
    const responses = await this.client.send(
      new SendMessageBatchCommand({
        Entries: messageBodys.map((body) => ({ Id: randomUUID(), MessageBody: body })),
        QueueUrl: this.queueUrl,
      }),
    );
    return responses;
  }
}
