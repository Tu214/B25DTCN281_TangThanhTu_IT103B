let bookName = prompt("Tên sách").trim().toUpperCase();
let oder = +prompt("Số thứ tự của sách trong thư viện");
let bookId = `LIB-${bookName}-${oder}`

console.log(
    `
    Tên sách gốc: ${bookName}
    Mã sách sau chuẩn hóa: ${bookId}
    `
);
