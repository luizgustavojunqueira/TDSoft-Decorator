import { ScoreClient } from "../clients/scoreClient";

export abstract class DecoratorClient implements ScoreClient {
    constructor(protected client: ScoreClient) {}
    abstract getScore(cpf: string): Promise<number>;
}
