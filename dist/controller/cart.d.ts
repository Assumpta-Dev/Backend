import { Request, Response } from "express";
/**
 * GET CART
 */
export declare const getCart: (req: Request, res: Response) => Promise<void>;
/**
 * ADD TO CART
 */
export declare const addToCart: (req: Request, res: Response) => Promise<void>;
/**
 * UPDATE CART ITEM
 */
export declare const updateCartItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * REMOVE ITEM
 */
export declare const removeCartItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * CLEAR CART
 */
export declare const clearCart: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cart.d.ts.map