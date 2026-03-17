let products = [];
let nextId = 1;
let editingProductId = null;

const form = document.getElementById('productForm');
const inputName = document.getElementById('productName');
const inputCategory = document.getElementById('productCategory');
const inputPrice = document.getElementById('productPrice');
const inputQuantity = document.getElementById('productQuantity');
const inputDescription = document.getElementById('productDescription');

const tableBody = document.getElementById('productTableBody');
const emptyState = document.getElementById('emptyState');
const totalProducts = document.getElementById('totalProducts');
const totalValue = document.getElementById('totalValue');
const totalQuantity = document.getElementById('totalQuantity');

const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

const STORAGE_KEY_PRODUCTS = 'myProductList';
const STORAGE_KEY_NEXT_ID = 'myProductNextId';

function saveData() {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    localStorage.setItem(STORAGE_KEY_NEXT_ID, String(nextId));
}

function loadData() {
    try {
        const productJson = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        const nextIdInStorage = localStorage.getItem(STORAGE_KEY_NEXT_ID);

        if (productJson) {
            const parsed = JSON.parse(productJson);
            if (Array.isArray(parsed)) {
                products = parsed;
            }
        }

        if (nextIdInStorage && Number(nextIdInStorage) > 0) {
            nextId = Number(nextIdInStorage);
        } else {
            nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
        }
    } catch (error) {
        console.error('Lỗi khi đọc localStorage:', error);
        products = [];
        nextId = 1;
        localStorage.removeItem(STORAGE_KEY_PRODUCTS);
        localStorage.removeItem(STORAGE_KEY_NEXT_ID);
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);
}

function truncateText(text, maxLength = 40) {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

function getVisibleProducts() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedCategory = filterCategory.value;

    return products.filter((p) => {
        const matchesSearch =
            keyword.length === 0 ||
            p.name.toLowerCase().includes(keyword) ||
            (p.description || '').toLowerCase().includes(keyword);
        const matchesCategory =
            selectedCategory.length === 0 || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
}

function renderProduct() {
    const visible = getVisibleProducts();

    if (visible.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
        let html = '';
        visible.forEach((p) => {
            html += `
                <tr>
                    <td>${p.id}</td>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.category}</td>
                    <td class="price">${formatCurrency(p.price)}</td>
                    <td class="quantity ${p.quantity < 10 ? 'low-stock' : ''}">${p.quantity}</td>
                    <td class="description">${truncateText(p.description || '-', 45)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" data-id="${p.id}">✏️ Sửa</button>
                            <button class="btn-delete" data-id="${p.id}">🗑️ Xóa</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }

    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const qty = products.reduce((sum, p) => sum + p.quantity, 0);
    totalProducts.textContent = products.length;
    totalValue.textContent = formatCurrency(total);
    totalQuantity.textContent = qty;

    document.querySelectorAll('.btn-delete').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            handleDelete(id);
        });
    });

    document.querySelectorAll('.btn-edit').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            handleEdit(id);
        });
    });
}

function resetForm() {
    form.reset();
    editingProductId = null;
    formTitle.textContent = 'Thêm Sản Phẩm Mới';
    submitBtn.textContent = '➕ Thêm Sản Phẩm';
    cancelBtn.style.display = 'none';
}

function validateForm(name, category, price, quantity) {
    if (!name) {
        return 'Tên sản phẩm không được để trống.';
    }
    if (!category) {
        return 'Danh mục sản phẩm bắt buộc chọn.';
    }
    if (Number.isNaN(price) || price < 0) {
        return 'Giá phải là số và lớn hơn hoặc bằng 0.';
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
        return 'Số lượng phải là số nguyên >= 0.';
    }
    return '';
}

function handleDelete(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const confirmed = confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`);
    if (!confirmed) return;

    products = products.filter((p) => p.id !== id);
    if (editingProductId === id) {
        resetForm();
    }
    saveData();
    renderProduct();
}

function handleEdit(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    editingProductId = id;
    inputName.value = product.name;
    inputCategory.value = product.category;
    inputPrice.value = product.price;
    inputQuantity.value = product.quantity;
    inputDescription.value = product.description;

    formTitle.textContent = 'Chỉnh Sửa Sản Phẩm';
    submitBtn.textContent = '📝 Cập Nhật';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleClearAll() {
    const confirmed = confirm('⚠️ Xóa tất cả sản phẩm? Hành động này không thể hoàn tác.');
    if (!confirmed) return;

    products = [];
    nextId = 1;
    resetForm();
    saveData();
    renderProduct();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = inputName.value.trim();
    const category = inputCategory.value.trim();
    const price = Number(inputPrice.value);
    const quantity = Number(inputQuantity.value);
    const description = inputDescription.value.trim();

    const errorMessage = validateForm(name, category, price, quantity);
    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    if (editingProductId !== null) {
        const index = products.findIndex((p) => p.id === editingProductId);
        if (index >= 0) {
            products[index] = {
                ...products[index],
                name,
                category,
                price,
                quantity,
                description,
            };
            saveData();
            resetForm();
            renderProduct();
            return;
        }
    }

    const newProduct = {
        id: nextId,
        name,
        category,
        price,
        quantity,
        description,
    };
    products.push(newProduct);
    nextId += 1;
    saveData();
    resetForm();
    renderProduct();
});

cancelBtn.addEventListener('click', () => {
    resetForm();
});

clearAllBtn.addEventListener('click', handleClearAll);
searchInput.addEventListener('input', renderProduct);
filterCategory.addEventListener('change', renderProduct);

loadData();
renderProduct(); 
