import type { Request, Response } from "express";
/**
 * GET ALL PRODUCTS (PUBLIC)
 */
export declare const getAllProducts: (req: Request, res: Response) => Promise<void>;
/**
 * GET PRODUCT BY ID (PUBLIC)
 */
export declare const getProductById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * CREATE PRODUCT (VENDOR)
 */
export declare const createProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * UPDATE PRODUCT (VENDOR)
 */
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * DELETE PRODUCT (VENDOR)
 */
export declare const deleteProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=product.d.ts.map