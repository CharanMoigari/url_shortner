// RabbitMQ service for asynchronous analytics processing

import amqp from 'amqplib';
import { config } from '../config';
import logger from '../config/logger';
import { getUserAgentDetails } from '../utils';
import { AnalyticsModel } from '../models/Analytics';

const ANALYTICS_QUEUE = 'analytics_events';

let connection: any = null;
let channel: any = null;

export const initRabbitMQ = async (): Promise<void> => {
  try {
    connection = await amqp.connect(config.rabbitmq.url || '');
    channel = await connection.createChannel();

    // Declare the analytics queue
    await channel.assertQueue(ANALYTICS_QUEUE, { durable: true });

    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

export const publishAnalyticsEvent = async (event: {
  urlId: string;
  userAgent: string;
  referrer: string;
}): Promise<void> => {
  if (!channel) {
    logger.error('RabbitMQ channel not initialized');
    return;
  }

  try {
    const message = JSON.stringify(event);
    channel.sendToQueue(ANALYTICS_QUEUE, Buffer.from(message), {
      persistent: true,
    });
    logger.debug(`Analytics event published for URL: ${event.urlId}`);
  } catch (error) {
    logger.error('Failed to publish analytics event:', error);
    throw error;
  }
};

export const startAnalyticsWorker = async (): Promise<void> => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  try {
    await channel.assertQueue(ANALYTICS_QUEUE, { durable: true });

    // Set max prefetch to 1 for fair distribution
    await channel.prefetch(1);

    channel.consume(ANALYTICS_QUEUE, async (msg: any) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());

        // Extract browser and device info
        const { browser, device } = getUserAgentDetails(event.userAgent);

        // Store analytics in database
        await AnalyticsModel.create(
          event.urlId,
          browser,
          device,
          event.referrer
        );

        logger.debug(`Analytics stored for URL: ${event.urlId}`);

        // Acknowledge message
        channel!.ack(msg);
      } catch (error) {
        logger.error('Error processing analytics event:', error);
        // Reject message (will be requeued)
        channel!.nack(msg, false, true);
      }
    });

    logger.info('Analytics worker started and listening for messages');
  } catch (error) {
    logger.error('Failed to start analytics worker:', error);
    throw error;
  }
};

export const closeRabbitMQ = async (): Promise<void> => {
  try {
    if (channel) await channel.close();
    if (connection) await (connection as any).close();
    logger.info('RabbitMQ connection closed');
  } catch (error) {
    logger.error('Error closing RabbitMQ connection:', error);
  }
};

export default {
  initRabbitMQ,
  publishAnalyticsEvent,
  startAnalyticsWorker,
  closeRabbitMQ,
};
