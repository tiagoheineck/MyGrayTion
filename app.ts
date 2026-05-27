import "reflect-metadata"

import express, { Request, Response } from "express"
import { myDataSource } from "./app-data-source"
import { User } from "./entities/user.entity"

async function main(): Promise<void> {
    try {
        await myDataSource.initialize()
        console.log("Data Source has been initialized!")
    } catch (error) {
        console.error("Error during Data Source initialization:", error)
        process.exit(1)
    }

    const app = express()
    app.use(express.json())

    app.get("/users", async function (_req: Request, res: Response) {
        const users = await myDataSource.getRepository(User).find()
        res.json(users)
    })

    app.get("/users/:id", async function (req: Request, res: Response) {
        const user = await myDataSource.getRepository(User).findOneBy({
            id: Number(req.params.id),
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.json(user)
    })

    app.post("/users", async function (req: Request, res: Response) {
        const user = myDataSource.getRepository(User).create(req.body)
        const results = await myDataSource.getRepository(User).save(user)
        return res.status(201).json(results)
    })

    app.put("/users/:id", async function (req: Request, res: Response) {
        const user = await myDataSource.getRepository(User).findOneBy({
            id: Number(req.params.id),
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        myDataSource.getRepository(User).merge(user, req.body)
        const results = await myDataSource.getRepository(User).save(user)
        return res.json(results)
    })

    app.delete("/users/:id", async function (req: Request, res: Response) {
        const results = await myDataSource.getRepository(User).delete(Number(req.params.id))
        return res.json(results)
    })

    app.listen(3000)
}

void main()