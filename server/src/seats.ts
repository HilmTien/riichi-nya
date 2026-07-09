export class Seats {
  private clientSeats: Record<"E" | "S" | "W" | "N", string | null> = {
    E: null,
    S: null,
    W: null,
    N: null,
  };

  public join(clientId: string, seat: "E" | "S" | "W" | "N"): void {
    const currentSeat = this.clientSeats[seat];

    if (currentSeat !== null && currentSeat !== clientId) {
      throw new Error("Seat is already taken");
    }

    if (currentSeat === clientId) {
      this.clientSeats[seat] = null;
      return;
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

  public canStart(): boolean {
    for (const plr of ["E", "S", "W", "N"] as const) {
      if (this.clientSeats[plr] === null) {
        return false;
      }
    }
    return true;
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
