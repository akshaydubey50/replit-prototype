import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Socket, io } from "socket.io-client";

import {
  File,
  RemoteFile,
  Type,
} from "../components/external/utils/file-manager";
import { EXECUTION_ENGINE_URI } from "../config";

import { TerminalComponent as Terminal } from "./Terminal";
import { Output } from "./Output";
import { Editor } from "./Editor";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  color:#fff;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligns children (button) to the right */
  padding: 10px; /* Adds some space around the button */
`;

const Workspace = styled.div`
  display: flex;
  margin: 0;
  font-size: 16px;
  width: 100%;
`;

const LeftPanel = styled.div`
  flex: 1;
  width: 60%;
`;

const RightPanel = styled.div`
  flex: 1;
  width: 40%;
`;

function useSocket(replId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${EXECUTION_ENGINE_URI}?roomId=${replId}`);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [replId]);

  return socket;
}

export default function CodingPage() {
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId") ?? "";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socket = useSocket(replId);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [showOutput, setShowOutput] = useState<boolean>(false);

  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
        setIsLoading(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket]);

  const onSelect = (file: File) => {
    if (file?.type === Type.DIRECTORY) {
      console.log("file in Directory:::::::::::::",file)
      socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
        setFileStructure((prev) => {
          const allFiles = [...prev, ...data];

          return allFiles.filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.path === file.path),
          );
        });
      });
    } else {
      socket?.emit("fetchContent", { path: file?.path }, (data: string) => {
        file.content = data;
        setSelectedFile(file);
      });
    }
  };

  if (!isLoading) {
    return "Loading...";
  }

  return (
    <>
      <div className="bg-gray-800">
        <Container>
          <ButtonContainer>
            <button onClick={() => setShowOutput(!showOutput)}>
              See output
            </button>
          </ButtonContainer>
          <Workspace>
            <LeftPanel>
              <Editor
                files={fileStructure}
                selectedFile={selectedFile}
                socket={socket}
                onSelect={onSelect}
              />
            </LeftPanel>
            <RightPanel>
              {showOutput && <Output />}
              {socket && <Terminal socket={socket} />}
            </RightPanel>
          </Workspace>
        </Container>
      </div>
    </>
  );
}
