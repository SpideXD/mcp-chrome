/**
 * Per-tab async execution queue.
 *
 * Tools targeting different tabs run in parallel.
 * Tools targeting the same tab are serialized to prevent DOM/CDP race conditions.
 */

/** Sentinel key for tool calls that don't specify a tabId (all serialize together). */
const ACTIVE_TAB_SENTINEL = -1;

interface QueueEntry {
  execute: () => Promise<unknown>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

class TabExecutionQueue {
  private queues = new Map<number, QueueEntry[]>();
  private running = new Map<number, boolean>();

  /**
   * Determine the queue key from tool args.
   * Returns the explicit tabId if provided, otherwise the sentinel.
   */
  resolveQueueKey(args: Record<string, any> | undefined): number {
    const tabId = args?.tabId;
    return typeof tabId === 'number' ? tabId : ACTIVE_TAB_SENTINEL;
  }

  /**
   * Enqueue a task for the given tab key.
   * Resolves/rejects with the task's result.
   */
  enqueue<T>(tabKey: number, fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let queue = this.queues.get(tabKey);
      if (!queue) {
        queue = [];
        this.queues.set(tabKey, queue);
      }
      queue.push({ execute: fn, resolve, reject });
      this.drain(tabKey);
    });
  }

  private async drain(tabKey: number): Promise<void> {
    if (this.running.get(tabKey)) return;
    this.running.set(tabKey, true);

    try {
      const queue = this.queues.get(tabKey);
      while (queue && queue.length > 0) {
        const entry = queue.shift()!;
        try {
          const result = await entry.execute();
          entry.resolve(result);
        } catch (error) {
          entry.reject(error);
        }
      }
    } finally {
      this.running.set(tabKey, false);
      // Clean up empty queues to prevent memory leaks
      const queue = this.queues.get(tabKey);
      if (!queue || queue.length === 0) {
        this.queues.delete(tabKey);
      } else {
        // New entries arrived while draining; restart
        this.drain(tabKey);
      }
    }
  }
}

export const tabExecutionQueue = new TabExecutionQueue();
