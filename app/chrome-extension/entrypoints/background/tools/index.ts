import { createErrorResponse } from '@/common/tool-handler';
import { ERROR_MESSAGES } from '@/common/constants';
import * as browserTools from './browser';
import { flowRunTool, listPublishedFlowsTool } from './record-replay';
import { tabExecutionQueue } from '@/utils/tab-execution-queue';

const tools = { ...browserTools, flowRunTool, listPublishedFlowsTool } as any;
const toolsMap = new Map(Object.values(tools).map((tool: any) => [tool.name, tool]));

/**
 * Tool call parameter interface
 */
export interface ToolCallParam {
  name: string;
  args: any;
}

/**
 * Tools that do NOT operate on a specific tab's page content.
 * These bypass the per-tab queue because they cannot conflict with tab-scoped operations.
 */
const TAB_AGNOSTIC_TOOLS = new Set([
  'get_windows_and_tabs',
  'search_tabs_content',
  'chrome_close_tabs',
  'chrome_switch_tab',
  'chrome_history',
  'chrome_bookmark_search',
  'chrome_bookmark_add',
  'chrome_bookmark_delete',
  'chrome_handle_download',
  'record_replay_list_published',
]);

/**
 * Handle tool execution.
 *
 * Tab-scoped tools are serialized per-tab via the execution queue so that
 * two concurrent calls targeting different tabs run in parallel, while calls
 * targeting the same tab are safely serialized.
 */
export const handleCallTool = async (param: ToolCallParam) => {
  const tool = toolsMap.get(param.name);
  if (!tool) {
    return createErrorResponse(`Tool ${param.name} not found`);
  }

  const executeTool = async () => {
    try {
      return await tool.execute(param.args);
    } catch (error) {
      console.error(`Tool execution failed for ${param.name}:`, error);
      return createErrorResponse(
        error instanceof Error ? error.message : ERROR_MESSAGES.TOOL_EXECUTION_FAILED,
      );
    }
  };

  // Tab-agnostic tools bypass the per-tab queue — they can always run concurrently
  if (TAB_AGNOSTIC_TOOLS.has(param.name)) {
    return executeTool();
  }

  // Tab-scoped tools are serialized per-tab via the queue
  const queueKey = tabExecutionQueue.resolveQueueKey(param.args);
  return tabExecutionQueue.enqueue(queueKey, executeTool);
};
