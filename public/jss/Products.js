// تحميل المنتجات عند تحميل الصفحة
// تحميل المنتجات عند تحميل الصفحة
const loadProducts = () => {
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('products-container');
            container.innerHTML = ''; // تفريغ المنتجات
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price} ريال عماني</p>
                    
                    <div class="details">
                        <button onclick="addToCart('${product._id}')">إضافة إلى السلة</button>
                    </div>
                `;
                container.appendChild(productDiv);
            });
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
