import jwt from '../utils/jwt';

it(`인증 토큰 생성, 인증 테스트`, () => {
  const decoded = jwt.sign({
    email: 'test@test.com',
    password: 'test',
  });

  const verified = jwt.verify(decoded);

  const { email, password } = verified as any;

  expect(email).toEqual('test@test.com');
  expect(password).toEqual('test');
});
