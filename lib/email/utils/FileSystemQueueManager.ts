import fs from "fs/promises"
import path from "path"
import { QueuedEmail, QueueManager } from "../types"

export class FileSystemQueueManager implements QueueManager {
    private filePath: string

    constructor(filename = "email-queue.json") {
        this.filePath = path.join(process.cwd(), "data", filename)
        this.ensureDirectory()
    }

    private async ensureDirectory() {
        const dir = path.dirname(this.filePath)
        try {
            await fs.mkdir(dir, { recursive: true })
        } catch (error) {
            // Directory already exists or cannot be created
        }
    }

    private async readQueue(): Promise<QueuedEmail[]> {
        try {
            const data = await fs.readFile(this.filePath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    private async writeQueue(queue: QueuedEmail[]): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(queue, null, 2), "utf-8")
    }

    async push(email: QueuedEmail): Promise<void> {
        const queue = await this.readQueue()
        queue.push(email)
        await this.writeQueue(queue)
    }

    async pop(): Promise<QueuedEmail | undefined> {
        const queue = await this.readQueue()
        const email = queue.shift()
        await this.writeQueue(queue)
        return email
    }

    async peek(): Promise<QueuedEmail | undefined> {
        const queue = await this.readQueue()
        return queue[0]
    }

    async getAll(): Promise<QueuedEmail[]> {
        return await this.readQueue()
    }

    async remove(id: string): Promise<void> {
        const queue = await this.readQueue()
        const filtered = queue.filter((email) => email.id !== id)
        await this.writeQueue(filtered)
    }

    async update(updatedEmail: QueuedEmail): Promise<void> {
        const queue = await this.readQueue()
        const index = queue.findIndex((email) => email.id === updatedEmail.id)
        if (index !== -1) {
            queue[index] = updatedEmail
            await this.writeQueue(queue)
        }
    }

    async size(): Promise<number> {
        const queue = await this.readQueue()
        return queue.length
    }
}
