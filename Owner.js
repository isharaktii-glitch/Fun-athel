
function saveBankDetails() {
    const bankName = document.getElementById('bankName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const bankDetails = { bankName, accountNumber };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(bankDetails), 'secret-key').toString();
    localStorage.setItem('bankDetails', encrypted);
    alert('Bank details saved securely!');
}
function uploadVideo() {
    const videoUrl = document.getElementById('videoUrl').value;
    const category = document.getElementById('category').value;
    const accessType = document.getElementById('accessType').value;

    
    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    videos.push({ url: videoUrl, category, accessType, id: Date.now() });
    localStorage.setItem('videos', JSON.stringify(videos));
    alert('Video uploaded!');
}
