import { logger } from '../utils/logger';

export class SchedulerService {
  private heartbeat?: NodeJS.Timeout;

  start(): void {
    this.heartbeat = setInterval(() => {
      logger.debug({ subsystem: 'scheduler' }, 'ACC scheduler heartbeat');
    }, 30000);
  }

  stop(): void {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = undefined;
    }
  }
}
