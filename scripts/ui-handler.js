import { readExifData, formatExifData } from './exif-reader.js';
import { removeExif } from './image-processor.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM elemanlarını seç
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('file-input');
  const previewArea = document.getElementById('preview-area');
  const previewImage = document.getElementById('preview-image');
  const exifSection = document.getElementById('exif-section');
  const exifBefore = document.getElementById('exif-before');
  const exifAfter = document.getElementById('exif-after');
  const actionSection = document.getElementById('action-section');
  const cleanBtn = document.getElementById('clean-btn');
  const downloadLink = document.getElementById('download-link');

  let currentFile = null;
  let cleanedDataUrl = null;

  // Dosya işleme fonksiyonu
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

    // Görsel önizleme
    previewImage.src = URL.createObjectURL(file);
    previewArea.classList.remove('hidden');

    // EXIF verisini oku ve göster
    readExifData(file, (data) => {
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

  // Sürükle bırak eventi - dragover
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
  });

  // dragleave
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
  });

  // drop eventi - dosya bırakma
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Dosya input değişimi
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFile(fileInput.files[0]);
    }
  });

  // Temizle butonu tıklama
  cleanBtn.addEventListener('click', () => {
    if (!currentFile) return;

    cleanBtn.disabled = true;
    cleanBtn.textContent = 'Temizleniyor...';

    removeExif(currentFile, (cleanedUrl) => {
      cleanedDataUrl = cleanedUrl;

      downloadLink.href = cleanedDataUrl;
      downloadLink.classList.remove('hidden');

      exifAfter.textContent = 'EXIF verileri temizlendi. Artık güvenle paylaşabilirsiniz.';

      cleanBtn.disabled = false;
      cleanBtn.textContent = 'EXIF Verilerini Temizle';
    });
  });
});
