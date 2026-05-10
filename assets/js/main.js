(function () {
  const TK = "TK";
  const CART_KEY = "fumeTheoryCart";
  const WISHLIST_KEY = "fumeTheoryWishlist";
  const ORDER_KEY = "fumeTheoryOrders";

  const products = {
    classic: { id: "classic", name: "Hawas Rayhan Classic", price: 1250, image: "./assets/images/hawas.jpeg", rating: "4.8" },
    intense: { id: "intense", name: "Hawas Rayhan Intense", price: 1550, image: "./assets/images/rayhan.jpeg", rating: "4.9" },
    oud: { id: "oud", name: "Hawas Rayhan Oud", price: 1750, image: "./assets/images/afnan.jpeg", rating: "4.9" },
    aqua: { id: "aqua", name: "Hawas Rayhan Aqua", price: 1350, image: "./assets/images/slider.jpg", rating: "4.7" },
    gold: { id: "gold", name: "Hawas Rayhan Gold Edition", price: 1950, image: "./assets/images/product1.jpg", rating: "5.0" },
    midnight: { id: "midnight", name: "Hawas Rayhan Midnight", price: 1650, image: "./assets/images/product.png", rating: "4.8" },
    noir: { id: "noir", name: "Noir Rayhan Extrait", price: 1450, image: "./assets/images/product.png", rating: "4.9" },
    reserve: { id: "reserve", name: "Oud Theory Reserve", price: 1850, image: "./assets/images/hawas.jpeg", rating: "4.8" },
    aquaGold: { id: "aquaGold", name: "Aqua Gold Rayhan", price: 1650, image: "./assets/images/rayhan.jpeg", rating: "4.7" }
  };

  const ingredients = {
    top: [
      { id: "bergamot", name: "Bergamot", icon: "FT" },
      { id: "marine", name: "Marine Mist", icon: "FT" },
      { id: "pink-pepper", name: "Pink Pepper", icon: "FT" },
      { id: "green-apple", name: "Green Apple", icon: "FT" }
    ],
    heart: [
      { id: "jasmine", name: "Jasmine", icon: "FT" },
      { id: "saffron", name: "Saffron", icon: "FT" },
      { id: "rose", name: "Damask Rose", icon: "FT" },
      { id: "lavender", name: "Lavender Silk", icon: "FT" }
    ],
    base: [
      { id: "oud", name: "Royal Oud", icon: "FT" },
      { id: "amber", name: "Amber Resin", icon: "FT" },
      { id: "musk", name: "White Musk", icon: "FT" },
      { id: "vanilla", name: "Vanilla Smoke", icon: "FT" }
    ]
  };

  const mlPrices = { 5: 10, 4: 8, 3: 6, 2: 4 };
  let customSelection = {};

  const money = (value) => `${TK} ${Number(value || 0).toLocaleString("en-BD")}`;
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function toast(message) {
    const host = document.getElementById("toastHost");
    if (!host) return;
    const item = document.createElement("div");
    item.className = "ft-toast";
    item.textContent = message;
    host.appendChild(item);
    setTimeout(() => item.classList.add("show"), 20);
    setTimeout(() => {
      item.classList.remove("show");
      setTimeout(() => item.remove(), 250);
    }, 2800);
  }

  function getCart() { return read(CART_KEY, []); }
  function saveCart(cart) {
    write(CART_KEY, cart);
    renderCart();
    renderCheckout();
  }

  function addCartItem(item) {
    const cart = getCart();
    const existing = cart.find((cartItem) => cartItem.signature === item.signature);
    if (existing && item.type !== "custom") {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: item.qty || 1 });
    }
    saveCart(cart);
    toast(`${item.name} added to cart`);
  }

  function removeCartItem(signature) {
    saveCart(getCart().filter((item) => item.signature !== signature));
    toast("Item removed from cart");
  }

  function cartSubtotal(cart = getCart()) {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function renderCart() {
    const cart = getCart();
    document.querySelectorAll(".count-number").forEach((node) => node.textContent = cart.reduce((sum, item) => sum + item.qty, 0));
    document.querySelectorAll(".cart-items-outer").forEach((wrap) => {
      wrap.innerHTML = cart.length ? cart.map(cartItemTemplate).join("") : `<p class="ft-empty-state">Your cart is waiting for a signature scent.</p>`;
    });
    document.querySelectorAll("#cartTotal").forEach((node) => node.textContent = money(cartSubtotal(cart)));
    document.querySelectorAll(".delete-btn[data-remove]").forEach((btn) => btn.addEventListener("click", () => removeCartItem(btn.dataset.remove)));
  }

  function cartItemTemplate(item) {
    const notes = item.type === "custom" ? `<div class="ft-cart-notes">${noteBreakdown(item.notes)}</div>` : "";
    return `<div class="cart-item-outer">
      <img src="${item.image}" alt="${item.name}" class="cart-product-image">
      <div class="cart-product-name-price">
        <strong class="product-name">${item.name}</strong>
        <span class="product-price">${money(item.price)} x ${item.qty}</span>
        ${notes}
      </div>
      <button type="button" class="delete-btn" data-remove="${item.signature}" aria-label="Remove ${item.name}"><i class="fas fa-trash-alt"></i></button>
    </div>`;
  }

  function noteBreakdown(notes) {
    return ["top", "heart", "base"].map((tier) => {
      const list = notes?.[tier] || [];
      const label = tier.charAt(0).toUpperCase() + tier.slice(1);
      return `<span><b>${label}:</b> ${list.length ? list.map((note) => `${note.name} ${note.ml}ml`).join(", ") : "None"}</span>`;
    }).join("");
  }

  function buildIngredientLab() {
    const host = document.getElementById("ingredientBuilder");
    if (!host) return;
    customSelection = { top: [], heart: [], base: [] };
    host.innerHTML = Object.entries(ingredients).map(([tier, items]) => {
      const title = tier === "top" ? "Top Notes" : tier === "heart" ? "Heart Notes" : "Base Notes";
      return `<div class="ft-note-group" data-tier="${tier}">
        <h3>${title}</h3>
        <div class="ft-ingredient-grid">
          ${items.map((item) => `<article class="ft-ingredient-card" data-ingredient="${item.id}" data-tier="${tier}">
            <button type="button" class="ft-ingredient-toggle" data-toggle-ingredient="${item.id}" data-tier="${tier}">
              <span class="ft-ingredient-icon">${item.icon}</span>
              <strong>${item.name}</strong>
              <small>Choose ML</small>
            </button>
            <div class="ft-qty-options">
              ${Object.keys(mlPrices).map((ml) => `<button type="button" data-set-ml="${ml}" data-ingredient="${item.id}" data-tier="${tier}">${ml}ml - ${mlPrices[ml]} TK</button>`).join("")}
            </div>
          </article>`).join("")}
        </div>
      </div>`;
    }).join("");

    host.querySelectorAll("[data-toggle-ingredient]").forEach((btn) => btn.addEventListener("click", () => toggleIngredient(btn.dataset.tier, btn.dataset.toggleIngredient, 5)));
    host.querySelectorAll("[data-set-ml]").forEach((btn) => btn.addEventListener("click", () => toggleIngredient(btn.dataset.tier, btn.dataset.ingredient, Number(btn.dataset.setMl))));
    updateCustomSummary();
  }

  function toggleIngredient(tier, id, ml) {
    const ingredient = ingredients[tier].find((item) => item.id === id);
    const existingIndex = customSelection[tier].findIndex((item) => item.id === id);
    if (existingIndex >= 0 && customSelection[tier][existingIndex].ml === ml) {
      customSelection[tier].splice(existingIndex, 1);
    } else if (existingIndex >= 0) {
      customSelection[tier][existingIndex].ml = ml;
      customSelection[tier][existingIndex].price = mlPrices[ml];
    } else {
      customSelection[tier].push({ id, name: ingredient.name, ml, price: mlPrices[ml] });
    }
    updateCustomSummary();
  }

  function customTotals() {
    const all = Object.values(customSelection).flat();
    return {
      ml: all.reduce((sum, item) => sum + item.ml, 0),
      price: all.reduce((sum, item) => sum + item.price, 0)
    };
  }

  function updateCustomSummary() {
    document.querySelectorAll(".ft-ingredient-card").forEach((card) => {
      const selected = customSelection[card.dataset.tier].find((item) => item.id === card.dataset.ingredient);
      card.classList.toggle("selected", Boolean(selected));
      card.querySelectorAll("[data-set-ml]").forEach((btn) => btn.classList.toggle("active", selected && Number(btn.dataset.setMl) === selected.ml));
    });
    const summary = document.getElementById("customSummary");
    const totals = customTotals();
    if (summary) summary.innerHTML = noteBreakdown(customSelection);
    const labelText = Object.values(customSelection).flat().map((note) => note.name).slice(0, 3).join(" / ") || "Awaiting notes";
    const blendLabel = document.getElementById("blendLabel");
    if (blendLabel) blendLabel.textContent = labelText;
    const customMl = document.getElementById("customMl");
    const customPrice = document.getElementById("customPrice");
    const customButtonPrice = document.getElementById("customButtonPrice");
    if (customMl) customMl.textContent = `${totals.ml} ml`;
    if (customPrice) customPrice.textContent = money(totals.price);
    if (customButtonPrice) customButtonPrice.textContent = money(totals.price);
  }

  function addCustomBlend() {
    const totals = customTotals();
    if (!totals.ml) {
      toast("Select at least one ingredient first");
      return;
    }
    const notes = JSON.parse(JSON.stringify(customSelection));
    const allNames = Object.values(notes).flat().map((note) => note.name).join(", ");
    addCartItem({
      signature: `custom-${Date.now()}`,
      id: "custom-perfume",
      type: "custom",
      name: "Custom Fume Theory Blend",
      description: allNames,
      image: "./assets/images/product.png",
      price: totals.price,
      ml: totals.ml,
      notes
    });
    document.body.classList.add("cart-open");
  }

  function renderWishlist() {
    const wishlist = read(WISHLIST_KEY, []);
    document.querySelectorAll(".wishlist-count").forEach((node) => node.textContent = wishlist.length);
    const host = document.getElementById("wishlistItems");
    if (!host) return;
    host.innerHTML = wishlist.length ? wishlist.map((item) => `<div class="ft-wishlist-item"><span>${item}</span><button type="button" data-remove-wishlist="${item}">Remove</button></div>`).join("") : `<p class="ft-empty-state">No perfumes saved yet.</p>`;
    host.querySelectorAll("[data-remove-wishlist]").forEach((btn) => btn.addEventListener("click", () => {
      write(WISHLIST_KEY, wishlist.filter((item) => item !== btn.dataset.removeWishlist));
      renderWishlist();
    }));
  }

  function toggleWishlist(name) {
    const wishlist = read(WISHLIST_KEY, []);
    const next = wishlist.includes(name) ? wishlist.filter((item) => item !== name) : [...wishlist, name];
    write(WISHLIST_KEY, next);
    renderWishlist();
    toast(wishlist.includes(name) ? "Removed from wishlist" : "Saved to wishlist");
  }

  function renderCheckout() {
    const host = document.getElementById("checkoutItems");
    if (!host) return;
    const cart = getCart();
    host.innerHTML = cart.length ? cart.map((item) => `<article class="ft-checkout-item">
      <img src="${item.image}" alt="${item.name}">
      <div><h3>${item.name}</h3><p>${money(item.price)} x ${item.qty}</p>${item.type === "custom" ? `<div class="ft-cart-notes">${noteBreakdown(item.notes)}</div><small>Total custom volume: ${item.ml} ml</small>` : ""}</div>
    </article>`).join("") : `<p class="ft-empty-state">Your cart is empty. Add a perfume or custom blend first.</p>`;
    const subtotal = cartSubtotal(cart);
    const delivery = Number(document.querySelector("input[name='area']:checked")?.value || 80);
    const subTotal = document.getElementById("subTotal");
    const deliveryCharge = document.getElementById("deliveryCharge");
    const grandTotal = document.getElementById("grandTotal");
    if (subTotal) subTotal.textContent = money(subtotal);
    if (deliveryCharge) deliveryCharge.textContent = money(delivery);
    if (grandTotal) grandTotal.textContent = money(subtotal + delivery);
  }

  function validateCheckout() {
    const tx = document.getElementById("transactionId");
    const advance = document.getElementById("advanceAmount");
    const btn = document.getElementById("confirmOrderBtn");
    if (!btn || !tx || !advance) return;
    const valid = tx.value.trim().length > 0 && Number(advance.value) >= 200 && getCart().length > 0;
    btn.disabled = !valid;
    btn.innerHTML = valid ? `Confirm Order <i class="fas fa-check"></i>` : `Confirm Order <i class="fas fa-lock"></i>`;
  }

  function submitOrder(event) {
    event.preventDefault();
    const cart = getCart();
    const transactionId = document.getElementById("transactionId").value.trim();
    const advance = Number(document.getElementById("advanceAmount").value);
    if (!cart.length || !transactionId || advance < 200) {
      toast("Please complete cart and advance payment details");
      return;
    }
    const form = new FormData(event.currentTarget);
    const delivery = Number(form.get("area"));
    const order = {
      orderId: `FT-${Date.now().toString().slice(-8)}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      customer: {
        name: form.get("name"),
        phone: form.get("phone"),
        address: form.get("address"),
        areaCharge: delivery
      },
      payment: {
        method: form.get("payment_type"),
        advanceAmount: advance,
        transactionId
      },
      items: cart,
      subtotal: cartSubtotal(cart),
      finalAmount: cartSubtotal(cart) + delivery
    };
    const orders = read(ORDER_KEY, []);
    orders.push(order);
    write(ORDER_KEY, orders);
    saveCart([]);
    const success = document.getElementById("orderSuccess");
    success.hidden = false;
    success.innerHTML = `<strong>Order confirmed.</strong><span>Order ID: ${order.orderId}</span><span>Final amount: ${money(order.finalAmount)}</span>`;
    event.currentTarget.reset();
    document.getElementById("advanceAmount").value = 200;
    validateCheckout();
    toast(`Order ${order.orderId} confirmed`);
  }

  function bindUI() {
    document.querySelectorAll("[data-add-product]").forEach((btn) => btn.addEventListener("click", () => {
      const product = products[btn.dataset.addProduct];
      if (!product) return;
      addCartItem({ ...product, signature: `product-${product.id}`, type: "product" });
    }));
    document.getElementById("addCustomBlend")?.addEventListener("click", addCustomBlend);
    document.querySelectorAll("[data-wishlist]").forEach((btn) => btn.addEventListener("click", () => toggleWishlist(btn.dataset.wishlist)));
    document.querySelectorAll("[data-open-cart]").forEach((btn) => btn.addEventListener("click", () => document.body.classList.add("cart-open")));
    document.querySelectorAll("[data-open-wishlist]").forEach((btn) => btn.addEventListener("click", () => document.body.classList.add("wishlist-open")));
    document.querySelectorAll("[data-close-drawers]").forEach((btn) => btn.addEventListener("click", () => document.body.classList.remove("cart-open", "wishlist-open")));
    document.querySelector(".nav-toggle-btn")?.addEventListener("click", () => {
      document.querySelector(".header__dynamic-page-wrapper")?.classList.toggle("menu-visible");
      document.body.classList.toggle("body-overflow");
    });
    document.querySelectorAll("input[name='area']").forEach((input) => input.addEventListener("change", renderCheckout));
    document.querySelectorAll("input[name='payment_type']").forEach((input) => input.addEventListener("change", () => {
      const instruction = document.getElementById("paymentInstruction");
      if (instruction) instruction.textContent = `${input.value} selected: send minimum 200 TK to 01XXXXXXXXX, then enter Transaction ID.`;
    }));
    document.getElementById("transactionId")?.addEventListener("input", validateCheckout);
    document.getElementById("advanceAmount")?.addEventListener("input", validateCheckout);
    document.getElementById("checkoutForm")?.addEventListener("submit", submitOrder);
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildIngredientLab();
    bindUI();
    renderCart();
    renderWishlist();
    renderCheckout();
    validateCheckout();
  });
})();



