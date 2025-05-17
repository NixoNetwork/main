declare module 'html5-qrcode' {
  export class Html5Qrcode {
    constructor(elementId: string);
    start(
      cameraIdOrConfig: string | { facingMode: string },
      config: { fps: number; qrbox: { width: number; height: number } },
      onScanSuccess: (decodedText: string, decodedResult: any) => void,
      onScanFailure?: (error: any) => void
    ): Promise<void>;
    stop(): Promise<void>;
    clear(): void;
  }
}