import mongoose from 'mongoose';
import si from 'systeminformation';
import config from '@/core/config';
import { LoggerService } from '@/core/logger';
import { IDatabaseStatus, ISystemHealth } from './health.interface';

class HealthService {
  private logger = new LoggerService('HealthService');

  private async getDatabaseStatus(): Promise<IDatabaseStatus> {
    const dbState = [
      { value: 0, label: 'disconnected' },
      { value: 1, label: 'connected' },
      { value: 2, label: 'connecting' },
      { value: 3, label: 'disconnecting' },
    ];

    const currentDbState = dbState.find((state) => state.value === mongoose.connection.readyState) || dbState[0];

    const dbInfo: IDatabaseStatus = {
      name: config.MONGO_DATABASE,
      host: config.MONGO_PATH,
      state: currentDbState.value,
      status: currentDbState.label,
    };

    if (currentDbState.value === 1 && mongoose.connection.db) {
      try {
        const start = Date.now();
        await mongoose.connection.db.admin().ping();
        const end = Date.now();
        dbInfo.responseTime = end - start;
      } catch (error) {
        this.logger.error(`Error checking database connection: ${error}`);
      }
    }

    return dbInfo;
  }

  public async getHealth(): Promise<ISystemHealth> {
    const [dbStatus, cpuLoad, cpuInfo, memInfo, diskInfo] = await Promise.all([
      this.getDatabaseStatus(),
      si.currentLoad(),
      si.cpu(),
      si.mem(),
      si.fsSize(),
    ]);

    const primaryDisk = diskInfo[0] || { size: 0, used: 0, available: 0 };

    const isHealthy = dbStatus.state === 1 && cpuLoad.currentLoad < 90 && memInfo.available > 1000000000;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: isHealthy ? 'System is healthy' : 'System health check detected issues',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        cpu: {
          usage: parseFloat(cpuLoad.currentLoad.toFixed(2)),
          cores: cpuInfo.cores,
        },
        memory: {
          total: memInfo.total,
          free: memInfo.available,
          used: memInfo.used,
          usedPercent: parseFloat(((memInfo.used / memInfo.total) * 100).toFixed(2)),
        },
        disk: {
          total: primaryDisk.size,
          free: primaryDisk.available,
          used: primaryDisk.used,
          usedPercent: parseFloat(((primaryDisk.used / primaryDisk.size) * 100).toFixed(2)),
        },
      },
      database: dbStatus,
      framework: {
        name: 'Express',
        version: '5.1.0',
        nodeVersion: process.version,
      },
      application: {
        environment: process.env.NODE_ENV || 'unknown',
        version: process.env.npm_package_version || 'unknown',
        build: process.env.npm_package_build || 'unknown',
      },
    };
  }
}

export default HealthService;
