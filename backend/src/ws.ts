import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { fetchS3Folder, saveToS3 } from "./aws";
import path from "path";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { TerminalManager } from "./pty";
import fs from "fs";

const terminalManager = new TerminalManager();

export function initWs(httpServer: HttpServer) {
    console.log("ws start")
    const io = new Server(httpServer, {
        cors: {
            // Should restrict this more!
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connect", async (socket) => {
        // Auth checks should happen here
        const replId = socket.handshake.query.roomId as string;

        if (!replId) {
            socket.disconnect();
            terminalManager.clear(socket.id) ;
            return;
        }
        const localPath = path.join(__dirname, `../tmp/${replId}`);

        await fetchS3Folder(`code/${replId}`, localPath);

        if(!fs.existsSync(localPath)){
            console.error(`Directory not found: ${localPath}`);
            socket.disconnect();
            return;
        }
        socket.emit("loaded", {
            rootContent: await fetchDir(localPath, "")
        });

        initHandlers(socket, replId);
    });
}

function initHandlers(socket: Socket, replId: string) {

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("fetchDir", async (dir: string, callback) => {

        if(!dir){
            console.error("Dir not found or undefined");
            callback([]);
            return;
        }
        console.log("fetchDir>>>>",dir)
        const dirPath = path?.join(__dirname, `../tmp/${replId}/${dir}`);
        const contents = await fetchDir(dirPath, dir);
        console.log("fetch Dir Contents:::::::",contents)
        callback(contents);
    });

    socket.on("fetchContent", async ({ path: filePath }: { path: string }, callback) => {
        const fullPath = path.join(__dirname, `../tmp/${replId}/${filePath}`);
        const data = await fetchFileContent(fullPath);
        console.log("fileContent:::", data)
        callback(data);
    });

    // TODO: contents should be diff, not full file
    // Should be validated for size
    // Should be throttled before updating S3 (or use an S3 mount)
    socket.on("updateContent", async ({ path: filePath, content }: { path: string, content: string }) => {
        const fullPath = path.join(__dirname, `../tmp/${replId}/${filePath}`);
        await saveFile(fullPath, content);
        await saveToS3(`code/${replId}`, filePath, content);
    });

    socket.on("requestTerminal", async () => {
        terminalManager.createPty(socket.id, replId, (data:any, id:any) => {
            socket.emit('terminal', {
                data: Buffer.from(data, "utf-8")
            });
        });
    });

    socket.on("terminalData", async ({ data }: { data: string, terminalId: number }) => {
        terminalManager.write(socket.id, data);
    });

}