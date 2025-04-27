// testes/ControlledClient.test.ts
import { ControlledClient } from "../src/decorators/controlledClient";
import { ScoreClient } from "../src/clients/scoreClient";

describe("ControlledClient", () => {
    jest.useFakeTimers();

    let mockClient: ScoreClient;
    let controlledClient: ControlledClient;

    beforeEach(() => {
        mockClient = {
            getScore: jest.fn(),
        };
        controlledClient = new ControlledClient(mockClient);
    });

    it("deve processar chamadas em sequência com delay de 1 segundo", async () => {
        (mockClient.getScore as jest.Mock).mockImplementation(
            async (_: string) => {
                return 100;
            },
        );

        const cpfs = ["111", "222", "333"];

        const promises = cpfs.map((cpf) => controlledClient.getScore(cpf));

        jest.advanceTimersByTime(0);
        await Promise.resolve();

        expect(mockClient.getScore).toHaveBeenCalledTimes(1);
        expect(mockClient.getScore).toHaveBeenCalledWith("111");

        jest.advanceTimersByTime(1000);
        await Promise.resolve();

        expect(mockClient.getScore).toHaveBeenCalledTimes(2);
        expect(mockClient.getScore).toHaveBeenCalledWith("222");

        jest.advanceTimersByTime(1000);
        await Promise.resolve();

        expect(mockClient.getScore).toHaveBeenCalledTimes(3);
        expect(mockClient.getScore).toHaveBeenCalledWith("333");

        const results = await Promise.all(promises);
        expect(results).toEqual([100, 100, 100]);
    });

    it("deve propagar erros do client", async () => {
        (mockClient.getScore as jest.Mock).mockImplementation(() => {
            throw new Error("Erro no client");
        });

        const promise = controlledClient.getScore("111");

        jest.advanceTimersByTime(0);
        await Promise.resolve();

        await expect(promise).rejects.toThrow("Erro no client");
    });
});
