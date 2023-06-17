function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageSrc = event.target.result;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data.startsWith('WIFI:')) {
        const wifiData = code.data.substring(5).split(';');
        let ssid = '';
        let password = '';

        wifiData.forEach((item) => {
          const [key, value] = item.split(':');
          if (key === 'S') {
            ssid = value;
          } else if (key === 'P') {
            password = value;
          }
        });

        document.getElementById('ssidInfo').innerText = `SSID: ${ssid}`;
        document.getElementById('passwordInfo').innerText = `Password: ${password}`;
      } else {
        document.getElementById('ssidInfo').innerText = '';
        document.getElementById('passwordInfo').innerText = 'No valid WiFi QR code found.';
      }
    };

    img.src = imageSrc;
  };

  reader.readAsDataURL(file);
}

document.getElementById('qrInput').addEventListener('change', handleFileSelect, false);
