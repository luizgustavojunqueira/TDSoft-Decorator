import { CachedClient } from "../src/decorators/cachedClient";
import { ScoreClient } from "../src/clients/scoreClient";

describe("CachedClient", () => {
    class MockClient implements ScoreClient {
        private score = 0;
        async getScore(_: string): Promise<number> {
            this.score++;
            return this.score;
        }
    }

    jest.useFakeTimers();

    let mockClient: MockClient;
    let cachedClient: CachedClient;

    beforeEach(() => {
        mockClient = new MockClient();
        cachedClient = new CachedClient(mockClient, 1000);
    });

    it("retorna valor em cache para chamadas repetidas dentro do tempo de vida", async () => {
        const first = await cachedClient.getScore("111");
        const second = await cachedClient.getScore("111");
        expect(second).toBe(first);
    });

    it("chama o client novamente após expirar o tempo de vida", async () => {
        const first = await cachedClient.getScore("111");
        jest.advanceTimersByTime(1001);
        const second = await cachedClient.getScore("111");
        expect(second).not.toBe(first);
    });

    it("não usa cache para CPFs diferentes", async () => {
        const score1 = await cachedClient.getScore("111");
        const score2 = await cachedClient.getScore("222");
        expect(score2).not.toBe(score1);
    });

    it("chama o client apenas quando necessário", async () => {
        const spy = jest.spyOn(mockClient, "getScore");
        await cachedClient.getScore("111");
        await cachedClient.getScore("111");
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
