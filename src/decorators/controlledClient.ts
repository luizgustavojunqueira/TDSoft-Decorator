import { ScoreClient } from "../clients/scoreClient";
import { DecoratorClient } from "./decoratorClient";

type APIRequest = {
    cpf: string;
    resolve: (score: number) => void;
    reject: (error: Error) => void;
};

export class ControlledClient extends DecoratorClient {
    private queue: APIRequest[] = [];
    private isProcessing = false;

    constructor(client: ScoreClient) {
        super(client);
    }

    async getScore(cpf: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.queue.push({ cpf, resolve, reject });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }
        this.isProcessing = true;

        const item = this.queue.shift();

        if (item) {
            const { cpf, resolve, reject } = item;

            try {
                const score = await this.client.getScore(cpf);
                resolve(score);
            } catch (err: any) {
                reject(err);
            }

            setTimeout(() => {
                this.isProcessing = false;
                this.processQueue();
            }, 1000);
        }
    }
}
