socialBtn();

function socialBtn() {
    const shareBtn = document.querySelector('.share-btn');
    const socialPanel = document.querySelector('.product-social');
    if (shareBtn && socialPanel) {
        shareBtn.addEventListener('click', function () {
            socialPanel.classList.toggle('show');
        });
    }
}
