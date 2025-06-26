CREATE TABLE users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  password    TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workflows (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_type TEXT        NOT NULL  CHECK (trigger_type IN ('time', 'webhook')),
  created_by   UUID        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_workflows_created_by
    FOREIGN KEY (created_by)
      REFERENCES users (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE TABLE action_nodes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id    TEXT NOT NULL,
  workflow_id  UUID        NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  type         TEXT        NOT NULL,
  params       JSONB       NOT NULL DEFAULT '{}'::JSONB,
  next_ids     TEXT[]      NOT NULL DEFAULT '{}'::TEXT[],
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_action_nodes_workflow
  ON action_nodes(workflow_id);

CREATE TABLE workflow_executions (
  workflow_id   UUID        NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  execution_id  TEXT        NOT NULL,
  current_node  TEXT        NULL,
  completed     BOOLEAN     NOT NULL DEFAULT FALSE,
  retries       JSONB       NOT NULL DEFAULT '{}'::JSONB,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY  (workflow_id, execution_id)
);

CREATE TABLE workflow_execution_logs (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id    UUID        NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  execution_id   UUID        NOT NULL,
  action_id      UUID        NOT NULL REFERENCES action_nodes(id) ON DELETE CASCADE,
  status         TEXT        NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),
  attempt        INTEGER     NOT NULL DEFAULT 1,
  message        TEXT,                  
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);