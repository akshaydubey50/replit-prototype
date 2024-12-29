import Editor from "@monaco-editor/react";
import { Socket } from "socket.io-client";

import { File } from "../../utils/file-manager";

export const Code = ({
  selectedFile,
  socket,
}: {
  selectedFile: File | undefined;
  socket: Socket;
}) => {
  if (!selectedFile) return null;

  const code = selectedFile.content;
  let language = selectedFile.name.split(".").pop();

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "py") language = "python";


  function debounce(func: (value: string) => void, wait: number) {
    let timeout: NodeJS.Timeout;

    return (value: string | undefined, _ev?: any) => {
      if (!value) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(value);
      }, wait);
    };
  }

  return (
    <Editor
    
      height="100vh"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={debounce((value: string | undefined) => {
        socket.emit("updateContent", {
          path: selectedFile.path,
          content: value,
        });
      }, 500)}
    />
  );
};
