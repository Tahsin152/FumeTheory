# Fume Theory Implementation Guide

## 1. Homepage

Edit `index.html`.

- Hero section: `section.ft-hero`
- Category cards: `section#collections`
- Featured perfume cards: `section#featured`
- Mixology Lab: `section#mixology-lab`
- Cart and wishlist drawers: `#cartDrawer`, `#wishlistDrawer`

To add a new category, copy one `.ft-category-card` and change the image, title, and `data-add-product` key.

## 2. Product Data

Edit `assets/js/main.js`.

All normal perfume products live in the `products` object:

```js
classic: {
  id: "classic",
  name: "Hawas Rayhan Classic",
  price: 1250,
  image: "./assets/images/hawas.jpeg",
  rating: "4.8"
}
```

The button `data-add-product="classic"` must match the product key.

## 3. Mix Your Own Scent

Edit `assets/js/main.js`.

Ingredients live in the `ingredients` object under:

- `top`
- `heart`
- `base`

Pricing is controlled by:

```js
const mlPrices = { 5: 10, 4: 8, 3: 6, 2: 4 };
```

The builder supports multiple ingredients, quantity changes, remove-on-second-click, total ml, final price, and cart saving.

## 4. Cart And Wishlist

The cart is saved in browser localStorage as:

```txt
fumeTheoryCart
```

The wishlist is saved as:

```txt
fumeTheoryWishlist
```

Cart rendering is handled by:

- `addCartItem()`
- `renderCart()`
- `removeCartItem()`
- `cartItemTemplate()`

## 5. Checkout

Edit `checkout.html` for markup and `assets/js/main.js` for behavior.

Checkout validates:

- cart is not empty
- advance amount is at least `200`
- transaction ID is not empty

Orders are saved in browser localStorage as:

```txt
fumeTheoryOrders
```

Each saved order includes:

- order ID
- customer info
- payment method
- advance amount
- transaction ID
- product and custom perfume item details
- subtotal and final amount

## 6. Styling

Edit `assets/css/style.css`.

The Fume Theory design starts at:

```css
/* Fume Theory luxury rebuild */
```

The final override layer starts at:

```css
/* Fume Theory final cascade */
```

Use the same variables for future changes:

```css
--ft-black
--ft-gold
--ft-soft-gold
--ft-cream
--ft-muted
--ft-line
```

## 7. Backend Upgrade Later

When adding a real backend, replace localStorage calls in `assets/js/main.js`:

- `write(ORDER_KEY, orders)` should become an API call like `POST /orders`
- `getCart()` can be replaced with a user/session cart API
- payment transaction ID should be verified by your bKash/Nagad merchant backend before marking the order confirmed

## 8. Run Locally

From this folder:

```bash
python -m http.server 8090
```

Open:

```txt
http://localhost:8090/index.html
```
