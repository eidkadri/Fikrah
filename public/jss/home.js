// تحميل المنتجات عند تحميل الصفحة
const loadProducts = () => {
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('products-container');
            container.innerHTML = ''; // تفريغ المنتجات
            const maxProducts = 6; // تحديد الحد الأقصى للمنتجات المعروضة
            const limitedProducts = products.slice(0, maxProducts); // أخذ أول 6 منتجات فقط

            limitedProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>السعر: ${product.price} ر.ع</p>
                    <div class="details">
                        <button onclick="addToCart('${product.id}')">إضافة إلى السلة</button>
                    </div>
                `;
                container.appendChild(productDiv);
            });

            // إذا كان هناك أكثر من 6 منتجات، أضف زر "المزيد من المنتجات"
            if (products.length > maxProducts) {
                const moreButtonDiv = document.createElement('div');
                moreButtonDiv.className = 'more-products';
                moreButtonDiv.innerHTML = `
                    <a href="../Products/products.html" class="more-button">المزيد من المنتجات</a>
                `;
            
                // أضف الزر بعد الحاوية الرئيسية للمنتجات
                const parentContainer = document.getElementById('main-container'); // تأكد من وجود عنصر رئيسي يشمل كل شيء
                parentContainer.appendChild(moreButtonDiv);
            }
            
            
        })
        .catch(err => console.error('Error loading products:', err));
};

// تحميل المنتجات عند بداية التشغيل
loadProducts();

// دالة لإضافة المنتج إلى السلة
const addToCart = (productId) => {
    console.log(`تمت إضافة المنتج ${productId} إلى السلة`);
    // يمكن تعديل هذه الدالة لإضافة المنتج فعليًا إلى السلة (حسب متطلبات المشروع)
};
