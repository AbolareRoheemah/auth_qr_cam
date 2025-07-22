export interface DeviceInfo {
    platform: string;
    cookieEnabled: boolean;
    screen: {
      width: number;
      height: number;
      colorDepth: number;
    };
    viewport: {
      width: number;
      height: number;
    };
    timezone: string;
    memory?: number;
    cores?: number;
    connection?: {
      effectiveType: string;
      downlink: number;
    };
  }
  
  export async function getDeviceInfo(): Promise<DeviceInfo> {
    const deviceInfo: DeviceInfo = {
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  
    return deviceInfo;
  }