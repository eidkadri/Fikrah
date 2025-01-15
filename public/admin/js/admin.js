document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = products.map(product => `
          <tr>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px;"></td>
            <td>${product.name}</td>
            <td>${product.price} $</td>
            <td>
              <button onclick="editProduct(${product.id})">تعديل</button>
              <button onclick="deleteProduct(${product.id})">حذف</button>
            </td>
          </tr>
        `).join('');
      });
  });
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  let editingProductId = null;
  
  // فتح النموذج
  document.getElementById('add-product-btn').addEventListener('click', () => {
    modal.style.display = 'block';
    form.reset();
    editingProductId = null;
  });
  
  // إغلاق النموذج
  document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // حفظ المنتج
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').files[0];
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) formData.append('image', image);
  
    const method = editingProductId ? 'PUT' : 'POST';
    const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
  
    fetch(url, {
      method,
      body: formData
    }).then(() => {
      modal.style.display = 'none';
      location.reload();
    });
  });
  function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(() => {
          alert('تم حذف المنتج!');
          location.reload();
        });
    }
  }
      