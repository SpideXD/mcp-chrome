import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { setupTools } from './register-tools';

/**
 * Create a new MCP Server instance.
 *
 * The MCP SDK requires a separate Server (Protocol) instance per transport
 * connection. Calling `server.connect(transport)` on an already-connected
 * instance throws "Already connected to a transport".
 *
 * For multi-agent support each SSE / StreamableHTTP session gets its own
 * Server instance while sharing the same tool handlers.
 */
export const createMcpServer = (): Server => {
  const server = new Server(
    {
      name: 'ChromeMcpServer',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  setupTools(server);
  return server;
};
