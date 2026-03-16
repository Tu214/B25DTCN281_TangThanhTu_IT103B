// Employee management system
let employees = [];
let nextId = 1;
let editingId = null;

// DOM elements
const form = document.getElementById('employeeForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const tableBody = document.getElementById('employeeTableBody');
const employeeCountBadge = document.getElementById('employeeCountBadge');
const employeeCountFooter = document.getElementById('employeeCountFooter');

// Form fields
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const dateOfBirthInput = document.getElementById('dateOfBirth');
const positionInput = document.getElementById('position');

// Error elements
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const dateOfBirthError = document.getElementById('dateOfBirthError');
const positionError = document.getElementById('positionError');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    updateCounts();
});

// Form submit handler
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateForm()) {
        if (editingId) {
            updateEmployee();
        } else {
            addEmployee();
        }
    }
});

// Cancel edit handler
cancelBtn.addEventListener('click', cancelEdit);

// Validation functions
function validateForm() {
    let isValid = true;

    // Clear previous errors
    clearErrors();

    // Full name validation
    if (!fullNameInput.value.trim()) {
        fullNameError.textContent = 'Họ và tên không được để trống';
        isValid = false;
    }

    // Email validation
    if (!emailInput.value.trim()) {
        emailError.textContent = 'Email không được để trống';
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        emailError.textContent = 'Email không đúng định dạng';
        isValid = false;
    }

    // Date of birth validation
    if (!dateOfBirthInput.value) {
        dateOfBirthError.textContent = 'Ngày sinh không được để trống';
        isValid = false;
    }

    // Position validation
    if (!positionInput.value) {
        positionError.textContent = 'Chức vụ không được để trống';
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearErrors() {
    fullNameError.textContent = '';
    emailError.textContent = '';
    dateOfBirthError.textContent = '';
    positionError.textContent = '';
}

// Employee operations
function addEmployee() {
    const employee = {
        id: nextId++,
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        dateOfBirth: dateOfBirthInput.value,
        position: positionInput.value
    };

    employees.push(employee);
    renderTable();
    updateCounts();
    clearForm();
}

function updateEmployee() {
    const employee = employees.find(emp => emp.id === editingId);
    if (employee) {
        employee.fullName = fullNameInput.value.trim();
        employee.email = emailInput.value.trim();
        employee.dateOfBirth = dateOfBirthInput.value;
        employee.position = positionInput.value;
    }

    renderTable();
    updateCounts();
    cancelEdit();
}

function deleteEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee && confirm(`Bạn có chắc muốn xóa nhân viên "${employee.fullName}"?`)) {
        employees = employees.filter(emp => emp.id !== id);
        renderTable();
        updateCounts();

        // If deleting the employee being edited, reset form
        if (editingId === id) {
            cancelEdit();
        }
    }
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        editingId = id;
        fullNameInput.value = employee.fullName;
        emailInput.value = employee.email;
        dateOfBirthInput.value = employee.dateOfBirth;
        positionInput.value = employee.position;

        formTitle.textContent = 'Chỉnh Sửa Nhân Viên';
        submitBtn.textContent = 'Cập Nhật';
        cancelBtn.style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
}

function cancelEdit() {
    editingId = null;
    clearForm();
    formTitle.textContent = 'Thêm Nhân Viên Mới';
    submitBtn.textContent = 'Thêm Nhân Viên';
    cancelBtn.style.display = 'none';
}

function clearForm() {
    form.reset();
    clearErrors();
}

// Rendering functions
function renderTable() {
    tableBody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.fullName}</td>
            <td>${employee.email}</td>
            <td>${formatDate(employee.dateOfBirth)}</td>
            <td>${employee.position}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editEmployee(${employee.id})">Sửa</button>
                <button class="btn btn-sm btn-delete" onclick="deleteEmployee(${employee.id})">Xóa</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function updateCounts() {
    const count = employees.length;
    employeeCountBadge.textContent = `${count} nhân viên`;
    employeeCountFooter.textContent = `Tổng số nhân viên: ${count}`;
}
