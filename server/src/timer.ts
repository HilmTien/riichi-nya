const MAX_CALL_COUNT = 4;

export class Timer {
  private turnTime: number;
  private callTime: number;
  private extraTime: number;
  private extraTimers: Record<"E" | "S" | "W" | "N", number>;

  private currentTurn: "E" | "S" | "W" | "N";

  private skipVotes: Set<"E" | "S" | "W" | "N"> = new Set();

  private riichiPlayers: Set<"E" | "S" | "W" | "N"> = new Set();
  private nonMenzenchinPlayers: Set<"E" | "S" | "W" | "N"> = new Set([
    "E",
    "S",
    "W",
    "N",
  ]);
  private calledChiiOrPon?: "E" | "S" | "W" | "N";
  private callCount: Record<"E" | "S" | "W" | "N", number> = {
    E: 0,
    S: 0,
    W: 0,
    N: 0,
  };

  private turnTimer: number;
  private callTimer: number;
  private timer?: NodeJS.Timeout;

  private hasStarted: boolean = false;

  private state: "call" | "discard" = "discard";

  constructor(turnTime: number, extraTime: number, callTime: number) {
    this.turnTime = turnTime;
    this.callTime = callTime;
    this.extraTime = extraTime;
    this.turnTimer = turnTime;
    this.callTimer = callTime;
    this.extraTimers = {
      E: extraTime,
      S: extraTime,
      W: extraTime,
      N: extraTime,
    };
    this.currentTurn = "E";
  }

  private requireStarted(): void {
    if (!this.hasStarted) {
      throw new Error("Game must be started");
    }
  }

  private turnUpdate(): void {
    this.timer && clearTimeout(this.timer);
    this.timer && clearInterval(this.timer);
    this.timer = undefined;
    this.turnTimer = this.turnTime;
    this.callTimer = this.callTime;

    this.skipVotes.clear();
  }

  private getNaturalNextTurn(): "E" | "S" | "W" | "N" {
    const turns: ("E" | "S" | "W" | "N")[] = ["E", "S", "W", "N"];
    const currentIndex = turns.indexOf(this.currentTurn);
    const nextIndex = (currentIndex + 1) % turns.length;
    return turns[nextIndex];
  }

  public getTurnTime(): number {
    return this.turnTime;
  }

  public getCallTime(): number {
    return this.callTime;
  }

  public getExtraTime(): number {
    return this.extraTime;
  }

  public getExtraTimers(): Record<"E" | "S" | "W" | "N", number> {
    return this.extraTimers;
  }

  public getTurnTimer(): number {
    return this.turnTimer;
  }

  public getCallTimer(): number {
    return this.callTimer;
  }

  public getCurrentTurn(): "E" | "S" | "W" | "N" {
    return this.currentTurn;
  }

  public getHasStarted(): boolean {
    return this.hasStarted;
  }

  public getState(): "call" | "discard" {
    return this.state;
  }

  public getRiichiPlayers(): Set<"E" | "S" | "W" | "N"> {
    return this.riichiPlayers;
  }

  public getNonMenzenchinPlayers(): Set<"E" | "S" | "W" | "N"> {
    return this.nonMenzenchinPlayers;
  }

  public getCallCount(): Record<"E" | "S" | "W" | "N", number> {
    return this.callCount;
  }

  private setCurrentTurn(turn: "E" | "S" | "W" | "N"): void {
    this.currentTurn = turn;
    this.turnUpdate();
  }

  private startDiscardTimer(onTimeout: () => void): void {
    console.log("started discard timer");

    this.state = "discard";
    this.timer = setInterval(() => {
      console.log("discard: ", this.turnTimer);
      if (this.turnTimer <= 0) {
        this.startDiscardExtraTimer(onTimeout);
        onTimeout();
        return;
      }

      this.turnTimer -= 1;
    }, 1000);
  }

  private startDiscardExtraTimer(onTimeout: () => void): void {
    console.log("started discard extra timer");

    this.timer = setInterval(() => {
      console.log("extra: ", this.extraTimers[this.currentTurn]);
      if (this.extraTimers[this.currentTurn] <= 0) {
        console.log("autodiscarding");
        this.turnUpdate();
        this.calledChiiOrPon = undefined;
        this.startCallTimer(onTimeout);
        onTimeout();
        return;
      }

      this.extraTimers[this.currentTurn] -= 1;
    }, 1000);
  }

  private startCallTimer(onTimeout: () => void): void {
    this.state = "call";
    console.log("started call timer");
    this.timer = setInterval(() => {
      console.log("call: ", this.callTimer);
      if (this.callTimer <= 0) {
        this.setCurrentTurn(this.getNaturalNextTurn());
        this.startDiscardTimer(onTimeout);
        onTimeout();
        return;
      }

      this.callTimer -= 1;
    }, 1000);
  }

  public start(onTimeout: () => void): void {
    this.hasStarted = true;
    this.setCurrentTurn("E");
    this.startDiscardTimer(onTimeout);
  }

  public voteSkip(
    player: "E" | "S" | "W" | "N",
    onSkipped: () => void,
    onTimeout: () => void,
  ): void {
    this.requireStarted();

    this.skipVotes.add(player);

    const playersExceptCurrent = ["E", "S", "W", "N"].filter(
      (p) => p !== this.currentTurn,
    ) as ("E" | "S" | "W" | "N")[];

    if (
      this.skipVotes.has(playersExceptCurrent[0]) &&
      this.skipVotes.has(playersExceptCurrent[1]) &&
      this.skipVotes.has(playersExceptCurrent[2])
    ) {
      this.setCurrentTurn(this.getNaturalNextTurn());
      onSkipped();
      this.startDiscardTimer(onTimeout);
    }
  }

  public call(
    caller: "E" | "S" | "W" | "N",
    type: "pon" | "chii" | "kan",
    onDiscardTimeout: () => void,
  ): void {
    this.requireStarted();

    if (this.callCount[caller] >= MAX_CALL_COUNT) {
      throw new Error(`Calls can only be made maximum ${MAX_CALL_COUNT} times`);
    }

    switch (type) {
      case "pon":
        if (caller === this.getCurrentTurn())
          throw new Error("Pon cannot be called by the current player");
        if (this.riichiPlayers.has(caller))
          throw new Error(
            "Pon cannot be called by a player who has declared Riichi",
          );
        if (this.state !== "call")
          throw new Error("Pon can only be called after discards");
        this.nonMenzenchinPlayers.add(caller);
        this.calledChiiOrPon = caller;
        break;
      case "chii":
        if (caller === this.getCurrentTurn())
          throw new Error("Chii cannot be called by the current player");
        if (this.riichiPlayers.has(caller))
          throw new Error(
            "Chii cannot be called by a player who has declared Riichi",
          );
        if (this.state !== "call")
          throw new Error("Chii can only be called after discards");
        if (caller !== this.getNaturalNextTurn())
          throw new Error(
            "Chii can only be called by the next player in turn order",
          );
        this.nonMenzenchinPlayers.add(caller);
        this.calledChiiOrPon = caller;
        break;
      case "kan":
        if (this.riichiPlayers.has(caller) && caller !== this.getCurrentTurn())
          throw new Error(
            "Open Kan cannot be called by a player who has declared Riichi",
          );
        if (caller !== this.getCurrentTurn()) {
          this.nonMenzenchinPlayers.add(caller);
        } else if (this.calledChiiOrPon === caller)
          throw new Error("Closed Kan cannot be called after a Chii or Pon");
        break;
    }

    this.setCurrentTurn(caller);
    this.callCount[caller] += 1;
    this.startDiscardTimer(onDiscardTimeout);
  }

  public riichi(
    caller: "E" | "S" | "W" | "N",
    onCallTimeout: () => void,
  ): void {
    this.requireStarted();

    if (caller !== this.getCurrentTurn())
      throw new Error("Riichi can only be called by the current player");

    if (this.state !== "discard")
      throw new Error("Riichi can only be called after drawing a tile");

    if (this.nonMenzenchinPlayers.has(caller))
      throw new Error("Riichi can only be called with menzenchin hand");

    if (this.calledChiiOrPon === caller)
      throw new Error("Riichi cannot be called after a Chii or Pon");

    this.riichiPlayers.add(caller);
    this.turnUpdate();
    this.startCallTimer(onCallTimeout);
  }

  public discard(onCallTimeout: () => void): void {
    this.requireStarted();

    if (this.state !== "discard")
      throw new Error("Discards can only happen after drawing a tile");

    this.turnUpdate();
    this.calledChiiOrPon = undefined;
    this.startCallTimer(onCallTimeout);
  }

  public ron(caller: "E" | "S" | "W" | "N"): void {
    this.requireStarted();

    if (caller === this.getCurrentTurn())
      throw new Error("Ron cannot be called by the current player");

    if (this.state !== "call")
      throw new Error("Ron can only be called after discards");

    this.setCurrentTurn(caller);
    this.hasStarted = false;
  }

  public tsumo(caller: "E" | "S" | "W" | "N"): void {
    this.requireStarted();

    if (this.state !== "discard")
      throw new Error("Tsumo can only be called after drawing a tile");

    if (caller !== this.getCurrentTurn())
      throw new Error("Tsumo can only be called by the current player");

    if (this.calledChiiOrPon === caller)
      throw new Error("Riichi cannot be called after a Chii or Pon");

    this.setCurrentTurn(caller);
    this.hasStarted = false;
  }

  public reset(): void {
    this.setCurrentTurn("E");
    this.state = "discard";
    this.extraTimers = {
      E: this.extraTime,
      S: this.extraTime,
      W: this.extraTime,
      N: this.extraTime,
    };
    this.riichiPlayers.clear();
    this.nonMenzenchinPlayers.clear();
    this.calledChiiOrPon = undefined;
    this.hasStarted = false;
    this.callCount = {
      E: 0,
      S: 0,
      W: 0,
      N: 0,
    };
  }
}
