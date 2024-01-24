import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a new interface extending the Express Request interface
interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // Define the 'user' property of type JwtPayload
}

const validateToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;
  let authHeader: string | string[] | undefined = req.headers['Authorization'] || req.headers['authorization'];
  
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT as string, (err: any, decoded: any) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user as AuthenticatedRequest['user'];
      next();
    });
  }

  if (!token) {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

// Jwt token generate
const generateToken = (userId:any): string => {
  // console.log(userId,"genet token")
  const token: string = jwt.sign({ user: userId }, process.env.ACCESS_TOKEN_SECERT as string, { expiresIn: '1h' }); // You can adjust the expiration time as needed
  return token;
};

export { validateToken, generateToken, AuthenticatedRequest };
