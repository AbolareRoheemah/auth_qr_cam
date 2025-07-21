// lib/totp.ts
import { totp, authenticator } from 'otplib';
import QRCode from 'qrcode';

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export async function generateQRCode(
  secret: string, 
  serviceName: string = 'Auth Security App', 
  accountName: string = 'demo-user@example.com'
): Promise<string> {
  try {
    const otpauth = authenticator.keyuri(accountName, serviceName, secret);
    const qrUrl = await QRCode.toDataURL(otpauth);
    return qrUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export function validateCode(secret: string): boolean {
  try {
    const token = totp.generate(secret);
    return totp.verify({ token, secret });
  } catch (error) {
    console.error('Error validating code:', error);
    return false;
  }
}

export async function createTOTPSession(
  serviceName?: string, 
  accountName?: string
): Promise<{ secret: string; qrCodeUrl: string }> {
  const secret = generateSecret();
  const qrCodeUrl = await generateQRCode(secret, serviceName, accountName);
  
  return {
    secret,
    qrCodeUrl
  };
}