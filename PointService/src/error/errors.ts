export class CustomError extends Error {
  constructor(private statusCode: number, message: string) {
    super(message);
  }

  getStatusCode() {
    return this.statusCode;
  }
}

export class PermissionDeniedError extends CustomError {
  constructor() {
    super(403, 'Permission Denied');
  }
}
export class UnAuthenticatedError extends CustomError {
  constructor() {
    super(401, 'Unauthenticated');
  }
}
export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}
export class UserNotFoundError extends CustomError {
  constructor() {
    super(404, `User not found`);
  }
}
