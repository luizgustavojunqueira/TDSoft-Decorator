export interface ScoreClient {
    getScore(cpf: string): Promise<number>;
}
