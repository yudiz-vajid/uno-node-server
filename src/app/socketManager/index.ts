/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/prefer-default-export
class SocketManager {
  constructor() {
    emitter.on('sch', this.onEvents.bind(this));
    emitter.on('redisEvent', this.onEvents.bind(this));
  }

  async onEvents(body: any, callback: () => Promise<void>) {
    const { taskName, channelId, userId } = body;
    try {
      if (!taskName) throw new Error('empty taskName');
      if (!channelId) throw new Error('empty channelId');
      await this.executeScheduledTask(taskName, channelId, userId, body, callback);
    } catch (error: any) {
      log.debug(`Error Occurred on onEvents. sTaskName : ${taskName}. reason :${error.message}`);
    }
  }

  // prettier-ignore
  async executeScheduledTask(taskName: string, channelId: string, userId: string, body: any, callback: () => Promise<void>) {
    log.verbose(`${_.now()} executeScheduledTask ${taskName}`);
    // TODO : add taskName validation and operations
  }
}

export default SocketManager;
