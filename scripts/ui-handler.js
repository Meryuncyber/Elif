document.addEventListener('DOMContentLoaded', function () {
  // DOM elementleri
  var dropArea = document.getElementById('drop-area');
  var fileInput = document.getElementById('file-input');
  var previewArea = document.getElementById('preview-area');
  var previewImage = document.getElementById('preview-image');
  var exifSection = document.getElementById('exif-section');
  var exifBefore = document.getElementById('exif-before');
  var exifAfter = document.getElementById('exif-after');
  var actionSection = document.getElementById('action-section');
  var cleanBtn = document.getElementById('clean-btn');
  var downloadLink = document.getElementById('download-link');

  var currentFile = null;
  var cleanedDataUrl = null;

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen JPEG veya PNG formatında bir görsel seçin.');
      return;
    }

    currentFile = file;

    // Önceki URL varsa serbest bırak
    if (previewImage.src) {
      URL.revokeObjectURL(previewImage.src);
    }

    previewImage.src = URL.createObjectURL(file);
    previewArea.classList.remove('hidden');

    // EXIF verisini oku ve göster
    readExifData(file, function (data) {
      exifBefore.textContent = formatExifData(data);
      exifSection.classList.remove('hidden');
      exifAfter.textContent = 'Henüz temizleme yapılmadı.';
      actionSection.classList.remove('hidden');
      downloadLink.classList.add('hidden');
      cleanedDataUrl = null;
      cleanBtn.disabled = false;
      cleanBtn.textContent = 'EXIF Verilerini Temizle';
    });
  }

  // Drag & Drop Eventleri
  dropArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropArea.classList.add('dragover');
  });

  dropArea.addEventListener('dragleave', function () {
    dropArea.classList.remove('dragover');
  });

  dropArea.addEventListener('drop', function (e) {
    e.preventDefault();
    dropArea.classList.remove('dragover');

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Dosya input değişimi
  fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
      handleFile(fileInput.files[0]);
    }
  });

  // Temizleme butonu
  cleanBtn.addEventListener('click', function () {
    if (!currentFile) return;

    cleanBtn.disabled = true;
    cleanBtn.textContent = 'Temizleniyor...';

    removeExif(currentFile, function (cleanedUrl) {
      cleanedDataUrl = cleanedUrl;

      downloadLink.href = cleanedDataUrl;
      downloadLink.classList.remove('hidden');

      exifAfter.textContent = 'EXIF verileri temizlendi. Artık güvenle paylaşabilirsiniz.';

      cleanBtn.disabled = false;
      cleanBtn.textContent = 'EXIF Verilerini Temizle';
    });
  });
});
