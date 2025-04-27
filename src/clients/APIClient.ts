import { ScoreClient } from "./scoreClient";

export class APIClient implements ScoreClient {
    private static readonly API_BASE_URL =
        "https://score.hsborges.dev/api/score?cpf=";

    async getScore(cpf: string): Promise<number> {
        const res = await fetch(`${APIClient.API_BASE_URL}${cpf}`);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json: { score: number } = await res.json();

        return json.score;
    }
}
