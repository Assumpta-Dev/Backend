import { Request, Response } from "express";
/**
 * GET ALL USERS (admin use)
 */
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
/**
 * GET USER BY ID
 */
export declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * UPDATE USER
 */
export declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * DELETE USER
 */
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;
//# sourceMappingURL=users.d.ts.map