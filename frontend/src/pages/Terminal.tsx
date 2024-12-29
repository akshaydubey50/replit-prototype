import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
const fitAddon = new FitAddon();

const ab2str = (buf: ArrayBuffer|any) => {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
};

const OPTIONS_TERM = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  cols: 200,
  theme: {
    background: "black",
  },
};

export const TerminalComponent = ({ socket }: { socket: Socket }) => {
  const terminalRef = useRef<any>();

  useEffect(() => {
    if (!terminalRef || !terminalRef.current || !socket) {
      return;
    }

    socket.emit("requestTerminal");
    socket.on("terminal", terminalHandler);
    const term = new Terminal(OPTIONS_TERM);

    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    function terminalHandler({ data }:any) {
      // if (data instanceof ArrayBuffer) {
        console.error(data);
        console.log(ab2str(data));
        term.write(ab2str(data));
      // }
    }

    term.onData((data) => {
      console.log(data);
      socket.emit("terminalData", {
        data,
      });
    });

    socket.emit("terminalData", {
      data: "\n",
    });

    return () => {
      socket.off("terminal");
    };
  }, [terminalRef]);

  return (
    <div
      ref={terminalRef}
      style={{ width: "40vw", height: "400px", textAlign: "left" }}
    />
  );
};
