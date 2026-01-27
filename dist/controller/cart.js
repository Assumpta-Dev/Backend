import { CartModel } from "../model/cart";
/**
 * GET CART
 */
export const getCart = async (req, res) => {
    const userId = req.user._id;
    let cart = await CartModel.findOne({ userId }).populate("items.productId");
    if (!cart) {
        cart = await CartModel.create({ userId, items: [] });
    }
    res.json(cart);
};
/**
 * ADD TO CART
 */
export const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
        cart = await CartModel.create({ userId, items: [] });
    }
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.status(201).json(cart);
};
/**
 * UPDATE CART ITEM
 */
export const updateCartItem = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
};
/**
 * REMOVE ITEM
 */
export const removeCartItem = async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    res.status(204).send();
};
/**
 * CLEAR CART
 */
export const clearCart = async (req, res) => {
    const userId = req.user._id;
    await CartModel.findOneAndUpdate({ userId }, { items: [] });
    res.status(204).send();
};
//# sourceMappingURL=cart.js.map