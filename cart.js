// دالة لإضافة منتج إلى السلة
function addToCart(product) {
    // استرجاع السلة من localStorage، إذا لم توجد أنشأنا سلة فارغة
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // إضافة المنتج إلى السلة
    cart.push(product);

    // حفظ السلة المحدثة في localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // تحديث العرض
    displayCart();
}

// دالة لعرض المنتجات في السلة
function displayCart() {
    // استرجاع السلة من localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // الحصول على العنصر الذي سيعرض السلة
    const cartContainer = document.getElementById("cartContainer");

    // إذا كانت السلة فارغة، عرض رسالة بذلك
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>لا توجد منتجات في السلة.</p>";
        return;
    }

    // إفراغ المحتوى السابق لعرض السلة
    cartContainer.innerHTML = "";

    // عرض كل منتج في السلة
    cart.forEach((product, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        // استخدام الصور والأسعار التي تم تخزينها
        const image = product.images && product.images.length > 0 ? product.images[0] : '';
        const minPrice = product.minprice || 'غير محدد';
        const maxPrice = product.maxprice || 'غير محدد';
        const pricebay = bb || 'غير محدد';

        cartItem.innerHTML = `
            <div class="cart-item-images">
                <img src="${image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>السعر الأدنى: ${minPrice}</p>
                <p>السعر الأعلى: ${maxPrice}</p>
                <p> سعر البيع: ${pricebay}</p>
                <div class="quantity-container">
                    <label for="quantity-${index}">الكمية:</label>
                    <div class="quantity-box">
                        <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" class="kg" id="quantity-${index}" value="1" min="1" readonly>
                        <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteProduct(${index})">حذف</button>
            </div>
        `;
        
        // إضافة المنتج إلى السلة
        cartContainer.appendChild(cartItem);
    });
}

// دالة لحذف منتج من السلة
function deleteProduct(index) {
    // استرجاع السلة من localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // إزالة المنتج من السلة بناءً على الفهرس
    cart.splice(index, 1);

    // حفظ السلة المحدثة في localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // تحديث عرض السلة بعد الحذف
    displayCart();
}

// دالة لتقليص الكمية
function decreaseQuantity(index) {
    const quantityInput = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantityInput.value);

    if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;

        // يمكن تحديث الكمية في localStorage هنا إذا لزم الأمر
    }
}

// دالة لزيادة الكمية
function increaseQuantity(index) {
    const quantityInput = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantityInput.value);

    quantity++;
    quantityInput.value = quantity;

    // يمكن تحديث الكمية في localStorage هنا إذا لزم الأمر
}

// استدعاء دالة لعرض السلة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
});
