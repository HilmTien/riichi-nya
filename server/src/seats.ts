export class Seats {
  private clientSeats: Record<"E" | "S" | "W" | "N", string | null> = {
    E: null,
    S: null,
    W: null,
    N: null,
  };

  public join(clientId: string, seat: "E" | "S" | "W" | "N"): void {
    const currentClient = this.clientSeats[seat];

    if (currentClient !== null && currentClient !== clientId) {
      throw new Error("Seat is already taken");
    }

    for (const plr of ["E", "S", "W", "N"] as const) {
      if (this.clientSeats[plr] === clientId) {
        this.clientSeats[plr] = null;
      }
    }

    this.clientSeats[seat] = clientId;
  }

  public getSeat(seat: "E" | "S" | "W" | "N"): string | null {
    return this.clientSeats[seat];
  }

  public getSeats(): Record<"E" | "S" | "W" | "N", string | null> {
    return { ...this.clientSeats };
  }

  public reset(): void {
    this.clientSeats = {
      E: null,
      S: null,
      W: null,
      N: null,
    };
  }
}
