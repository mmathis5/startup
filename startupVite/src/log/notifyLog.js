class EventMessage {
    constructor(from, type, value){
        this.from = from;
        this.type = type;
        this.value = value;
    }
}

class GameEventNotifier{
    handlers = []

    constructor() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = () => {
            console.log("Websocket connection established.");
        };
        this.socket.onclose = () => {
            console.log("Websocket connection closed.");
        };
        this.socket.onmessage = async (msg) => {
          try {
            const event = JSON.parse(await msg.data.text());
            this.receiveEvent(event);
          } catch {}
        };
      }
    
      broadcastEvent(from, message) {
        const event = new EventMessage(from, "message", { text: message });
        this.socket.send(JSON.stringify(event));
      }
    
      addHandler(handler) {
        this.handlers.push(handler);
      }
    
      removeHandler(handler) {
        this.handlers.filter((h) => h !== handler);
      }
    
      receiveEvent(event) {
        this.events.push(event);
    
        this.events.forEach((e) => {
          this.handlers.forEach((handler) => {
            handler(e);
          });
        });
      }
    
}

const LogNotifier = new GameEventNotifier();
export { LogNotifier };