// Dữ liệu ban đầu
const products = [
    { id: 1, name: "Bánh Chưng", price: 150000 },
    { id: 2, name: "Giò Lua", price: 180000 },
    { id: 3, name: "Canh Dào", price: 500000 },
    { id: 4, name: "Mứt Tết", price: 120000 },
    { id: 5, name: "Bao Lì Xì", price: 25000 },
    { id: 6, name: "Dưa Hấu Tết", price: 80000 },
]

const productList = document.getElementById("product-list");
const productForm = document.getElementById("product-form");

// --- CHỨC NĂNG 1: HIỂN THỊ (READ) ---
const renderProducts = () => {
    productList.innerHTML = ""; // Dọn dẹp danh sách cũ
    products.forEach((p) => {
        const li = document.createElement("li");
        li.className = "product-item";

        li.innerHTML = `
            <div class="info">
                <strong>${p.name}</strong>
                <span class="price">${p.price.toLocaleString()} VNĐ</span>
            </div>
            <div class="actions">
                <button class="edit-btn">Sửa giá</button>
                <button class="delete-btn">Xóa</button>
            </div>
        `;

        // --- CHỨC NĂNG 2: XÓA (DELETE) ---
        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.onclick = () => {
            if (confirm(`Bạn có chắc muốn xóa "${p.name}"?`)) {
                // Lọc bỏ sản phẩm khỏi mảng
                products = products.filter(item => item.id !== p.id);
                renderProducts(); // Vẽ lại giao diện
            }
        };

        // --- CHỨC NĂNG 3: SỬA GIÁ (UPDATE) ---
        const editBtn = li.querySelector(".edit-btn");
        editBtn.onclick = () => {
            const newPrice = prompt(`Nhập giá mới cho ${p.name}:`, p.price);
            if (newPrice !== null) {
                const priceNum = parseInt(newPrice);
                if (!isNaN(priceNum) && priceNum >= 0) {
                    p.price = priceNum; // Cập nhật trong mảng
                    renderProducts();   // Vẽ lại giao diện
                } else {
                    alert("Giá không hợp lệ!");
                }
            }
        };

        productList.appendChild(li);
    });
};

// --- CHỨC NĂNG 4: THÊM MỚI (CREATE) ---
productForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Chặn load lại trang

    const nameInput = document.getElementById("product-name");
    const priceInput = document.getElementById("product-price");

    const newProduct = {
        id: Date.now(), // Tạo ID duy nhất bằng thời gian
        name: nameInput.value,
        price: parseInt(priceInput.value)
    };

    products.push(newProduct); // Thêm vào mảng
    renderProducts();          // Cập nhật giao diện

    productForm.reset();       // Xóa trắng form
});

renderProducts();