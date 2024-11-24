// قتح فورم معلومات الزبون
//const bh = document.querySelector(".customerInfo");
//const gg = document.querySelector("#fromprice");
//function openl{
//bh.style.display = "block";
//gg.style.display = "none";

//}

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
        const pricebay = product.pricebsy || 'غير محدد';
        const sss = pricebay/100 * 13;

        cartItem.innerHTML = `
            <div class="cart-item-images">
                <img src="${image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p> سعر البيع: ${pricebay}</p>
                <p>ربحك:${sss}</p>
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

// استرجاع id المستخدم من localStorage وحفظه في متغير
let userId = localStorage.getItem('userId');

if (userId) {
    console.log('User ID:', userId); // عرض id في وحدة التحكم
    // يمكنك الآن استخدام المتغير userId في باقي الكود
} else {
    console.log('No User ID found in localStorage.');
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




// دالة لإرسال البيانات إلى البوت عبر Telegram
function sendDataToTelegram() {
    // استرجاع id المستخدم
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('لا يمكن العثور على ID المستخدم!');
        return;
    }

    // استرجاع بيانات السلة
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('السلة فارغة! لا توجد بيانات لإرسالها.');
        return;
    }

    // جمع معلومات الزبون من الفورم
    const customerInfo = {
        name: document.getElementById('customerName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        city: document.getElementById('customerCity').value.trim(),
        district: document.getElementById('customerDistrict').value.trim(),
        region: document.getElementById('customerRegion').value.trim(),
        

    // التحقق من تعبئة كافة الحقول
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.city || !customerInfo.district || !customerInfo.region || !customerInfo.price) {
        alert("يرجى تعبئة جميع الحقول!");
        return;
    }

    // إنشاء نص الرسالة
    let message = `🛒 *تفاصيل الطلب الجديد:*\n\n`;
    message += `👤 *معرف المستخدم:* ${userId}\n`;
    message += `📞 *اسم العميل:* ${customerInfo.name}\n`;
    message += `📱 *رقم الهاتف:* ${customerInfo.phone}\n`;
    message += `🏙️ *المدينة:* ${customerInfo.city}\n`;
    message += `🌍 *المنطقة:* ${customerInfo.district}\n`;
    message += `🏢 *المحافظة:* ${customerInfo.region}\n`;
    

    // إضافة المنتجات في السلة إلى الرسالة
    cart.forEach((product, index) => {
        const quantityInput = document.getElementById(`quantity-${index}`);
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        message += `🔹 *المنتج ${index + 1}:*\n`;
        message += `  🏷️ *الاسم:* ${product.name}\n`;
        message += `  💰 * ارباح العميل:* ${sss || 'غير محدد'}\n`;
        message += `  💵 *سعر البيع:* ${product.pricebsy || 'غير محدد'}\n`;  // إضافة سعر البيع
        message += `  🛒 *الكمية:* ${quantity}\n\n`;
    });

    // إعداد طلب الإرسال عبر Telegram API
    const botToken = "7571233461:AAH8lJsUeuKV_L57A42C6pE5i7FFi1_LIak"; // التوكن الخاص بك
    const chatId = "1434047374"; // الـ chat_id الخاص بك
    const telegramAPI = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(telegramAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown" // لدعم التنسيق
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // دالة لحذف جميع المنتجات من السلة
function clearCart() {
    // إزالة السلة بالكامل من localStorage
    localStorage.removeItem("cart");

    // تحديث العرض بعد الحذف
    displayCart();
gg.style.display = "block";
}
                
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


// ربط الزر بدالة الإرسال
//document.getElementById("cli").addEventListener("click", sendDataToTelegram);

// استدعاء دالة لعرض السلة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
});
