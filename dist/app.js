"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const app_data_source_1 = require("./app-data-source");
const user_entity_1 = require("./entities/user.entity");
async function main() {
    try {
        await app_data_source_1.myDataSource.initialize();
        console.log("Data Source has been initialized!");
    }
    catch (error) {
        console.error("Error during Data Source initialization:", error);
        process.exit(1);
    }
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get("/users", async function (_req, res) {
        const users = await app_data_source_1.myDataSource.getRepository(user_entity_1.User).find();
        res.json(users);
    });
    app.get("/users/:id", async function (req, res) {
        const user = await app_data_source_1.myDataSource.getRepository(user_entity_1.User).findOneBy({
            id: Number(req.params.id),
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    });
    app.post("/users", async function (req, res) {
        const user = app_data_source_1.myDataSource.getRepository(user_entity_1.User).create(req.body);
        const results = await app_data_source_1.myDataSource.getRepository(user_entity_1.User).save(user);
        return res.status(201).json(results);
    });
    app.put("/users/:id", async function (req, res) {
        const user = await app_data_source_1.myDataSource.getRepository(user_entity_1.User).findOneBy({
            id: Number(req.params.id),
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        app_data_source_1.myDataSource.getRepository(user_entity_1.User).merge(user, req.body);
        const results = await app_data_source_1.myDataSource.getRepository(user_entity_1.User).save(user);
        return res.json(results);
    });
    app.delete("/users/:id", async function (req, res) {
        const results = await app_data_source_1.myDataSource.getRepository(user_entity_1.User).delete(Number(req.params.id));
        return res.json(results);
    });
    app.listen(3000);
}
void main();
