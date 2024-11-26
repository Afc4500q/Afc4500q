
document.getElementById("formprice").addEventListener("click", oop);
// دالة لإظهار فورم معلومات الزبون وإخفاء السعر
function oop() {
    document.querySelector("#customerInfo").style.display = "block";
    
}

// دالة لإضافة منتج إلى السلة
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// دالة لعرض المنتجات في السلة
function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cartContainer");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>لا توجد منتجات في السلة.</p>";
        return;
    }

    cartContainer.innerHTML = "";

    cart.forEach((product, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const image = product.images && product.images.length > 0 ? product.images[0] : '';
        const pricebay = product.pricebsy || 'غير محدد';
        

        cartItem.innerHTML = `

            <div class="cart-item-images">
                <img src="${image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>سعر البيع: ${pricebay}</p>
                 <p>ربحك: ${pricebay/100 * 13}</p>
            
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
        cartContainer.appendChild(cartItem);
    });
}

// دالة لحذف منتج من السلة
function deleteProduct(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// دالة لتقليص الكمية
function decreaseQuantity(index) {
    const quantityInput = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantityInput.value);

    if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
    }
}

// دالة لزيادة الكمية
function increaseQuantity(index) {
    const quantityInput = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantityInput.value);
    quantity++;
    quantityInput.value = quantity;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("cli").addEventListener("click", sendDataToTelegram);
});

// دالة لإرسال البيانات إلى البوت عبر Telegram
function sendDataToTelegram() {

    let userId = localStorage.getItem('userId');

    if (userId) {
        console.log('User ID:', userId); // عرض id في وحدة التحكم
    } else {
        console.log('No User ID found in localStorage.');
        // تعيين معرف المستخدم إذا لم يكن موجودًا
        localStorage.setItem('userId', 'yourUserId');
        userId = 'yourUserId'; // تعيين قيمة مؤقتة
    }

    console.log("UserId: ", userId); // التحقق من userId

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert('السلة فارغة! لا توجد بيانات لإرسالها.');
        return;
    }

    const customerInfo = {
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        city: document.getElementById('customerCity').value.trim(),
        district: document.getElementById('customerDistrict').value.trim(),
        region: document.getElementById('customerRegion').value.trim()
    };

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.city || !customerInfo.district || !customerInfo.region) {
        alert("يرجى تعبئة جميع الحقول!");
        return;
    }

    console.log("Customer Info: ", customerInfo); // التحقق من customerInfo

    let message = `🛒 *تفاصيل الطلب الجديد:*\n\n`;
    message += `👤 *معرف المستخدم:* ${userId}\n`;
    message += `📞 *اسم العميل:* ${customerInfo.name}\n`;
    message += `📱 *رقم الهاتف:* ${customerInfo.phone}\n`;
    message += `🏙️ *المحافظة:* ${customerInfo.city}\n`;
    message += `🌍 *المدينة:* ${customerInfo.district}\n`;
    message += `🏢 *الحي:* ${customerInfo.region}\n`;

    cart.forEach((product, index) => {
        const quantityInput = document.getElementById(`quantity-${index}`);
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        message += `🔹 *المنتج ${index + 1}:*\n`;
        message += `  🏷️ *الاسم:* ${product.name}\n`;
        message += `  🛒 *الكمية:* ${quantity}\n\n`;
    });

    console.log("Message: ", message); // التحقق من message

    const botToken = "7571233461:AAH8lJsUeuKV_L57A42C6pE5i7FFi1_LIak"; 
    const chatId = "1434047374";
    const telegramAPI = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(telegramAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("تم إرسال البيانات بنجاح.");
                clearCart();
            } else {
                console.error("Telegram API Error:", data);
                alert("فشل في إرسال البيانات إلى البوت.");
            }
        })
        .catch(error => {
            console.error("Error sending data to Telegram:", error);
            alert("حدث خطأ أثناء إرسال البيانات.");
        });
}

// استدعاء دالة لعرض السلة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
});

// دالة لحذف جميع المنتجات من السلة
function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
    document.querySelector("#fromprice").style.display = "block";
}
