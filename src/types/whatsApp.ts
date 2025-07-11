export type CreateInstance = {
  instance: {
    instanceName: string;
    instanceId: string;
    integration: string;
    webhookWaBusiness: string;
    accessTokenWaBusiness: string;
    status: string;
  };
  hash: string;
  webhook: unknown;
  websocket: unknown;
  rabbitmq: unknown;
  nats: unknown;
  sqs: unknown;
  settings: {
    rejectCall: boolean;
    msgCall: string;
    groupsIgnore: boolean;
    alwaysOnline: boolean;
    readMessages: boolean;
    readStatus: boolean;
    syncFullHistory: boolean;
    wavoipToken: string;
  };
  qrcode: {
    pairingCode: unknown;
    code: string;
    base64: string;
    count: number;
  };
};
