import { DatabaseSync } from "node:sqlite";

import type { AgentTask, ElementCapture, StyleDiff, TaskRecord, TaskStatus } from "@noted/shared";

export class TaskStore {
  private db: DatabaseSync;

  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec("PRAGMA synchronous = NORMAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        comment TEXT NOT NULL,
        capture_json TEXT NOT NULL,
        agent_task_json TEXT,
        style_diff_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
    `);
  }

  close(): void {
    this.db.close();
  }

  insert(input: {
    id: string;
    comment: string;
    capture: ElementCapture;
    agentTask: AgentTask | null;
    status?: TaskStatus;
  }): TaskRecord {
    const now = new Date().toISOString();
    const status = input.status ?? "pending";
    this.db
      .prepare(
        `INSERT INTO tasks (id, status, comment, capture_json, agent_task_json, style_diff_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NULL, ?, ?)`,
      )
      .run(
        input.id,
        status,
        input.comment,
        JSON.stringify(input.capture),
        input.agentTask ? JSON.stringify(input.agentTask) : null,
        now,
        now,
      );
    return this.get(input.id)!;
  }

  updateAgentTask(id: string, agentTask: AgentTask): TaskRecord {
    const now = new Date().toISOString();
    this.db
      .prepare(`UPDATE tasks SET agent_task_json = ?, updated_at = ? WHERE id = ?`)
      .run(JSON.stringify(agentTask), now, id);
    return this.get(id)!;
  }

  setStatus(id: string, status: TaskStatus): TaskRecord {
    const now = new Date().toISOString();
    this.db.prepare(`UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?`).run(status, now, id);
    return this.get(id)!;
  }

  setStyleDiff(id: string, diff: StyleDiff, status: TaskStatus = "verified"): TaskRecord {
    const now = new Date().toISOString();
    this.db
      .prepare(`UPDATE tasks SET style_diff_json = ?, status = ?, updated_at = ? WHERE id = ?`)
      .run(JSON.stringify(diff), status, now, id);
    return this.get(id)!;
  }

  list(status?: TaskStatus): TaskRecord[] {
    const rows = status
      ? (this.db.prepare(`SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC`).all(status) as Row[])
      : (this.db.prepare(`SELECT * FROM tasks ORDER BY created_at DESC`).all() as Row[]);
    return rows.map(rowToRecord);
  }

  get(id: string): TaskRecord | null {
    const row = this.db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id) as Row | undefined;
    return row ? rowToRecord(row) : null;
  }
}

type Row = {
  id: string;
  status: TaskStatus;
  comment: string;
  capture_json: string;
  agent_task_json: string | null;
  style_diff_json: string | null;
  created_at: string;
  updated_at: string;
};

function rowToRecord(row: Row): TaskRecord {
  return {
    id: row.id,
    status: row.status,
    comment: row.comment,
    capture: JSON.parse(row.capture_json),
    agentTask: row.agent_task_json ? JSON.parse(row.agent_task_json) : null,
    styleDiff: row.style_diff_json ? JSON.parse(row.style_diff_json) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
