export class Seats {
  private clientSeats: Record<"E" | "S" | "W" | "N", string | null> = {
    E: null,
    S: null,
    W: null,
    N: null,
  };

  private clientLeaveSeat(clientId: string): void {
    for (const plr of ["E", "S", "W", "N"] as const) {
      if (this.clientSeats[plr] === clientId) {
        this.clientSeats[plr] = null;
      }
    }
  }

  public join(clientId: string, seat: "E" | "S" | "W" | "N"): void {
    const currentSeat = this.clientSeats[seat];

    if (currentSeat !== null && currentSeat !== clientId) {
      throw new Error("Seat is already taken");
    }

    this.clientLeaveSeat(clientId);

    this.clientSeats[seat] = clientId;
  }

  public leave(clientId: string): void {
    this.clientLeaveSeat(clientId);
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

  public rotateSeats(): void {
    const newSeats: Record<"E" | "S" | "W" | "N", string | null> = {
      E: this.clientSeats.N,
      S: this.clientSeats.E,
      W: this.clientSeats.S,
      N: this.clientSeats.W,
    };

    this.clientSeats = newSeats;
  }
}
