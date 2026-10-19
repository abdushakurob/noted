type Client = { send: (data: string) => void };

export class WsHub {
  private clients = new Set<Client>();

  add(client: Client): void {
    this.clients.add(client);
  }

  remove(client: Client): void {
    this.clients.delete(client);
  }

  broadcast(payload: unknown): void {
    const data = JSON.stringify(payload);
    for (const c of this.clients) {
      try {
        c.send(data);
      } catch {
        this.clients.delete(c);
      }
    }
  }
}
