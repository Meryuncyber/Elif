import { readExifData, formatExifData } from './exif-reader.js';
import { removeExif } from './image-processor.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elementler
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

  let currentFile = null;     // Şu an yüklenen dosya
  let cleanedDataUrl = null;  // Temizlenmiş görselin DataURL’si

  // Dosya seçimi & yüklemesi
  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen JPEG veya PNG formatında bir görsel seçin.');
      return;
    }
    currentFile = file;

    // Önizleme için URL oluştur
    const objectUrl = URL.createObjectURL(file);
    previewImage.src = objectUrl;
    previewArea.classList.remove('hidden');

    // EXIF verisi oku
    readExifData(file, (data) => {
      exifBefore.textContent = formatExifData(data);
      exifSection.classList.remove('hidden');
      exifAfter.textContent = 'Henüz temizleme yapılmadı.';
      actionSection.classList.remove('hidden');
      downloadLink.classList.add('hidden');
      cleanedDataUrl = null;
    });
  }

  // Sürükle Bırak Olayları
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
  });

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');

    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Dosya input değiştiğinde
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0]);
    }
  });

  // Temizle butonu tıklanınca
  cleanBtn.addEventListener('click', () => {
    if (!currentFile) return;

    cleanBtn.disabled = true;
    cleanBtn.textContent = 'Temizleniyor...';

    removeExif(currentFile, (dataUrl) => {
      cleanedDataUrl = dataUrl;

      // İndirme linkini güncelle
      downloadLink.href = cleanedDataUrl;
      downloadLink.classList.remove('hidden');

      exifAfter.textContent = 'EXIF verileri temizlendi. Artık güvenle paylaşabilirsiniz.';
      cleanBtn.disabled = false;
      cleanBtn.textContent = 'EXIF Verilerini Temizle';
    });
  });
});
