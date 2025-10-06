// // إعادة هيكلة عناصر السلة مع أزرار +/- ودعم RTL/LTR
// (function() {
//     // إعدادات
//     const MIN_QUANTITY = 0;
//     const MAX_QUANTITY = 100;

//     // النصوص حسب اللغة
//     const texts = {
//         rtl: {
//             subtotal: 'الإجمالي'
//         },
//         ltr: {
//             subtotal: 'Subtotal'
//         }
//     };

//     // SVG أيقونة X للحذف
//     const deleteSVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//     </svg>`;

//     // دالة للحصول على النصوص حسب اللغة
//     function getTexts() {
//         const isRTL = document.body.classList.contains('rtl');
//         return isRTL ? texts.rtl : texts.ltr;
//     }

//     // CSS للتصميم الجديد
//     const style = document.createElement('style');
//     style.textContent = `
//         /* هيكل الكارد الجديد */
//         .cart-product-row-wrapper {
//             background: white;
//             border-radius: 8px;
//             padding: 15px;
//             margin-bottom: 15px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }

//         .cart-product-row {
//             display: flex;
//             justify-content: space-between;
//             gap: 20px;
//             align-items: flex-start;
//         }
        
//         /* القسم الأول: الصورة والاسم والسعر */
//         .item-img-name-price {
//             display: flex;
//             gap: 15px;
//             align-items: flex-start;
//             flex: 1;
//         }

//         .cart-product-col-img {
//             flex-shrink: 0;
//             width: 100px;
//             height: 100px;
//         }

//         .cart-product-col-img img {
//             width: 100%;
//             height: 100%;
//             object-fit: cover;
//             border-radius: 8px;
//         }
        
//         .item-name-price {
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//             flex: 1;
//         }
        
//         .item-name-price h1 {
//             margin: 0;
//             font-size: 16px;
//             font-weight: 600;
//             line-height: 1.4;
//         }
        
//         .item-name-price h1 a {
//             color: #333;
//             text-decoration: none;
//         }
        
//         .item-name-price h1 a:hover {
//             color: #0066cc;
//         }
        
//         .cart-product-price-each {
//             font-size: 14px;
//             color: #666;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             flex-wrap: wrap;
//         }
        
//         .cart-product-price-each .price-original {
//             text-decoration: line-through;
//             color: #999;
//             font-size: 13px;
//         }
        
//         .cart-product-price-each .price-discounted {
//             color: #e74c3c;
//             font-weight: 600;
//         }
        
//         /* القسم الثاني: الإجمالي والكمية */
//         .item-total-quantity {
//             display: flex;
//             flex-direction: column;
//             gap: 15px;
//             align-items: flex-end;
//             min-width: 200px;
//         }

//         body.rtl .item-total-quantity {
//             align-items: flex-start;
//         }
        
//         .subtotal-section {
//             display: flex;
//             flex-direction: column;
//             gap: 4px;
//             text-align: right;
//         }

//         body.rtl .subtotal-section {
//             text-align: left;
//         }
        
//         .subtotal-label {
//             font-size: 13px;
//             color: #666;
//             font-weight: 500;
//         }
        
//         .cart-product-total-price {
//             font-size: 18px;
//             font-weight: bold;
//             color: #2c5f2d;
//         }
        
//         .quantity-actions {
//             display: flex;
//             flex-direction: column;
//             gap: 10px;
//             align-items: flex-end;
//         }

//         body.rtl .quantity-actions {
//             align-items: flex-start;
//         }
        
//         /* أزرار الكمية */
//         .quantity-controls-wrapper {
//             display: flex;
//             align-items: center;
//             gap: 8px;
//         }
        
//         .quantity-btn {
//             width: 34px;
//             height: 34px;
//             border: 1px solid #ddd;
//             background: white;
//             border-radius: 6px;
//             cursor: pointer;
//             font-size: 18px;
//             font-weight: bold;
//             color: #333;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             transition: all 0.2s;
//             user-select: none;
//         }
        
//         .quantity-btn:hover:not(:disabled) {
//             background: #f0f0f0;
//             border-color: #999;
//             transform: translateY(-1px);
//         }
        
//         .quantity-btn:active:not(:disabled) {
//             transform: translateY(0);
//         }
        
//         .quantity-btn:disabled {
//             opacity: 0.3;
//             cursor: not-allowed;
//         }
        
//         .quantity-display {
//             min-width: 40px;
//             text-align: center;
//             font-weight: bold;
//             font-size: 16px;
//             color: #333;
//         }
        
//         /* السيليكت مخفي */
//         .cart-product-quantity-dropdown select {
//             display: none;
//         }
        
//         /* زر الحذف */
//         .cart-product-delete a {
//             display: inline-flex;
//             align-items: center;
//             justify-content: center;
//             width: 36px;
//             height: 36px;
//             background: #ff4444;
//             color: white;
//             border-radius: 6px;
//             text-decoration: none;
//             transition: all 0.2s;
//             cursor: pointer;
//             border: none;
//             padding: 0;
//         }
        
//         .cart-product-delete a:hover {
//             background: #cc0000;
//             transform: translateY(-1px);
//             box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
//         }

//         .cart-product-delete a:active {
//             transform: translateY(0);
//         }

//         .cart-product-delete a svg {
//             width: 20px;
//             height: 20px;
//         }

//         /* RTL Support */
//         body.rtl .cart-product-row {
//             direction: rtl;
//         }

//         body.ltr .cart-product-row {
//             direction: ltr;
//         }
        
//         @media (max-width: 768px) {
//             .cart-product-row {
//                 flex-direction: column;
//             }

//             .item-img-name-price {
//                 width: 100%;
//             }

//             .cart-product-col-img {
//                 width: 80px;
//                 height: 80px;
//             }
            
//             .item-total-quantity {
//                 width: 100%;
//                 align-items: stretch;
//             }

//             body.rtl .item-total-quantity {
//                 align-items: stretch;
//             }

//             .quantity-actions {
//                 flex-direction: row;
//                 justify-content: space-between;
//                 align-items: center;
//             }

//             body.rtl .quantity-actions {
//                 flex-direction: row;
//             }
//         }
//     `;
//     document.head.appendChild(style);

//     // دالة إعادة هيكلة عناصر السلة حسب الهيكل الجديد
//     function restructureCartRow(cartRowWrapper) {
//         // التحقق من عدم إعادة الهيكلة مرتين
//         if (cartRowWrapper.dataset.restructured === 'true') {
//             return;
//         }

//         const cartRow = cartRowWrapper.querySelector('.cart-product-row');
//         if (!cartRow) return;

//         // الحصول على العناصر الموجودة
//         const deleteDiv = cartRow.querySelector('.cart-product-delete');
//         const imgDiv = cartRow.querySelector('.cart-product-col-img');
//         const detailsDiv = cartRow.querySelector('.cart-product-col-details');
//         const actionsDiv = cartRow.querySelector('.cart-products-action');
//         const pricesDiv = cartRow.querySelector('.cart-product-prices');

//         if (!imgDiv || !detailsDiv) return;

//         // الحصول على معلومات المنتج
//         const quantitySelect = actionsDiv?.querySelector('select');
//         const title = detailsDiv.querySelector('h1');
//         let priceEach = pricesDiv?.querySelector('.cart-product-price-each');
//         const totalPrice = pricesDiv?.querySelector('.cart-product-total-price');

//         // حساب وحفظ سعر الوحدة (مع دعم الخصومات)
//         let unitPrice = 0;
//         let unitPriceOriginal = 0;
//         let currencyHTML = '';
//         let hasDiscount = false;

//         if (totalPrice && quantitySelect) {
//             const currentQty = parseInt(quantitySelect.value) || 1;
            
//             // استخراج رمز العملة (SVG)
//             const svgElement = totalPrice.querySelector('svg');
//             currencyHTML = svgElement ? svgElement.outerHTML : '';

//             // البحث عن السعر الأصلي والسعر بعد الخصم
//             const priceOriginalElement = pricesDiv?.querySelector('.cart-product-price-original, .price-original');
//             const priceDiscountedElement = pricesDiv?.querySelector('.cart-product-price-discounted, .price-discounted');

//             // إذا كان فيه خصم
//             if (priceOriginalElement && priceDiscountedElement) {
//                 hasDiscount = true;
                
//                 // استخراج السعر الأصلي
//                 const originalText = priceOriginalElement.textContent || priceOriginalElement.innerText;
//                 const originalMatch = originalText.match(/[\d,]+\.?\d*/);
//                 if (originalMatch) {
//                     const originalTotal = parseFloat(originalMatch[0].replace(/,/g, ''));
//                     unitPriceOriginal = originalTotal / currentQty;
//                 }

//                 // استخراج السعر بعد الخصم
//                 const discountedText = priceDiscountedElement.textContent || priceDiscountedElement.innerText;
//                 const discountedMatch = discountedText.match(/[\d,]+\.?\d*/);
//                 if (discountedMatch) {
//                     const discountedTotal = parseFloat(discountedMatch[0].replace(/,/g, ''));
//                     unitPrice = discountedTotal / currentQty;
//                 }
//             } else {
//                 // لو مفيش خصم، نستخدم السعر الإجمالي العادي
//                 const totalPriceText = totalPrice.textContent || totalPrice.innerText;
//                 const totalPriceMatch = totalPriceText.match(/[\d,]+\.?\d*/);
                
//                 if (totalPriceMatch) {
//                     const totalAmount = parseFloat(totalPriceMatch[0].replace(/,/g, ''));
//                     unitPrice = totalAmount / currentQty;
//                 }
//             }
//         }

//         // إذا لم يكن موجود سعر الوحدة، نصنعه
//         if (!priceEach && unitPrice > 0) {
//             priceEach = document.createElement('div');
//             priceEach.className = 'cart-product-price-each';
            
//             if (hasDiscount && unitPriceOriginal > 0) {
//                 // عرض السعر الأصلي والسعر بعد الخصم
//                 priceEach.innerHTML = `
//                     <span class="price-original">${unitPriceOriginal.toLocaleString('en-US', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2
//                     })} ${currencyHTML}</span>
//                     <span class="price-discounted">${unitPrice.toLocaleString('en-US', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2
//                     })} ${currencyHTML}</span>
//                 `;
//             } else {
//                 // عرض السعر العادي فقط
//                 priceEach.innerHTML = `${unitPrice.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })} ${currencyHTML}`;
//             }
//         }

//         // حفظ سعر الوحدة في الـ select للاستخدام لاحقاً
//         if (quantitySelect && unitPrice > 0) {
//             quantitySelect.dataset.unitPrice = unitPrice.toString();
//             quantitySelect.dataset.currencyHtml = currencyHTML;
//             if (hasDiscount && unitPriceOriginal > 0) {
//                 quantitySelect.dataset.unitPriceOriginal = unitPriceOriginal.toString();
//             }
//         }

//         // الحصول على النصوص حسب اللغة
//         const currentTexts = getTexts();

//         // إنشاء الهيكل الجديد
//         const newCartRow = document.createElement('div');
//         newCartRow.className = 'cart-product-row';

//         // === القسم الأول: item-img-name-price ===
//         const itemImgNamePrice = document.createElement('div');
//         itemImgNamePrice.className = 'item-img-name-price';

//         // إضافة الصورة
//         itemImgNamePrice.appendChild(imgDiv);

//         // إنشاء item-name-price
//         const itemNamePrice = document.createElement('div');
//         itemNamePrice.className = 'item-name-price';

//         // إضافة العنوان
//         if (title) {
//             itemNamePrice.appendChild(title);
//         }

//         // إضافة سعر الوحدة
//         if (priceEach) {
//             itemNamePrice.appendChild(priceEach);
//         }

//         itemImgNamePrice.appendChild(itemNamePrice);
//         newCartRow.appendChild(itemImgNamePrice);

//         // === القسم الثاني: item-total-quantity ===
//         const itemTotalQuantity = document.createElement('div');
//         itemTotalQuantity.className = 'item-total-quantity';

//         // إضافة قسم الإجمالي
//         const subtotalSection = document.createElement('div');
//         subtotalSection.className = 'subtotal-section';

//         const subtotalLabel = document.createElement('div');
//         subtotalLabel.className = 'subtotal-label';
//         subtotalLabel.textContent = currentTexts.subtotal;
//         subtotalSection.appendChild(subtotalLabel);

//         if (totalPrice) {
//             totalPrice.className = 'cart-product-total-price';
//             subtotalSection.appendChild(totalPrice);
//         }

//         itemTotalQuantity.appendChild(subtotalSection);

//         // إضافة قسم الكمية والحذف
//         const quantityActions = document.createElement('div');
//         quantityActions.className = 'quantity-actions';

//         // إضافة الكمية والسيليكت
//         const quantityDiv = document.createElement('div');
//         quantityDiv.className = 'cart-product-quantity-dropdown';
//         if (quantitySelect) {
//             quantityDiv.appendChild(quantitySelect);
//         }
//         quantityActions.appendChild(quantityDiv);

//         // إنشاء زر الحذف الجديد مع SVG
//         const newDeleteDiv = document.createElement('div');
//         newDeleteDiv.className = 'cart-product-delete';
//         const deleteLink = document.createElement('a');
        
//         // نسخ الخصائص من الزر القديم
//         if (deleteDiv) {
//             const oldLink = deleteDiv.querySelector('a');
//             if (oldLink) {
//                 deleteLink.setAttribute('onclick', oldLink.getAttribute('onclick'));
//                 deleteLink.setAttribute('data-cart-product-id', oldLink.getAttribute('data-cart-product-id'));
//                 deleteLink.setAttribute('data-product-id', oldLink.getAttribute('data-product-id'));
//                 deleteLink.setAttribute('data-template', oldLink.getAttribute('data-template'));
//             }
//         }
        
//         deleteLink.innerHTML = deleteSVG;
//         newDeleteDiv.appendChild(deleteLink);
//         quantityActions.appendChild(newDeleteDiv);

//         itemTotalQuantity.appendChild(quantityActions);
//         newCartRow.appendChild(itemTotalQuantity);

//         // استبدال المحتوى القديم بالجديد
//         cartRowWrapper.innerHTML = '';
//         cartRowWrapper.appendChild(newCartRow);
        
//         // وضع علامة أنه تم إعادة الهيكلة
//         cartRowWrapper.dataset.restructured = 'true';
//     }

//     // دالة لإنشاء أزرار الكمية
//     function createQuantityControls(select) {
//         // التحقق من عدم إنشاء الأزرار مرتين
//         if (select.closest('.quantity-controls-wrapper')) {
//             return;
//         }

//         const currentQuantity = parseInt(select.value) || 0;

//         // إنشاء العناصر
//         const wrapper = document.createElement('div');
//         wrapper.className = 'quantity-controls-wrapper';

//         const btnDecrease = document.createElement('button');
//         btnDecrease.className = 'quantity-btn qty-decrease';
//         btnDecrease.innerHTML = '−';
//         btnDecrease.type = 'button';

//         const display = document.createElement('span');
//         display.className = 'quantity-display';
//         display.textContent = currentQuantity;

//         const btnIncrease = document.createElement('button');
//         btnIncrease.className = 'quantity-btn qty-increase';
//         btnIncrease.innerHTML = '+';
//         btnIncrease.type = 'button';

//         // إضافة العناصر للـ wrapper
//         wrapper.appendChild(btnDecrease);
//         wrapper.appendChild(display);
//         wrapper.appendChild(btnIncrease);

//         // إدراج الأزرار قبل السليكت
//         select.parentNode.insertBefore(wrapper, select);

//         // دالة تحديث العرض والحالة
//         function updateControls() {
//             const qty = parseInt(select.value) || 0;
//             display.textContent = qty;
//             btnDecrease.disabled = qty <= MIN_QUANTITY;
//             btnIncrease.disabled = qty >= MAX_QUANTITY;
            
//             // تحديث السعر إذا كان موجود
//             updatePrice(select, qty);
//         }

//         // تقليل الكمية
//         btnDecrease.addEventListener('click', function() {
//             let qty = parseInt(select.value) || 0;
//             if (qty > MIN_QUANTITY) {
//                 qty--;
//                 select.value = qty;
                
//                 // استدعاء دالة التغيير الأصلية
//                 const event = new Event('change', { bubbles: true });
//                 select.dispatchEvent(event);
                
//                 updateControls();
//             }
//         });

//         // زيادة الكمية
//         btnIncrease.addEventListener('click', function() {
//             let qty = parseInt(select.value) || 0;
//             if (qty < MAX_QUANTITY) {
//                 qty++;
//                 select.value = qty;
                
//                 // استدعاء دالة التغيير الأصلية
//                 const event = new Event('change', { bubbles: true });
//                 select.dispatchEvent(event);
                
//                 updateControls();
//             }
//         });

//         // مراقبة تغيير السليكت
//         select.addEventListener('change', function() {
//             updateControls();
//         });

//         // تحديث أولي
//         updateControls();
//     }

//     // دالة تحديث السعر
//     function updatePrice(select, quantity) {
//         const productRow = select.closest('.cart-product-row-wrapper');
//         if (!productRow) return;

//         const totalPriceElement = productRow.querySelector('.cart-product-total-price');
//         if (!totalPriceElement) return;

//         // استخدام السعر المحفوظ في data attribute
//         const unitPrice = parseFloat(select.dataset.unitPrice);
//         const currencyHTML = select.dataset.currencyHtml || '';

//         if (isNaN(unitPrice) || unitPrice <= 0) return;

//         // حساب السعر الجديد
//         const total = quantity * unitPrice;
        
//         // تحديث السعر
//         totalPriceElement.innerHTML = `${total.toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//         })} ${currencyHTML}`;
//     }

//     // دالة تحديث النصوص عند تغيير اللغة
//     function updateTexts() {
//         const currentTexts = getTexts();

//         // تحديث نصوص الإجمالي
//         document.querySelectorAll('.subtotal-label').forEach(label => {
//             label.textContent = currentTexts.subtotal;
//         });
//     }

//     // التهيئة الأساسية
//     function init() {
//         // إعادة هيكلة جميع صفوف السلة
//         const cartRowWrappers = document.querySelectorAll('.cart-product-row-wrapper');
//         cartRowWrappers.forEach(restructureCartRow);

//         // إضافة أزرار الكمية
//         const selects = document.querySelectorAll('.cart-product-quantity-dropdown select');
//         selects.forEach(createQuantityControls);
//     }

//     // تشغيل عند تحميل الصفحة
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', init);
//     } else {
//         init();
//     }

//     // مراقبة تغيير class على body (RTL/LTR)
//     const bodyObserver = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//             if (mutation.attributeName === 'class') {
//                 updateTexts();
//             }
//         });
//     });

//     bodyObserver.observe(document.body, {
//         attributes: true,
//         attributeFilter: ['class']
//     });

//     // مراقبة إضافة عناصر جديدة للصفحة
//     const contentObserver = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//             mutation.addedNodes.forEach(function(node) {
//                 if (node.nodeType === 1) {
//                     // إعادة هيكلة صفوف السلة الجديدة
//                     if (node.classList && node.classList.contains('cart-product-row-wrapper')) {
//                         restructureCartRow(node);
//                     }
                    
//                     const newWrappers = node.querySelectorAll ? node.querySelectorAll('.cart-product-row-wrapper') : [];
//                     newWrappers.forEach(restructureCartRow);
                    
//                     // إضافة أزرار للسليكت الجديد
//                     const selects = node.querySelectorAll ? 
//                         node.querySelectorAll('.cart-product-quantity-dropdown select') : 
//                         [];
//                     selects.forEach(createQuantityControls);
//                 }
//             });
//         });
//     });

//     contentObserver.observe(document.body, {
//         childList: true,
//         subtree: true
//     });

//     // إتاحة الدوال للاستخدام الخارجي
//     window.initCartQuantityControls = init;
//     window.updateCartTexts = updateTexts;
// })();