import { Request, Response } from "express";
/**
 * GET ALL USERS (Admin only)
 */
export declare const getAllUsers: (_req: Request, res: Response) => Promise<void>;
/**
 * GET USER BY ID (Admin only)
 */
export declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * UPDATE USER (Admin only)
 */
export declare const updateUser: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * DELETE USER (Admin only)
 */
export declare const deleteUser: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    getAllUsers: (_req: Request, res: Response) => Promise<void>;
    getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateUser: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteUser: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;
//# sourceMappingURL=users.d.ts.map