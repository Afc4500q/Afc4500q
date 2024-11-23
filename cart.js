function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(cart); // إضافة هذه السطر لرؤية محتوى السلة
    const cartContainer = document.getElementById("cartContainer");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>لا توجد منتجات في السلة.</p>";
        return;
    }

    cartContainer.innerHTML = ""; // مسح السلة
    cart.forEach((product, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        // تحقق من وجود الصور وتعيين أول صورة فقط
        const image = product.images && product.images.length > 0 ? product.images[0] : '';

        // التحقق من وجود الأسعار في الـ API
        const minPrice = product.minprice ? product.minprice : 'غير محدد'; 
        const maxPrice = product.maxprice ? product.maxprice : 'غير محدد';

        // إضافة تفاصيل المنتج مع تعديل عرض الأسعار
        cartItem.innerHTML = `
            <div class="cart-item-images">
                <img src="${image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>السعر الأدنى: ${minPrice} دينار</p>
                <p>السعر الأعلى: ${maxPrice} دينار</p>
                <div class="quantity-container">
                    <label for="quantity-${index}">الكمية:</label>
                    <div class="quantity-box">
                        <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                        <input type="number" id="quantity" value="1" min="1" readonly>
                        <button class="quantity-btn" onclick="increaseQuantity()">+</button>
                        <div class="form-group">
                            <label id="liblprice" for="name">سعر البيع</label>
                            <input id="pricebay" type="text" id="number" name="name" required>
                        </div>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteProduct(${index})">حذف</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });
}
// تعديل دالة الزيادة والتقليص باستخدام الفهرس (index) الخاص بكل منتج
function increaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + 1; // زيادة الكمية
        localStorage.setItem("cart", JSON.stringify(cart)); // تحديث السلة
        displayCart(); // إعادة عرض السلة
    }
}

function decreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity -= 1; // تقليل الكمية
        localStorage.setItem("cart", JSON.stringify(cart)); // تحديث السلة
        displayCart(); // إعادة عرض السلة
    }
}

// وظيفة حذف المنتج
function deleteProduct(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // إزالة المنتج
    localStorage.setItem("cart", JSON.stringify(cart)); // تحديث السلة
    displayCart(); // إعادة عرض السلة
}

// إظهار معلومات الزبون
function promptCustomerInfo() {
    document.getElementById("customerInfo").style.display = "block";
    document.getElementById("formprice").style.display = "none";
}

// استرجاع الـ userId من localStorage
const userId = localStorage.getItem("userId");

// تحديد الزر باستخدام الـ ID
const buttonh = document.getElementById('cli');

// إضافة حدث 'click' إلى الزر
buttonh.addEventListener('click', function() {
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const city = document.getElementById("customerCity").value;
  const district = document.getElementById("customerDistrict").value;
  const region = document.getElementById("customerRegion").value;
  const price = document.getElementById("customerPrice").value;

  // استرجاع الـ userId من localStorage
  const userId = localStorage.getItem("userId");

  // جمع معلومات المنتج من الـ cart
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productName = cart[0] ? cart[0].name : 'غير محدد';  
  const num = document.getElementById("number").value;
  const quantity = document.getElementById("quantity").value;

  const message = `
        تم استلام معلومات الزبون:
        الاسم: ${name}
        الهاتف: ${phone}
        المدينة: ${city}
        المنطقة: ${district}
        المنطقة الفرعية: ${region}
        السعر الإجمالي: ${price}

        معلومات المنتج:
        اسم المنتج: ${productName}
        سعر المنتج: ${productPrice}
        الكمية: ${quantity}
         سعر البيع: ${num}

        ID المستخدم: ${userId}
    `;

  const botToken = "7571233461:AAH8lJsUeuKV_L57A42C6pE5i7FFi1_LIak"; 
  const chatId = "1434047374"; 

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          chat_id: chatId,
          text: message
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
      if (data.ok) {
          alert("تم إرسال المعلومات بنجاح!");
          // دالة لحذف جميع المنتجات من السلة
          function clearCart() {
              // مسح السلة من localStorage
              localStorage.removeItem("cart");

              document.getElementById("customerInfo").style.display = "none";
              document.getElementById("formprice").style.display = "block";
          }
          displayCart(); // إعادة عرض السلة بعد مسحها
          alert("تم مسح جميع المنتجات من السلة.");
      } else {
          alert("حدث خطأ أثناء إرسال البيانات.");
      }
  })
  .catch(error => {
      alert("حدث خطأ أثناء الاتصال بتيليجرام.");
      console.error("Error:", error);
  });
}

// عرض السلة عند تحميل الصفحة
displayCart();
