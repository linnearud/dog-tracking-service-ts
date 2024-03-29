export class ForbiddenError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 403;
  }
}

export class NotFoundError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 404;
  }
}

export class BadRequestError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}
