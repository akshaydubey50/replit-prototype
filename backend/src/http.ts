import { Express } from "express";
import { copyS3Folder } from "./aws";
import express from "express";

export function initHttp(app: Express) {
    app.use(express.json());

    app.post("/project", async (req, res) => {
        // Hit a database to ensure this slug isn't taken already
       try {
           const { replIdVal, toolVal } = req.body;

           if (!replIdVal) {
               res.status(400).send("Bad request");
               return;
           }
           console.log("__dirname",__dirname)

           await copyS3Folder(`base/${toolVal}`, `code/${replIdVal}`);

           res.send("Project created");
       } catch (error) {
            console.error(error)
            res.send(error)
       }
    });
}