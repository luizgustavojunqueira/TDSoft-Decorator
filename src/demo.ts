import { APIClient } from "./clients/APIClient";
import { CachedClient } from "./decorators/cachedClient";
import { ControlledClient } from "./decorators/controlledClient";

async function main() {
    const client = new CachedClient(
        new ControlledClient(new APIClient()),
        10000,
    );

    const cpfs = [
        "03186117089",
        "92157264701",
        "86240515680",
        "85830265486",
        "83053532140",
        "83053532140", // Repetindo CPF para validar cache
        "81871364132",
        "04088772199",
    ];

    console.log("Primeiras requisições, com cache vazio");
    for (const cpf of cpfs) {
        const start = Date.now();
        const score = await client.getScore(cpf);

        console.log(
            `CPF: ${cpf}, Score: ${score} (em ${Date.now() - start} ms)`,
        );
    }

    console.log("Refazendo mesmas requisições, com cache populado");
    for (const cpf of cpfs) {
        const start = Date.now();
        const score = await client.getScore(cpf);

        console.log(
            `CPF: ${cpf}, Score: ${score} (em ${Date.now() - start} ms)`,
        );
    }

    console.log("Esperando 10 segundos para invalidar cache...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    console.log("Refazendo as mesmas requisoções com cache expirado");
    for (const cpf of cpfs) {
        const start = Date.now();
        const score = await client.getScore(cpf);

        console.log(
            `CPF: ${cpf}, Score: ${score} (em ${Date.now() - start} ms)`,
        );
    }
}

main().catch(console.error);
