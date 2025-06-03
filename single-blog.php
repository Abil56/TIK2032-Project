<?php
// Sertakan file koneksi database.
include 'db_connect.php';

// Ambil ID postingan dari parameter URL (misal: single-blog.php?id=1).
// Gunakan intval() untuk memastikan nilai ID adalah integer dan aman.
$post_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$post = null; // Inisialisasi variabel $post sebagai null

// Pastikan ID postingan valid (lebih dari 0)
if ($post_id > 0) {
    // Siapkan query SQL menggunakan prepared statement untuk mencegah SQL injection.
    // Ini adalah praktik terbaik untuk keamanan database.
    $stmt = $conn->prepare("SELECT title, image_src, alt_text, full_content FROM posts WHERE id = ?");
    // 'bind_param' mengikat nilai $post_id ke placeholder '?' dalam query.
    // "i" menunjukkan bahwa $post_id adalah integer.
    $stmt->bind_param("i", $post_id);
    $stmt->execute(); // Jalankan prepared statement
    $result = $stmt->get_result(); // Dapatkan hasil dari query
    $post = $result->fetch_assoc(); // Ambil satu baris hasil sebagai array asosiatif
    $stmt->close(); // Tutup statement
}

// Tutup koneksi database setelah selesai menggunakan
$conn->close();
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/BlogPosting">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="<?php echo htmlspecialchars($post['title'] ?? 'Postingan Blog'); ?> oleh Abil" />
    <title><?php echo htmlspecialchars($post['title'] ?? 'Postingan Blog'); ?> - Blog Abil</title>
    <link rel="stylesheet" href="styles.css" />
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
  </head>
  <body>
    <div class="loader">
      <div class="cyber-grid"></div>
      <span class="load-percent">0%</span>
    </div>
    <div class="scroll-progress" aria-hidden="true"></div>
    <canvas id="particle-canvas" aria-hidden="true"></canvas>
    <header
      class="site-header"
      itemscope
      itemtype="https://schema.org/WPHeader"
    >
      <nav class="main-nav" aria-label="Navigasi utama" role="navigation">
        <input
          type="checkbox"
          id="nav-toggle"
          class="nav-toggle"
          aria-hidden="true"
        />
        <label for="nav-toggle" class="nav-toggle-label">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <ul class="nav-links">
          <li><a href="index.html">Beranda</a></li>
          <li><a href="gallery.html">Galeri</a></li>
          <li>
            <a href="blog.php" class="active" aria-current="page"
              ><b>Blog</b></a
            >
          </li>
          <li><a href="contact.html">Kontak</a></li>
          <li>
            <button class="theme-toggle" aria-label="Ganti tema">
              <span class="theme-icon">🌙</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
    <main role="main">
      <section class="hero" aria-labelledby="blog-title">
        <h1 id="blog-title" class="scroll-reveal">=== Blog Abil ===</h1>
        <p class="scroll-reveal"><i>Pembaruan dari Perjalanan Saya</i></p>
      </section>
      <hr />
      <article class="blog-post" aria-labelledby="post-title">
        <?php if ($post): // Periksa apakah data postingan ditemukan ?>
          <h2 id="post-title" class="scroll-reveal" itemprop="headline">
            <?php echo htmlspecialchars($post['title']); // Tampilkan judul postingan ?>
          </h2>
          <img
            src="<?php echo htmlspecialchars($post['image_src']); ?>-low.jpg"
            data-src="<?php echo htmlspecialchars($post['image_src']); ?>.jpg"
            alt="<?php echo htmlspecialchars($post['alt_text']); ?>"
            class="lazy scroll-reveal"
            loading="lazy"
            itemprop="image"
          />
          <div class="post-content" itemprop="articleBody">
            <?php
            // Tampilkan konten lengkap postingan.
            // Penting: Jika 'full_content' berisi HTML yang dimasukkan oleh pengguna,
            // pastikan untuk membersihkannya (sanitasi) sebelum disimpan ke database
            // untuk mencegah serangan XSS. Karena data ini dimasukkan secara manual,
            // diasumsikan sudah aman.
            echo $post['full_content'];
            ?>
          </div>
        <?php else: // Jika postingan tidak ditemukan ?>
          <p>Postingan blog tidak ditemukan.</p>
        <?php endif; ?>
      </article>
      <hr />
    </main>
    <footer
      class="site-footer"
      itemscope
      itemtype="https://schema.org/WPFooter"
    >
      <p class="scroll-reveal">
        <small>&copy; 2025 Abil - Universitas Sam Ratulangi</small>
      </p>
    </footer>
    <button class="scroll-top" aria-label="Gulir ke atas">↑</button>
    <button class="perf-toggle" aria-label="Tampilkan/Sembunyikan dashboard kinerja">
      📊
    </button>
    <div class="perf-dashboard" aria-live="polite" style="display: none"></div>
    <script src="script.js"></script>
  </body>
</html>
