<?php
// db_connect.php - File untuk koneksi database MySQL

// Detail koneksi database Anda.
// Pastikan ini sesuai dengan konfigurasi server MySQL Anda.
$servername = "localhost"; // Alamat server database (umumnya 'localhost' untuk pengembangan lokal)
$username = "root";      // Nama pengguna database Anda (misal: 'root' untuk XAMPP/WAMP default)
$password = "";          // Kata sandi database Anda (misal: kosong untuk XAMPP/WAMP default)
$dbname = "abil_portfolio_db"; // Nama database yang telah Anda buat

// Buat objek koneksi baru menggunakan MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Periksa apakah koneksi berhasil atau ada error
if ($conn->connect_error) {
    // Jika koneksi gagal, hentikan eksekusi skrip dan tampilkan pesan error
    die("Koneksi database gagal: " . $conn->connect_error);
}
// Jika koneksi berhasil, tidak ada output yang dihasilkan dari file ini,
// hanya objek $conn yang tersedia untuk skrip yang menyertakannya.
?>
