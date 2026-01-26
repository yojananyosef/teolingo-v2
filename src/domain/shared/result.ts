// Why: Shared result pattern for domain and use case layers.
// Standardizes success and failure handling without throwing exceptions.

export class Result<T, E = DomainError> {
  private constructor(
    private readonly _value: T | null,
    private readonly _error: E | null,
    private readonly _isSuccess: boolean,
  ) {}

  public static ok<T, E = DomainError>(value: T): Result<T, E> {
    return new Result<T, E>(value, null, true);
  }

  public static fail<T, E = DomainError>(error: E): Result<T, E> {
    return new Result<T, E>(null, error, false);
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error("Cannot get value of a failed result");
    }
    return this._value as T;
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error("Cannot get error of a successful result");
    }
    return this._error as E;
  }

  public isSuccess(): this is Result<T, E> & { value: T } {
    return this._isSuccess;
  }

  public isFailure(): this is Result<T, E> & { error: E } {
    return !this._isSuccess;
  }
}

export class DomainError extends Error {
  constructor(public readonly message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
    // Ensure code is SCREAMING_SNAKE_CASE if provided
    if (this.code) {
      this.code = this.code.toUpperCase().replace(/\s+/g, '_');
    }
  }
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
