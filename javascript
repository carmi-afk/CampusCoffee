const cart = new Map();
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const itemCount = document.getElementById("itemCount");
    const grandTotal = document.getElementById("grandTotal");

    function getTotal() {
      return [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function getQuantity() {
      return [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
    }

    function renderCart() {
      const entries = [...cart.values()];
      cartItems.innerHTML = entries.length ? entries.map(item => `
        <div class="cart-row">
          <div>
            <p class="cart-item-name">${item.name}</p>
            <span class="cart-item-price">${peso(item.price)} each</span>
          </div>
          <div>
            <div class="cart-item-subtotal">${peso(item.price * item.quantity)}</div>
            <div class="cart-controls">
              <button class="qty-btn" type="button" data-minus="${item.id}" aria-label="Decrease ${item.name} quantity"><i class="fa-solid fa-minus"></i></button>
              <span class="qty-value" aria-label="Quantity">${item.quantity}</span>
              <button class="qty-btn" type="button" data-plus="${item.id}" aria-label="Increase ${item.name} quantity"><i class="fa-solid fa-plus"></i></button>
              <button class="remove-btn" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}" title="Remove item"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>
        </div>
      `).join("") : `
        <div class="empty-cart">
          <div class="empty-illustration"><i class="fa-solid fa-basket-shopping"></i></div>
          <strong>Your basket is taking a break</strong>
          <span>Add something tasty from the menu.</span>
        </div>
      `;

      const quantity = getQuantity();
      cartCount.textContent = quantity;
      itemCount.textContent = `${quantity} ${quantity === 1 ? "item" : "items"}`;
      grandTotal.textContent = peso(getTotal());
    }

    function addToCart(id) {
      const product = products.find(item => item.id === id);
      if (!product) return;
      const existing = cart.get(id);
      if (existing) existing.quantity += 1;
      else cart.set(id, { ...product, quantity: 1 });
      renderCart();
    }

    function changeQuantity(id, delta) {
      const item = cart.get(id);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) cart.delete(id);
      renderCart();
    }

    function removeItem(id) {
      cart.delete(id);
      renderCart();
    }

    menuGrid.addEventListener("click", event => {
      const button = event.target.closest("[data-add]");
      if (button) addToCart(Number(button.dataset.add));
    });

    cartItems.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.plus) changeQuantity(Number(button.dataset.plus), 1);
      else if (button.dataset.minus) changeQuantity(Number(button.dataset.minus), -1);
      else if (button.dataset.remove) removeItem(Number(button.dataset.remove));
    });

    renderCart();