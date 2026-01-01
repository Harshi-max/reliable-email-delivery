import { QueuedEmail, QueueManager } from "../types"

export class MemoryQueueManager implements QueueManager {
    private queue: QueuedEmail[] = []

    async push(email: QueuedEmail): Promise<void> {
        this.queue.push(email)
    }

    async pop(): Promise<QueuedEmail | undefined> {
        return this.queue.shift()
    }

    async peek(): Promise<QueuedEmail | undefined> {
        return this.queue[0]
    }

    async getAll(): Promise<QueuedEmail[]> {
        return [...this.queue]
    }

    async remove(id: string): Promise<void> {
        this.queue = this.queue.filter((email) => email.id !== id)
    }

    async update(updatedEmail: QueuedEmail): Promise<void> {
        const index = this.queue.findIndex((email) => email.id === updatedEmail.id)
        if (index !== -1) {
            this.queue[index] = updatedEmail
        }
    }

    async size(): Promise<number> {
        return this.queue.length
    }
}
