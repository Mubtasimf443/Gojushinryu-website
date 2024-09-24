     // Sample cart data
     const cartItems = [
        { id: 1, name: "Product 1", price: 29.99, quantity: 1 },
        { id: 2, name: "Product 2", price: 49.99, quantity: 2 },
    ];
    
    // Function to render cart items in the table
    function renderCart() {
        const cartBody = document.getElementById("cart-body");
        const totalItemsEl = document.getElementById("total-items");
        const totalPriceEl = document.getElementById("total-price");
    
        let totalItems = 0;
        let totalPrice = 0;
        cartBody.innerHTML = '';
    
        cartItems.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
    
            const tr = document.createElement('tr');
    
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <span class="remove-btn" data-id="${item.id}">X</span>
                </td>
            `;
    
            cartBody.appendChild(tr);
        });
    
        totalItemsEl.innerText = totalItems;
        totalPriceEl.innerText = `$${totalPrice.toFixed(2)}`;
    
        attachEventListeners();
    }
    
    // Function to handle quantity change and remove
    function attachEventListeners() {
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);
                const item = cartItems.find(i => i.id === itemId);
                if (item) {
                    item.quantity = newQuantity;
                    renderCart();
                }
            });
        });
    
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                const index = cartItems.findIndex(i => i.id === itemId);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                    renderCart();
                }
            });
        });
    }
    
    // Initialize the cart rendering
    document.addEventListener('DOMContentLoaded', renderCart);