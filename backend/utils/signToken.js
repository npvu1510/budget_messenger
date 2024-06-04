import jwt from 'jsonwebtoken';

const signToken = (payload, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // const cookieExpireTime = new Date(Date.now());
  // console.log(cookieExpireTime);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN_DAY * 24 * 60 * 60 * 1000
    ),
  });

  return token;
};

export default signToken;
