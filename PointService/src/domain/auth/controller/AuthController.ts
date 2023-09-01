import { ValidationError, validate } from 'class-validator';
import express from 'express';
import { AuthService } from '../service/AuthService';
import { JwtService } from '../service/JwtService';
import { CreateUserDto } from '../../user/dto/CreateUserDto';
import { BadRequestError } from '../../../error/errors';

export class AuthRoute {
  private router;
  constructor(private authService: AuthService, private jwtService: JwtService) {
    this.router = express.Router();

    this.router.post('/login', async (req, res, next) => {
      try {
        const userData: CreateUserDto = req.body;
        const { cookie, tokenData } = await this.authService.login(req.context, userData);

        res.setHeader('Set-Cookie', [cookie]);
        res.status(200).json({ data: tokenData, message: '로그인 성공' });
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
        res.status(201).json({ data: user, message: '회원가입 성공' });
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
