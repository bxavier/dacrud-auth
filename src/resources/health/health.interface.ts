export interface IDatabaseStatus {
  name: string;
  host: string;
  state: number;
  status: string;
  responseTime?: number;
}

export interface ISystemHealth {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
  system: {
    cpu: {
      usage: number;
      cores: number;
    };
    memory: {
      total: number;
      free: number;
      used: number;
      usedPercent: number;
    };
    disk: {
      total: number;
      free: number;
      used: number;
      usedPercent: number;
    };
  };
  database: IDatabaseStatus;
  framework: {
    name: string;
    version: string;
    nodeVersion: string;
  };
  application: {
    environment: string;
    version: string;
    build: string;
  };
}
