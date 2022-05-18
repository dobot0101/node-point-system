import jwt from 'jsonwebtoken';
import { exit } from 'process';
const secret = process.env.JWT_SECRET;

type JwtPayload = {
  email: string;
  password: string;
};

/**
 * access token 검증
 */
type VerifyReturn = {
  success: boolean;
  email?: string;
  password?: string;
  error?: string;
};

function verify(token: string): VerifyReturn {
  const result: VerifyReturn = {
    success: false,
  };
  try {
    if (!secret) {
      throw new Error(`jwt secret이 존재하지 않습니다.`);
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    result.success = true;
    result.email = decoded.email;
    result.password = decoded.password;
  } catch (err) {
    const error = err as Error;
    result.success = false;
    result.error = error.message;
  }
  return result;
}

/**
 * access token 발급
 */
function sign(user: JwtPayload): string {
  if (!secret) {
    throw new Error(`jwt secret isn't exist`);
  }

  const payload: JwtPayload = {
    email: user.email,
    password: user.password,
  };

  return jwt.sign(payload, secret, {
    algorithm: 'HS256', // 암호화 알고리즘
    expiresIn: '1h', // 유효시간
  });
}

export default { sign, verify };
