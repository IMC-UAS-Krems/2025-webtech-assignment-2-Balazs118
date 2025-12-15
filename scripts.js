// products
const products = [
    { id: 1, name: "Adjustable Dumbbells", price: 100, img: "./gymimages/adjustabledumbbells.jpg" },
    { id: 2, name: "Barbell", price: 50, img: "./gymimages/barbell.jpg" },
    { id: 3, name: "Jump Rope", price: 10, img: "./gymimages/jumprope.jpg" },
    { id: 4, name: "Kettlebells", price: 40, img: "./gymimages/kettlebells.jpg" },
    { id: 5, name: "Olympic Barbell", price: 80, img: "./gymimages/olympicbarbell.jpg" },
    { id: 6, name: "Legpress Machine", price: 1500, img: "./gymimages/legpressmachine.jpg" },
    { id: 7, name: "Power Rack", price: 700, img: "./gymimages/powerrack.jpg" },
    { id: 8, name: "Treadmill", price: 600, img: "./gymimages/treadmill.jpg" },
    { id: 9, name: "Weight Bench", price: 110, img: "./gymimages/weightbench.jpg" },
    { id: 10, name: "Weightplates", price: 50, img: "./gymimages/weightplates.jpg" },];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const listOfProducts = document.getElementById('product-list');

 // Generate Product Cards
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="card h-100 product-card">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-success fw-bold">EUR${product.price}.00</p>
                    <button class="btn btn-outline-primary mt-auto rounded-pill" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        listOfProducts.appendChild(col);
    });
});
// cart
function addToCart(cartItem) {
    const item = products.find(p => p.id === cartItem);
    cart.push(item);
    updateCartUI();
}
function removeFromCart(numOfItem) {
    cart.splice(numOfItem, 1);
    updateCartUI();
}
function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('btn-to-checkout');

    cartCount.innerText = cart.length;
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    
    const subtotalEl = document.getElementById('cart-subtotal');
    subtotalEl.innerText = `EUR${subtotal.toFixed(2)}`;

    if (cart.length > 0) {
        checkoutBtn.classList.remove('disabled');
        cartList.innerHTML = cart.map((item, numOfItem) => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <div class="fw-bold">${item.name}</div>
                    <small class="text-muted">EUR${item.price}.00</small>
                </div>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="removeFromCart(${numOfItem})">&times;</button>
            </li>
        `).join('');
    } else {
        checkoutBtn.classList.add('disabled');
        cartList.innerHTML = '<li class="list-group-item text-muted text-center mt-5">Your cart is empty.</li>';
    }
}
// nav and switchview
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('d-none'));
    const target = document.getElementById(viewId);
    target.classList.remove('d-none');
    target.classList.add('fade-in'); 
}
function proceedToCheckout() {
    const cartOffcanvas = document.getElementById('cartOffcanvas');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(cartOffcanvas); 
    if(bsOffcanvas) 

        bsOffcanvas.hide();

    switchView('view-checkout');
}
function showGallery() {
    switchView('view-gallery');
}
// checkout and processing
function processOrder() {
    const phoneInput = document.getElementById('phone');
    const zipInput = document.getElementById('zip');
    const form = document.getElementById('checkout-form');
    
    let isValid = true;

    phoneInput.classList.remove('is-invalid');
    zipInput.classList.remove('is-invalid');
    const phoneRegex = /[0-9]$/;
    if (!phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.add('is-invalid');
        isValid = false;
    }
    if (zipInput.value.length > 4 || zipInput.value.length === 0) {
        zipInput.classList.add('is-invalid');
        isValid = false;
    }
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        isValid = false;
    }
    if (isValid) {
        allConfirmation();
        switchView('view-confirmation');
    }
}
// confirmation and calculation
function allConfirmation() {
    const gymItemsDiscount = document.getElementById('gymitems-discount');
    const discountRow = document.getElementById('gymitems-discount-row');

    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    
    let discount = 0;
    if (cart.length >= 3) {
        discount = subtotal * 0.10; 
        discountRow.classList.remove('d-none');
        gymItemsDiscount.innerText = `-EUR${discount.toFixed(2)}`;
    } else {
        discountRow.classList.add('d-none');
    }
    let tax = (subtotal - discount) * 0.05; 
    let total = subtotal - discount + tax;

    const summaryList = document.getElementById('summary-list');
    summaryList.innerHTML = cart.map(item => `
        <li class="list-group-item d-flex justify-content-between">
            <span>${item.name}</span>
            <span>EUR${item.price}</span>
        </li>
    `).join('');

    const gymItemsSubtotal = document.getElementById('gymitems-subtotal');
    gymItemsSubtotal.innerText = `EUR${subtotal.toFixed(2)}`;
    const gymItemsTax = document.getElementById('gymitems-tax');
    gymItemsTax.innerText = `EUR${tax.toFixed(2)}`;
    const gymItemsTotal = document.getElementById('gymitems-total');
    gymItemsTotal.innerText = `EUR${total.toFixed(2)}`;
}