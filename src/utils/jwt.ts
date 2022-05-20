import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

type JwtSignPayload = {
  email: string;
  password: string;
};

function verify(token: string) {
  if (!secret) {
    throw new Error(`JWT secret isn't exist`);
  }
  const decoded = jwt.verify(token, secret);
  return decoded;
}

/**
 * access token 발급
 */
function sign(payload: JwtSignPayload): string {
  if (!secret) {
    throw new Error(`jwt secret isn't exist`);
  }

  return jwt.sign(payload, secret, {
    algorithm: 'HS256', // 암호화 알고리즘
    expiresIn: '1h', // 유효시간
  });
}

export default { sign, verify };
