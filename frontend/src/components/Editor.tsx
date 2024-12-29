import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { Socket } from "socket.io-client";

import {
  File,
  buildFileTree,
  RemoteFile,
} from "../components/external/utils/file-manager";
import { FileTree } from "../components/external/editor/components/File-tree";
import { Code } from "../components/external/editor/editor/Code";

import Sidebar from "./external/editor/components/sidebar";

// credits - https://codesandbox.io/s/monaco-tree-pec7u
export const Editor = ({
  files,
  onSelect,
  selectedFile,
  socket,
}: {
  files: RemoteFile[];
  onSelect: (file: File) => void;
  selectedFile: File | undefined;
  socket: Socket;
}) => {
  const rootDir = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  useEffect(() => {
    if (!selectedFile) {
      onSelect(rootDir.files[0]);
    }
  }, [selectedFile]);

  return (
    <div>
      <Main>
        <Sidebar>
          <FileTree
            rootDir={rootDir}
            selectedFile={selectedFile}
            onSelect={onSelect}
          />
        </Sidebar>
        <Code selectedFile={selectedFile} socket={socket} />
      </Main>
    </div>
  );
};

const Main = styled.main`
  display: flex;
`;
