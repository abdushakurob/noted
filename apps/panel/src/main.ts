const DAEMON = import.meta.env.VITE_NOTED_DAEMON ?? "http://127.0.0.1:3737";

type Task = {
  id: string;
  status: string;
  comment: string;
  agentTask?: { summary?: string } | null;
  capture?: { selectorPath?: string };
  styleDiff?: unknown;
};

const tasksEl = document.querySelector("#tasks")!;
const detailEl = document.querySelector("#detail")!;
const connEl = document.querySelector("#conn")!;
const actionsEl = document.querySelector("#actions")!;

let tasks: Task[] = [];
let selected: string | null = null;

function renderActions(t: Task) {
  actionsEl.innerHTML = "";
  const mk = (label: string, fn: () => void) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.onclick = fn;
    actionsEl.appendChild(b);
  };

  if (t.status === "pending_approval") {
    mk("Approve — send to Cursor", () => void approve(t.id));
  }
  if (!t.agentTask) {
    mk("Write task with local Gemma", () => void synthesize(t.id));
  }
  mk("Check fix on live page", () => {
    void fetch(`${DAEMON}/v1/tasks/${t.id}/verify`, { method: "POST" });
    connEl.textContent = "Checking — keep the demo tab open";
  });
}

function renderDetail(t: Task) {
  renderActions(t);
  detailEl.textContent = JSON.stringify(t, null, 2);
}

async function approve(id: string) {
  await fetch(`${DAEMON}/v1/tasks/${id}/approve`, { method: "POST" });
  await refresh();
}

async function synthesize(id: string) {
  connEl.textContent = "Running Gemma on your machine…";
  const res = await fetch(`${DAEMON}/v1/tasks/${id}/synthesize`, { method: "POST" });
  if (!res.ok) {
    connEl.textContent = "Ollama not running — install from ollama.com and: ollama pull gemma2:2b";
    return;
  }
  await refresh();
}

function renderList() {
  tasksEl.innerHTML = "";
  for (const t of tasks) {
    const li = document.createElement("li");
    if (t.id === selected) li.classList.add("active");
    const summary = t.agentTask?.summary ?? t.comment.slice(0, 60);
    li.innerHTML = `<strong>${t.status}</strong><br>${summary}`;
    li.onclick = () => {
      selected = t.id;
      renderList();
      renderDetail(t);
    };
    tasksEl.appendChild(li);
  }
  if (selected) {
    const t = tasks.find((x) => x.id === selected);
    if (t) renderDetail(t);
  }
}

async function refresh() {
  const res = await fetch(`${DAEMON}/v1/tasks`);
  const data = (await res.json()) as { tasks: Task[] };
  tasks = data.tasks;
  renderList();
}

function connectWs() {
  const ws = new WebSocket(`${DAEMON.replace(/^http/, "ws")}/v1/ws`);
  ws.onopen = () => {
    void fetch(`${DAEMON}/v1/config`)
      .then((r) => r.json())
      .then((cfg: { synthesis?: string; ollamaModel?: string }) => {
        connEl.textContent = `live · ${cfg.synthesis ?? "?"} · ${cfg.ollamaModel ?? ""}`;
      })
      .catch(() => {
        connEl.textContent = "live";
      });
  };
  ws.onclose = () => {
    connEl.textContent = "reconnecting…";
    setTimeout(connectWs, 1500);
  };
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(String(ev.data)) as {
        type: string;
        task?: Task;
        timing?: { totalMs?: number; source?: string };
      };
      if (msg.type === "task_created" && msg.task) {
        tasks.unshift(msg.task);
        selected = msg.task.id;
        connEl.textContent = `live · ${msg.timing?.totalMs ?? "?"}ms · ${msg.timing?.source ?? "?"}`;
        renderList();
      }
      if (msg.type === "task_verified" && msg.task) {
        const i = tasks.findIndex((t) => t.id === msg.task!.id);
        if (i >= 0) tasks[i] = msg.task;
        renderList();
      }
      if (msg.type === "task_updated" && msg.task) {
        const i = tasks.findIndex((t) => t.id === msg.task!.id);
        if (i >= 0) tasks[i] = msg.task;
        renderList();
      }
    } catch {
      /* ignore */
    }
  };
}

void refresh();
connectWs();
