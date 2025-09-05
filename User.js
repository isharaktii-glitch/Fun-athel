
const encryptedBankDetails = localStorage.getItem('bankDetails');
let bankDetails = {};
if (encryptedBankDetails) {
    const decrypted = CryptoJS.AES.decrypt(encryptedBankDetails, 'secret-key').toString(CryptoJS.enc.Utf8);
    bankDetails = JSON.parse(decrypted);
}
document.getElementById('bankDetails').innerText = bankDetails.bankName ? `${bankDetails.bankName} - ${bankDetails.accountNumber}` : 'Bank details not set';


function loadVideos(category) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = '';
    
    
    let videos = JSON.parse(localStorage.getItem('videos')) || [];
    
    
    const freeVideos = videos.filter(v => v.category === category && v.accessType === 'free').slice(0, 2);
    freeVideos.forEach(video => {
        videoContainer.innerHTML += `
            <div class="video-card">
                <iframe src="${video.url}" width="300" height="200"></iframe>
            </div>
        `;
    });

    
    const paidVideos = videos.filter(v => v.category === category && v.accessType === 'paid');
    paidVideos.forEach(video => {
        videoContainer.innerHTML += `
            <div class="video-card">
                <iframe src="${video.url}" width="300" height="200" class="${localStorage.getItem('unlocked') ? '' : 'blurred'}"></iframe>
            </div>
        `;
    });
}


function uploadBankSlip() {
    const fileInput = document.getElementById('bankSlip');
    const file = fileInput.files[0];
    
    if (file) {
        Tesseract.recognize(file, 'eng', { logger: m => console.log(m) }).then(({ data: { text } }) => {
            const accountNumberMatch = text.match(/\d{10,16}/); // Example: 10-16 digit account number
            const amountMatch = text.match(/Rs\.?\s*(\d+)/); // Example: Rs. 500
            
            if (accountNumberMatch && amountMatch) {
                const extractedAccountNumber = accountNumberMatch[0];
                const extractedAmount = parseInt(amountMatch[1]);
                const encryptedBankDetails = localStorage.getItem('bankDetails');
                let bankDetails = {};
                if (encryptedBankDetails) {
                    const decrypted = CryptoJS.AES.decrypt(encryptedBankDetails, 'secret-key').toString(CryptoJS.enc.Utf8);
                    bankDetails = JSON.parse(decrypted);
                }
                
                if (bankDetails.accountNumber === extractedAccountNumber && extractedAmount >= 500) {
                    localStorage.setItem('unlocked', 'true');
                    loadVideos(document.querySelector('.category-btn:focus')?.textContent?.toLowerCase() || 'gay');
                    alert('අවදානයටයි.. leak or අසබ්‍ය video නැරඹීම් ප්‍රචලිත කිරීම නීති විරෝධී වන අතර ..ඔබ එය දැන ගැනීමෙන් හා ප්‍රවේශමෙන් කරන්න');
                } else {
                    alert('Invalid bank details or insufficient amount.');
                }
            } else {
                alert('Could not extract account number or amount from slip.');
            }
        });
    }
}
