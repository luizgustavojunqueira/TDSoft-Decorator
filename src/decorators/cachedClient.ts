import { ScoreClient } from "../clients/scoreClient";
import { DecoratorClient } from "./decoratorClient";

interface CacheEntry {
    score: number;
    timestamp: number; // Para validade/expiração
}

export class CachedClient extends DecoratorClient {
    private cache = new Map<string, CacheEntry>();
    constructor(
        client: ScoreClient,
        private validTime: number,
    ) {
        super(client);
    }

    async getScore(cpf: string): Promise<number> {
        const entry = this.cache.get(cpf);
        if (entry && Date.now() - entry.timestamp < this.validTime) {
            return entry.score;
        }

        const score = await this.client.getScore(cpf);
        this.cache.set(cpf, { score, timestamp: Date.now() });
        return score;
    }
}
