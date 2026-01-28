
let bookName = prompt("Tên sách").trim().toUpperCase().trim();

let authorName = prompt("Tên tác giả").toUpperCase();

let yearOfManufacture = +prompt("Năm xuất bản");

let price = +prompt("Giá tiền");

let quantity = +prompt("Số lượng nhập kho");    

let authorId = authorName.substring(0,3);
let randomNumber = Math.floor(Math.random() * 1000) + 1;
let bookId = `${authorId}${yearOfManufacture}-${randomNumber}`

let ageBook = 2026-yearOfManufacture

let totalValue = price*quantity

let suggest =`kệ số ${Math.floor(Math.random() * 10)}`;

console.log(
    `
    -- PHIẾU NHẬP KHO --
    Mã sách: ${bookId}
    Tên sách: ${bookName}
    Tác giả: ${authorName}
    Năm sản xuất: ${yearOfManufacture}
    Tuổi sách: ${ageBook}
    Tổng giá trị: ${totalValue}
    Nhăn kệ gợi ý: ${suggest}
    `
);
