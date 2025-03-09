document.addEventListener('DOMContentLoaded', () => {
    const qrText = document.getElementById('qrText');
    const generateBtn = document.getElementById('generateBtn');
    const qrCodeDiv = document.getElementById('qrCode');
    const downloadBtn = document.getElementById('downloadBtn');

    generateBtn.addEventListener('click', generateQRCode);
    qrText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });

    function generateQRCode() {
        const text = qrText.value.trim();
        if (!text) {
            alert('Por favor, digite um texto ou URL');
            return;
        }

        // Limpa o QR code anterior com animação
        qrCodeDiv.innerHTML = '';
        downloadBtn.classList.add('hidden');

        // Gera o QR code
        const qr = qrcode(0, 'L');
        qr.addData(text);
        qr.make();

        // Adiciona o QR code ao DOM com animação
        const qrImage = document.createElement('img');
        qrImage.src = qr.createDataURL(4);
        qrImage.style.opacity = '0';
        qrImage.style.transform = 'scale(0.9)';
        qrCodeDiv.appendChild(qrImage);

        // Animação de entrada do QR code
        setTimeout(() => {
            qrImage.style.opacity = '1';
            qrImage.style.transform = 'scale(1)';
        }, 50);

        // Mostra o botão de download com animação
        downloadBtn.classList.remove('hidden');
        downloadBtn.style.opacity = '0';
        downloadBtn.style.transform = 'translateY(20px)';
        setTimeout(() => {
            downloadBtn.style.opacity = '1';
            downloadBtn.style.transform = 'translateY(0)';
        }, 300);

        // Adiciona função de download
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `qr-code-${Date.now()}.png`;
            link.href = qrImage.src;
            link.click();
        });
    }
});
