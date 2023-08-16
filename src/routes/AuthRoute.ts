import { ValidationError, validate } from 'class-validator';
import express from 'express';
import { AuthService } from '../domain/auth/service/AuthService';
import { JwtService } from '../domain/auth/service/JwtService';
import { CreateUserDto } from '../domain/user/dto/CreateUserDto';
import { BadRequestError } from '../error/errors';

export class ContextManager {
  getOrCreateContext(req: Request) {}
}

export class AuthRoute {
  private router;
  constructor(private authService: AuthService, private jwtService: JwtService) {
    this.router = express.Router();

    this.router.post('/login', async (req, res, next) => {
      try {
        const userData: CreateUserDto = req.body;
        const { cookie, user } = await this.authService.login(req.context, userData);

        res.setHeader('Set-Cookie', [cookie]);
        res.status(200).json({ data: user, message: 'login' });
      } catch (error) {
        next(error);
      }
    });

    this.router.post('/register', async (req, res, next) => {
      try {
        const { body } = req;
        const createUserDto = new CreateUserDto();
        createUserDto.email = body.email;
        createUserDto.password = body.password;

        const errors = await validate(createUserDto);
        if (errors.length > 0) {
          throw new BadRequestError(getErrorMessageFromValidationErrors(errors));
        }

        const user = await this.authService.signUp(req.context, createUserDto);
        res.status(201).json({ data: user, message: 'signed up' });
        res.json(user);
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

function getErrorMessageFromValidationErrors(errors: ValidationError[]) {
  const constraints: { [key: string]: string[] } = {};
  errors.forEach((error) => {
    const propertyName = error.property;
    const errorConstraints = Object.values(error.constraints!);
    constraints[propertyName] = errorConstraints;
  });
  const errorMessage = JSON.stringify(constraints);
  return errorMessage;
}
