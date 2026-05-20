// Why: Rich domain model for User entity, encapsulating point progression, levels, and streak invariants.

export interface UserProps {
  id: string;
  email: string;
  displayName: string;
  points: number;
  level: number;
  streak: number;
  lastStreakDate: Date | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(props: UserProps): User {
    return new User(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get email(): string {
    return this.props.email;
  }

  public get displayName(): string {
    return this.props.displayName;
  }

  public get points(): number {
    return this.props.points;
  }

  public get level(): number {
    return this.props.level;
  }

  public get streak(): number {
    return this.props.streak;
  }

  public get lastStreakDate(): Date | null {
    return this.props.lastStreakDate;
  }

  public get role(): string {
    return this.props.role;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Adds points to the user and automatically calculates the new level.
   */
  public addPoints(amount: number): void {
    if (amount <= 0) return;
    this.props.points += amount;
    this.props.level = Math.floor(this.props.points / 100) + 1;
    this.props.updatedAt = new Date();
  }

  /**
   * Updates user streak based on activity passing status and today's date.
   */
  public updateStreak(today: Date, isPassed: boolean): void {
    if (!isPassed) return;

    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (!this.props.lastStreakDate) {
      this.props.streak = 1;
      this.props.lastStreakDate = todayDateOnly;
    } else {
      const lastDate = new Date(
        this.props.lastStreakDate.getFullYear(),
        this.props.lastStreakDate.getMonth(),
        this.props.lastStreakDate.getDate(),
      );

      const diffInDays = Math.floor(
        (todayDateOnly.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffInDays === 1) {
        this.props.streak += 1;
        this.props.lastStreakDate = todayDateOnly;
      } else if (diffInDays > 1) {
        this.props.streak = 1;
        this.props.lastStreakDate = todayDateOnly;
      }
      // Note: diffInDays === 0 means already active today, streak is preserved and date is unchanged
    }
    this.props.updatedAt = new Date();
  }

  public toSnapshot(): UserProps {
    return { ...this.props };
  }
}
