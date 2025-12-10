import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!key) {
      throw new Error(
        'PAYSTACK_SECRET_KEY is not set in environment variables',
      );
    }
    this.secretKey = key;
  }

  async verifyPayment(reference: string): Promise<any> {
    try {
      this.logger.log(`Verifying Paystack payment: ${reference}`);

      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status && response.data.data.status === 'success') {
        this.logger.log(`Payment verified successfully: ${reference}`);
        return response.data.data;
      }

      this.logger.warn(`Payment verification failed: ${reference}`);
      throw new BadRequestException('Payment verification failed');
    } catch (error) {
      this.logger.error(`Paystack verification error: ${error.message}`);

      if (axios.isAxiosError(error) && error.response) {
        throw new BadRequestException(
          error.response.data?.message || 'Payment verification failed',
        );
      }

      throw new BadRequestException('Failed to verify payment with Paystack');
    }
  }

  async initializePayment(data: {
    email: string;
    amount: number; // in pesewas (GHS * 100)
    reference?: string;
    metadata?: any;
  }): Promise<any> {
    try {
      this.logger.log(`Initializing Paystack payment for ${data.email}`);

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email: data.email,
          amount: data.amount,
          currency: 'GHS',
          reference: data.reference,
          metadata: data.metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status) {
        this.logger.log(`Payment initialized successfully`);
        return response.data.data;
      }

      throw new BadRequestException('Payment initialization failed');
    } catch (error) {
      this.logger.error(`Paystack initialization error: ${error.message}`);

      if (axios.isAxiosError(error) && error.response) {
        throw new BadRequestException(
          error.response.data?.message || 'Payment initialization failed',
        );
      }

      throw new BadRequestException(
        'Failed to initialize payment with Paystack',
      );
    }
  }
}
