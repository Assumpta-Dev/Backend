import { Request, Response } from "express";
/**
 * REGISTER USER
 */
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * LOGIN USER
 */
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET USER PROFILE
 */
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map