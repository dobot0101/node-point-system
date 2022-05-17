import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

type JwtPayload = {
  email: string;
  password: string;
};

/**
 * access token 검증
 */
function verify(token: string) {
  try {
    if (!secret) {
      throw new Error(`jwt secret isn't exist`);
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    return {
      success: true,
      email: decoded.email,
      password: decoded.password,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
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
