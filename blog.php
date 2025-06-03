<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/WebPage">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Abil's Blog - Updates and Stories" />
    <title>Blog - Abil's Portfolio</title>
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
      <nav class="main-nav" aria-label="Main navigation" role="navigation">
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
          <li><a href="index.html">Home</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li>
            <a href="blog.php" class="active" aria-current="page"
              ><b>Blog</b></a
            >
          </li>
          <li><a href="contact.html">Contact</a></li>
          <li>
            <button class="theme-toggle" aria-label="Cycle through themes">
              <span class="theme-icon">🌙</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
    <main role="main">
      <section class="hero" aria-labelledby="blog-title">
        <h1 id="blog-title" class="scroll-reveal">=== Abil's Blog ===</h1>
        <p class="scroll-reveal"><i>Updates from My Journey</i></p>
      </section>
      <hr />
      <section class="blog-search" aria-label="Search blog posts">
        <input
          type="text"
          id="blog-search"
          placeholder="Search posts..."
          aria-label="Search blog posts"
        />
      </section>
      <section class="blog-posts" aria-label="Blog posts">
        <?php
        // Sertakan file koneksi database
        include 'db_connect.php';

        // Ambil data postingan blog dari database
        $sql = "SELECT id, title, image_src, alt_text, preview_text, word_count, read_time FROM posts ORDER BY created_at DESC";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Loop melalui setiap baris data dan tampilkan sebagai artikel blog
            while($row = $result->fetch_assoc()) {
                echo '<article class="blog-preview scroll-reveal" itemscope itemtype="https://schema.org/BlogPosting">';
                echo '  <img src="' . htmlspecialchars($row["image_src"]) . '-low.jpg" data-src="' . htmlspecialchars($row["image_src"]) . '.jpg" alt="' . htmlspecialchars($row["alt_text"]) . '" class="lazy" loading="lazy" />';
                echo '  <h3>';
                // Link ke halaman detail blog dengan ID postingan
                echo '    <a href="single-blog.php?id=' . htmlspecialchars($row["id"]) . '" itemprop="headline">' . htmlspecialchars($row["title"]) . '</a>';
                echo '  </h3>';
                echo '  <p class="preview-text" itemprop="description">';
                echo '    ' . htmlspecialchars($row["preview_text"]);
                echo '    <span class="read-more">Baca Selengkapnya</span>'; // Teks "Read More"
                echo '  </p>';
                echo '  <div class="post-meta">';
                echo '    <span class="word-count" aria-label="Jumlah kata">' . htmlspecialchars($row["word_count"]) . ' kata</span>';
                echo '    <span class="read-time" aria-label="Perkiraan waktu baca">' . htmlspecialchars($row["read_time"]) . ' menit baca</span>';
                echo '  </div>';
                echo '  <div class="comment-section">';
                echo '    <button class="comment-toggle" aria-label="Tampilkan/Sembunyikan komentar">';
                echo '      Komentar (0)'; // Komentar akan ditangani oleh JavaScript, atau bisa juga dihitung dari DB jika ada tabel komentar
                echo '    </button>';
                echo '    <div class="comments" style="display: none" role="region" aria-label="Komentar">';
                echo '      <form class="comment-form">';
                echo '        <textarea placeholder="Tambahkan komentar..." maxlength="200" aria-label="Input komentar"></textarea>';
                echo '        <button type="submit">Kirim</button>';
                echo '      </form>';
                echo '      <div class="comment-list"></div>'; // Daftar komentar akan diisi oleh JavaScript
                echo '    </div>';
                echo '  </div>';
                echo '</article>';
            }
        } else {
            echo "<p>Tidak ada postingan blog ditemukan.</p>";
        }
        // Tutup koneksi database
        $conn->close();
        ?>
      </section>
      <div class="infinite-loader" style="display: none" aria-hidden="true">
        Memuat...
      </div>
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
