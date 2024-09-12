import { SocketProvider } from "../../../../custom-hooks/useSocket";

export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SocketProvider>{children}</SocketProvider>;
}
