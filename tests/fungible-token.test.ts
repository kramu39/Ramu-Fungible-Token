import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Fungible Token Contract Full Workflow Tests", () => {
  it("should mint tokens and emit ft-mint event", () => {
    const mintTx = simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(100), Cl.standardPrincipal(wallet1)],
      deployer
    );

    expect(mintTx.result).toBeOk(Cl.bool(true));

    const events = mintTx.events || [];
    const mintEvent = events.find(e => e.type === "ft-mint");

    expect(mintEvent).toBeDefined();
    expect(mintEvent!.asset).toBe("ramu-fungible-token");
    expect(mintEvent!.amount).toBe(100n);
    expect(mintEvent!.recipient).toBe(wallet1);

    // Verify wallet1 balance
    const balanceResponse = simnet.callReadOnlyFn(
      "fungible-token",
      "get-balance",
      [Cl.standardPrincipal(wallet1)],
      wallet1
    );
    expect(balanceResponse.result).toBeOk(Cl.uint(100));
  });

  it("should transfer tokens and emit ft-transfer event", () => {
    // Mint tokens first
    simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(50), Cl.standardPrincipal(wallet1)],
      deployer
    );

    const transferTx = simnet.callPublicFn(
      "fungible-token",
      "transfer",
      [
        Cl.uint(42),
        Cl.standardPrincipal(wallet1),
        Cl.standardPrincipal(wallet2),
        Cl.none(),
      ],
      wallet1
    );

    expect(transferTx.result).toBeOk(Cl.bool(true));

    const events = transferTx.events || [];
    const transferEvent = events.find(e => e.type === "ft-transfer");

    expect(transferEvent).toBeDefined();
    expect(transferEvent!.asset).toBe("ramu-fungible-token");
    expect(transferEvent!.amount).toBe(42n);
    expect(transferEvent!.sender).toBe(wallet1);
    expect(transferEvent!.recipient).toBe(wallet2);

    // Verify balances
    const balance1 = simnet.callReadOnlyFn(
      "fungible-token",
      "get-balance",
      [Cl.standardPrincipal(wallet1)],
      wallet1
    );
    const balance2 = simnet.callReadOnlyFn(
      "fungible-token",
      "get-balance",
      [Cl.standardPrincipal(wallet2)],
      wallet2
    );

    expect(balance1.result).toBeOk(Cl.uint(8)); // 50 - 42
    expect(balance2.result).toBeOk(Cl.uint(42));
  });

  it("should reject transfer of more tokens than owned", () => {
    const block = simnet.callPublicFn(
      "fungible-token",
      "transfer",
      [
        Cl.uint(1000),
        Cl.standardPrincipal(wallet2),
        Cl.standardPrincipal(wallet1),
        Cl.none(),
      ],
      wallet2
    );

    expect(block.result).toBeErr(Cl.uint(1)); // insufficient funds
  });

  it("should burn tokens and emit ft-burn event", () => {
    // Mint tokens first
    simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(50), Cl.standardPrincipal(wallet2)],
      deployer
    );

    const burnTx = simnet.callPublicFn(
      "fungible-token",
      "burn",
      [Cl.uint(30)],
      wallet2
    );

    expect(burnTx.result).toBeOk(Cl.bool(true));

    const events = burnTx.events || [];
    const burnEvent = events.find(e => e.type === "ft-burn");

    expect(burnEvent).toBeDefined();
    expect(burnEvent!.asset).toBe("ramu-fungible-token");
    expect(burnEvent!.amount).toBe(30n);
    expect(burnEvent!.sender).toBe(wallet2);

    // Verify wallet2 balance after burn
    const balance = simnet.callReadOnlyFn(
      "fungible-token",
      "get-balance",
      [Cl.standardPrincipal(wallet2)],
      wallet2
    );
    expect(balance.result).toBeOk(Cl.uint(20));
  });

  it("should correctly update total supply after mint, transfer, and burn", () => {
    // Mint 100 tokens to wallet1
    simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(100), Cl.standardPrincipal(wallet1)],
      deployer
    );

    // Mint 50 tokens to wallet2
    simnet.callPublicFn(
      "fungible-token",
      "mint",
      [Cl.uint(50), Cl.standardPrincipal(wallet2)],
      deployer
    );

    // Burn 20 tokens from wallet1
    simnet.callPublicFn(
      "fungible-token",
      "burn",
      [Cl.uint(20)],
      wallet1
    );

    const totalSupply = simnet.callReadOnlyFn(
      "fungible-token",
      "get-total-supply",
      [],
      deployer
    );

    expect(totalSupply.result).toBeOk(Cl.uint(130)); // 100 + 50 - 20
  });
});
