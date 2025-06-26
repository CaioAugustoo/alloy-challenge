import type { ActionHandler } from "../../application/use-cases/execute-workflow";
import type { ActionNode } from "../../domain/entities/workflow";

export class HttpActionHandler implements ActionHandler {
  async handle(node: ActionNode): Promise<void> {
    const {
      url,
      method = "GET",
      headers,
      body,
    } = node.params as {
      url: string;
      method?: string;
      headers?: Record<string, string>;
      body?: any;
    };

    if (!url) {
      throw new Error("HttpAction requires a `url` parameter");
    }

    console.log(`[HttpAction] ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });

    console.log(
      `[HttpAction] ${response.status} ${response.statusText} ${url}`
    );

    if (!response.ok) {
      throw new Error(
        `[HttpAction] failed: ${response.status} ${response.statusText}`
      );
    }
  }
}
