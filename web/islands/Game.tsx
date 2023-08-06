import { useEffect } from "preact/hooks";

export interface GameProps {
  gameserver: string;
}
export default function Game({ gameserver }: GameProps) {
  useEffect(() => {
    const socket = new WebSocket(gameserver);
    socket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
    });
  }, []);
  return (
    <div>
      hello
    </div>
  );
}
