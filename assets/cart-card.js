// // إعادة هيكلة عناصر السلة مع أزرار +/- ودعم RTL/LTR - النسخة المحسّنة
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

//     // دالة مساعدة: استخراج السعر من عنصر HTML
//     function extractPrice(element) {
//         if (!element) return 0;
//         const text = element.textContent || element.innerText;
//         const match = text.match(/[\d,]+\.?\d*/);
//         return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
//     }

//     // دالة مساعدة: الحصول على الكمية الحالية
//     function getCurrentQuantity(productRow) {
//         const select = productRow.querySelector('.cart-product-quantity-dropdown select');
//         return parseInt(select?.value) || 1;
//     }

//     // دالة استخراج رمز/أيقونة العملة من عنصر السعر
//     function extractCurrency(priceElement) {
//         if (!priceElement) return '';
        
//         // نسخة من العنصر عشان نشتغل عليها
//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = priceElement.innerHTML;
        
//         // استخراج SVG لو موجود
//         const svgElement = tempDiv.querySelector('svg');
//         if (svgElement) {
//             return svgElement.outerHTML;
//         }
        
//         // لو مفيش SVG، نبحث عن رمز العملة النصي
//         const textContent = priceElement.textContent || '';
//         // إزالة الأرقام والفواصل والنقاط والمسافات
//         const currencySymbol = textContent.replace(/[\d,.\s]/g, '').trim();
        
//         if (currencySymbol) {
//             return currencySymbol;
//         }
        
//         // لو مفيش حاجة، نرجع فاضي
//         return '';
//     }

//     // دالة حساب سعر الوحدة من المصدر الأساسي (.cart-product-prices .totals)
//     function calculateUnitPrices(productRow) {
//         const pricesDiv = productRow.querySelector('.cart-product-prices');
//         if (!pricesDiv) return null;

//         const totalsDiv = pricesDiv.querySelector('.totals');
//         if (!totalsDiv) return null;

//         const quantity = getCurrentQuantity(productRow);
//         if (quantity === 0) return null;

//         // البحث عن السعر الأصلي قبل الخصم
//         const priceBeforeElement = totalsDiv.querySelector('del, .cart-product-total-before-price');
        
//         // البحث عن السعر بعد الخصم (أو السعر الحالي)
//         const priceAfterElement = totalsDiv.querySelector('.cart-product-total-price');

//         // استخراج رمز العملة
//         const currencyHTML = extractCurrency(priceAfterElement);

//         let unitPrice = 0;
//         let unitPriceOriginal = 0;
//         let hasDiscount = false;

//         // إذا كان فيه سعر أصلي (قبل الخصم)
//         if (priceBeforeElement && priceAfterElement) {
//             hasDiscount = true;
//             const totalOriginal = extractPrice(priceBeforeElement);
//             const totalAfter = extractPrice(priceAfterElement);
            
//             unitPriceOriginal = totalOriginal / quantity;
//             unitPrice = totalAfter / quantity;
//         } else if (priceAfterElement) {
//             // مفيش خصم، السعر العادي فقط
//             const total = extractPrice(priceAfterElement);
//             unitPrice = total / quantity;
//         }

//         return {
//             unitPrice,
//             unitPriceOriginal,
//             hasDiscount,
//             currencyHTML
//         };
//     }

//     // دالة تحديث سعر الوحدة ديناميكياً
//     function updateUnitPrice(productRow) {
//         const priceEachElement = productRow.querySelector('.cart-product-price-each[data-dynamic-price="true"]');
//         if (!priceEachElement) return;

//         // حساب السعر من جديد
//         const priceInfo = calculateUnitPrices(productRow);
//         if (!priceInfo) return;

//         // تحديث العرض
//         if (priceInfo.hasDiscount && priceInfo.unitPriceOriginal > 0) {
//             priceEachElement.innerHTML = `
//                 <span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPriceOriginal.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//                 <span class="price-discounted">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//             `;
//         } else {
//             priceEachElement.innerHTML = `${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             })}`;
//         }
//     }

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
//         const totalPrice = pricesDiv?.querySelector('.cart-product-total-price');

//         // حساب سعر الوحدة من المصدر الأساسي
//         const priceInfo = calculateUnitPrices(cartRow);
//         if (!priceInfo) return;

//         // إنشاء عنصر عرض سعر الوحدة
//         const priceEach = document.createElement('div');
//         priceEach.className = 'cart-product-price-each';
//         priceEach.dataset.dynamicPrice = 'true'; // علامة للتحديث الديناميكي
        
//         if (priceInfo.hasDiscount && priceInfo.unitPriceOriginal > 0) {
//             // عرض السعر الأصلي والسعر بعد الخصم
//             priceEach.innerHTML = `
//                 <span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPriceOriginal.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//                 <span class="price-discounted">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//             `;
//         } else {
//             // عرض السعر العادي فقط
//             priceEach.innerHTML = `${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             })}`;
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
//         if (select.previousElementSibling && select.previousElementSibling.classList.contains('quantity-controls-wrapper')) {
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
            
//             // تحديث سعر الوحدة ديناميكياً
//             const productRow = select.closest('.cart-product-row-wrapper');
//             if (productRow) {
//                 updateUnitPrice(productRow);
//             }
//         }

//         // تقليل الكمية
//         btnDecrease.addEventListener('click', function() {
//             const oldQty = parseInt(select.value) || 0;
//             if (oldQty > MIN_QUANTITY) {
//                 const newQty = oldQty - 1;
//                 select.value = newQty;
                
//                 // استدعاء دالة التغيير الأصلية
//                 const event = new Event('change', { bubbles: true });
//                 select.dispatchEvent(event);
                
//                 // التحقق بعد فترة قصيرة: هل السليكت اتغير فعلاً؟
//                 setTimeout(function() {
//                     const actualQty = parseInt(select.value) || 0;
                    
//                     // لو السليكت رجع للقيمة القديمة (يعني زد رفضت التغيير)
//                     if (actualQty === oldQty) {
//                         // نرجع الزر للقيمة الصحيحة
//                         display.textContent = actualQty;
//                     } else {
//                         // التغيير نجح
//                         updateControls();
//                     }
//                 }, 100);
//             }
//         });

//         // زيادة الكمية
//         btnIncrease.addEventListener('click', function() {
//             const oldQty = parseInt(select.value) || 0;
//             if (oldQty < MAX_QUANTITY) {
//                 const newQty = oldQty + 1;
//                 select.value = newQty;
                
//                 // استدعاء دالة التغيير الأصلية
//                 const event = new Event('change', { bubbles: true });
//                 select.dispatchEvent(event);
                
//                 // التحقق بعد فترة قصيرة: هل السليكت اتغير فعلاً؟
//                 setTimeout(function() {
//                     const actualQty = parseInt(select.value) || 0;
                    
//                     // لو السليكت رجع للقيمة القديمة (يعني زد رفضت التغيير)
//                     if (actualQty === oldQty) {
//                         // نرجع الزر للقيمة الصحيحة
//                         display.textContent = actualQty;
//                     } else {
//                         // التغيير نجح
//                         updateControls();
//                     }
//                 }, 100);
//             }
//         });

//         // مراقبة تغيير السليكت
//         select.addEventListener('change', function() {
//             updateControls();
//         });

//         // تحديث أولي
//         updateControls();
//     }

//     // دالة مراقبة تغيير السعر الإجمالي في .cart-product-prices
//     function observePriceChanges(productRow) {
//         const pricesDiv = productRow.querySelector('.cart-product-prices');
//         if (!pricesDiv) return;

//         // مراقبة تغييرات في الأسعار
//         const priceObserver = new MutationObserver(function(mutations) {
//             // تحديث سعر الوحدة عند تغيير السعر الإجمالي
//             updateUnitPrice(productRow);
//         });

//         // مراقبة .totals div
//         const totalsDiv = pricesDiv.querySelector('.totals');
//         if (totalsDiv) {
//             priceObserver.observe(totalsDiv, {
//                 childList: true,
//                 subtree: true,
//                 characterData: true
//             });
//         }
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
//         cartRowWrappers.forEach(wrapper => {
//             restructureCartRow(wrapper);
//             observePriceChanges(wrapper); // إضافة مراقبة الأسعار
//         });

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
//                         observePriceChanges(node); // إضافة مراقبة الأسعار
//                     }
                    
//                     const newWrappers = node.querySelectorAll ? node.querySelectorAll('.cart-product-row-wrapper') : [];
//                     newWrappers.forEach(wrapper => {
//                         restructureCartRow(wrapper);
//                         observePriceChanges(wrapper); // إضافة مراقبة الأسعار
//                     });
                    
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
// إعادة هيكلة عناصر السلة مع أزرار +/- ودعم RTL/LTR - النسخة المحسّنة
/****************/
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
//             direction: ltr;
//         }
        
//         /* رسائل الخصم */
//         .cart-product-discount-messages {
//             font-size: 13px;
//             color: #27ae60;
//             margin-top: 4px;
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

//     // دالة مساعدة: استخراج السعر من عنصر HTML
//     function extractPrice(element) {
//         if (!element) return 0;
//         const text = element.textContent || element.innerText;
//         const match = text.match(/[\d,]+\.?\d*/);
//         return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
//     }

//     // دالة مساعدة: الحصول على الكمية الحالية
//     function getCurrentQuantity(productRow) {
//         const select = productRow.querySelector('.cart-product-quantity-dropdown select');
//         return parseInt(select?.value) || 1;
//     }

//     // دالة استخراج رمز/أيقونة العملة من عنصر السعر
//     function extractCurrency(priceElement) {
//         if (!priceElement) return '';
        
//         // نسخة من العنصر عشان نشتغل عليها
//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = priceElement.innerHTML;
        
//         // استخراج SVG لو موجود
//         const svgElement = tempDiv.querySelector('svg');
//         if (svgElement) {
//             return svgElement.outerHTML;
//         }
        
//         // لو مفيش SVG، نبحث عن رمز العملة النصي
//         const textContent = priceElement.textContent || '';
//         // إزالة الأرقام والفواصل والنقاط والمسافات
//         const currencySymbol = textContent.replace(/[\d,.\s]/g, '').trim();
        
//         if (currencySymbol) {
//             return currencySymbol;
//         }
        
//         // لو مفيش حاجة، نرجع فاضي
//         return '';
//     }

//     // دالة حساب سعر الوحدة من المصدر الأساسي (.cart-product-prices .totals)
//     function calculateUnitPrices(productRow) {
//         const pricesDiv = productRow.querySelector('.cart-product-prices');
//         if (!pricesDiv) return null;

//         const totalsDiv = pricesDiv.querySelector('.totals');
//         if (!totalsDiv) return null;

//         const quantity = getCurrentQuantity(productRow);
//         if (quantity === 0) return null;

//         // البحث عن السعر الأصلي قبل الخصم
//         const priceBeforeElement = totalsDiv.querySelector('del, .cart-product-total-before-price');
        
//         // البحث عن السعر بعد الخصم (أو السعر الحالي)
//         const priceAfterElement = totalsDiv.querySelector('.cart-product-total-price');

//         // استخراج رمز العملة
//         const currencyHTML = extractCurrency(priceAfterElement);

//         let unitPrice = 0;
//         let unitPriceOriginal = 0;
//         let hasDiscount = false;

//         // إذا كان فيه سعر أصلي (قبل الخصم)
//         if (priceBeforeElement && priceAfterElement) {
//             hasDiscount = true;
//             const totalOriginal = extractPrice(priceBeforeElement);
//             const totalAfter = extractPrice(priceAfterElement);
            
//             unitPriceOriginal = totalOriginal / quantity;
//             unitPrice = totalAfter / quantity;
//         } else if (priceAfterElement) {
//             // مفيش خصم، السعر العادي فقط
//             const total = extractPrice(priceAfterElement);
//             unitPrice = total / quantity;
//         }

//         return {
//             unitPrice,
//             unitPriceOriginal,
//             hasDiscount,
//             currencyHTML
//         };
//     }

//     // دالة تحديث سعر الوحدة ديناميكياً
//     function updateUnitPrice(productRow) {
//         const priceEachElement = productRow.querySelector('.cart-product-price-each[data-dynamic-price="true"]');
//         if (!priceEachElement) return;

//         // حساب السعر من جديد
//         const priceInfo = calculateUnitPrices(productRow);
//         if (!priceInfo) return;

//         // تحديث العرض
//         if (priceInfo.hasDiscount && priceInfo.unitPriceOriginal > 0) {
//             priceEachElement.innerHTML = `
//                 <span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPriceOriginal.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//                 <span class="price-discounted">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//             `;
//         } else {
//             priceEachElement.innerHTML = `${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             })}`;
//         }
//     }

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
//         const discountMessages = cartRow.querySelector('.cart-product-discount-messages');
//         if (!imgDiv || !detailsDiv) return;

//         // الحصول على معلومات المنتج
//         const quantitySelect = actionsDiv?.querySelector('select');
//         // const title = detailsDiv.querySelector('h1');
//         const totalPrice = pricesDiv?.querySelector('.cart-product-total-price');

//         // حساب سعر الوحدة من المصدر الأساسي
//         const priceInfo = calculateUnitPrices(cartRow);
//         if (!priceInfo) return;

//         // إنشاء عنصر عرض سعر الوحدة
//         const priceEach = document.createElement('div');
//         priceEach.className = 'cart-product-price-each';
//         priceEach.dataset.dynamicPrice = 'true'; // علامة للتحديث الديناميكي
        
//         if (priceInfo.hasDiscount && priceInfo.unitPriceOriginal > 0) {
//             // عرض السعر الأصلي والسعر بعد الخصم
//             priceEach.innerHTML = `
//                 <span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPriceOriginal.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//                 <span class="price-discounted">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 })}</span>
//             `;
//         } else {
//             // عرض السعر العادي فقط
//             priceEach.innerHTML = `${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             })}`;
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
//         if (detailsDiv) {
//             itemNamePrice.appendChild(detailsDiv);
//         }

//         // إضافة سعر الوحدة
//         if (priceEach) {
//             itemNamePrice.appendChild(priceEach);
//         }

//         // إضافة رسائل الخصم إن وجدت
//         if (discountMessages) {
//             itemNamePrice.appendChild(discountMessages);
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
//         itemImgNamePrice.appendChild(newDeleteDiv);

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
//         if (select.previousElementSibling && select.previousElementSibling.classList.contains('quantity-controls-wrapper')) {
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
            
//             // تحديث سعر الوحدة ديناميكياً
//             const productRow = select.closest('.cart-product-row-wrapper');
//             if (productRow) {
//                 updateUnitPrice(productRow);
//             }
//         }

//         // تقليل الكمية
//         btnDecrease.addEventListener('click', function() {
//             const oldQty = parseInt(select.value) || 0;
//             if (oldQty > MIN_QUANTITY) {
//                 const newQty = oldQty - 1;
//                 select.value = newQty;
                
//                 // استدعاء دالة التغيير الأصلية
//                 const event = new Event('change', { bubbles: true });
//                 select.dispatchEvent(event);
                
//                 // التحقق بعد فترة قصيرة: هل السليكت اتغير فعلاً؟
//                 setTimeout(function() {
//                     const actualQty = parseInt(select.value) || 0;
                    
//                     // لو السليكت رجع للقيمة القديمة (يعني زد رفضت التغيير)
//                     if (actualQty === oldQty) {
//                         // نرجع الزر للقيمة الصحيحة
//                         display.textContent = actualQty;
//                     } else {
//                         // التغيير نجح
//                         updateControls();
//                     }
//                 }, 100);
//             }
//         });

//         // زيادة الكمية
//         btnIncrease.addEventListener('click', function() {
//             const oldQty = parseInt(select.value) || 0;
//             if (oldQty < MAX_QUANTITY) {
//                 const newQty = oldQty + 1;
//                 select.value = newQty;
                
//                 // استدعاء دالة التغيير الأصلية
//                 const event = new Event('change', { bubbles: true });
//                 select.dispatchEvent(event);
                
//                 // التحقق بعد فترة قصيرة: هل السليكت اتغير فعلاً؟
//                 setTimeout(function() {
//                     const actualQty = parseInt(select.value) || 0;
                    
//                     // لو السليكت رجع للقيمة القديمة (يعني زد رفضت التغيير)
//                     if (actualQty === oldQty) {
//                         // نرجع الزر للقيمة الصحيحة
//                         display.textContent = actualQty;
//                     } else {
//                         // التغيير نجح
//                         updateControls();
//                     }
//                 }, 100);
//             }
//         });

//         // مراقبة تغيير السليكت
//         select.addEventListener('change', function() {
//             updateControls();
//         });

//         // تحديث أولي
//         updateControls();
//     }

//     // دالة مراقبة تغيير السعر الإجمالي في .cart-product-prices
//     function observePriceChanges(productRow) {
//         const pricesDiv = productRow.querySelector('.cart-product-prices');
//         if (!pricesDiv) return;

//         // مراقبة تغييرات في الأسعار
//         const priceObserver = new MutationObserver(function(mutations) {
//             // تحديث سعر الوحدة عند تغيير السعر الإجمالي
//             updateUnitPrice(productRow);
//         });

//         // مراقبة .totals div
//         const totalsDiv = pricesDiv.querySelector('.totals');
//         if (totalsDiv) {
//             priceObserver.observe(totalsDiv, {
//                 childList: true,
//                 subtree: true,
//                 characterData: true
//             });
//         }
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
//         cartRowWrappers.forEach(wrapper => {
//             restructureCartRow(wrapper);
//             observePriceChanges(wrapper); // إضافة مراقبة الأسعار
//         });

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
//                         observePriceChanges(node); // إضافة مراقبة الأسعار
//                     }
                    
//                     const newWrappers = node.querySelectorAll ? node.querySelectorAll('.cart-product-row-wrapper') : [];
//                     newWrappers.forEach(wrapper => {
//                         restructureCartRow(wrapper);
//                         observePriceChanges(wrapper); // إضافة مراقبة الأسعار
//                     });
                    
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
/*** */
// إعادة هيكلة عناصر السلة مع أزرار +/- ودعم RTL/LTR - النسخة المحسّنة
(function() {
    // إعدادات
    const MIN_QUANTITY = 0;
    const MAX_QUANTITY = 100;

    // النصوص حسب اللغة
    const texts = {
        rtl: {
            subtotal: 'الإجمالي :'
        },
        ltr: {
            subtotal: 'Subtotal :'
        }
    };

    // SVG أيقونة X للحذف
    const deleteSVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    // دالة للحصول على النصوص حسب اللغة
    function getTexts() {
        const isRTL = document.body.classList.contains('rtl');
        return isRTL ? texts.rtl : texts.ltr;
    }

    

    // دالة مساعدة: استخراج السعر من عنصر HTML
    function extractPrice(element) {
        if (!element) return 0;
        const text = element.textContent || element.innerText;
        const match = text.match(/[\d,]+\.?\d*/);
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    }

    // دالة مساعدة: الحصول على الكمية الحالية
    function getCurrentQuantity(cartRow) {
        const select = cartRow.querySelector('.cart-product-quantity-dropdown select');
        return parseInt(select?.value) || 1;
    }

    // دالة استخراج رمز/أيقونة العملة من عنصر السعر
    function extractCurrency(priceElement) {
        if (!priceElement) return '';
        
        // نسخة من العنصر عشان نشتغل عليها
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = priceElement.innerHTML;
        
        // استخراج SVG لو موجود
        const svgElement = tempDiv.querySelector('svg');
        if (svgElement) {
            return svgElement.outerHTML;
        }
        
        // لو مفيش SVG، نبحث عن رمز العملة النصي
        const textContent = priceElement.textContent || '';
        // إزالة الأرقام والفواصل والنقاط والمسافات
        const currencySymbol = textContent.replace(/[\d,.\s]/g, '').trim();
        
        if (currencySymbol) {
            return currencySymbol;
        }
        
        // لو مفيش حاجة، نرجع فاضي
        return '';
    }

    // دالة حساب سعر الوحدة من المصدر الأساسي (.cart-product-prices .totals)
    function calculateUnitPrices(cartRow) {
        const pricesDiv = cartRow.querySelector('.cart-product-prices');
        if (!pricesDiv) return null;

        const totalsDiv = pricesDiv.querySelector('.totals');
        if (!totalsDiv) return null;

        const quantity = getCurrentQuantity(cartRow);
        if (quantity === 0) return null;

        // البحث عن السعر الأصلي قبل الخصم
        const priceBeforeElement = totalsDiv.querySelector('del, .cart-product-total-before-price');
        
        // البحث عن السعر بعد الخصم (أو السعر الحالي)
        const priceAfterElement = totalsDiv.querySelector('.cart-product-total-price');

        // استخراج رمز العملة
        const currencyHTML = extractCurrency(priceAfterElement);

        let unitPrice = 0;
        let unitPriceOriginal = 0;
        let hasDiscount = false;

        // إذا كان فيه سعر أصلي (قبل الخصم)
        if (priceBeforeElement && priceAfterElement) {
            hasDiscount = true;
            const totalOriginal = extractPrice(priceBeforeElement);
            const totalAfter = extractPrice(priceAfterElement);
            
            unitPriceOriginal = totalOriginal / quantity;
            unitPrice = totalAfter / quantity;
        } else if (priceAfterElement) {
            // مفيش خصم، السعر العادي فقط
            const total = extractPrice(priceAfterElement);
            unitPrice = total / quantity;
        }

        return {
            unitPrice,
            unitPriceOriginal,
            hasDiscount,
            currencyHTML
        };
    }

    // دالة تحديث سعر الوحدة ديناميكياً
    function updateUnitPrice(cartRow) {
        const priceEachElement = cartRow.querySelector('.cart-product-price-each[data-dynamic-price="true"]');
        if (!priceEachElement) return;

        // حساب السعر من جديد
        const priceInfo = calculateUnitPrices(cartRow);
        if (!priceInfo) return;

        // تحديث العرض
        if (priceInfo.hasDiscount && priceInfo.unitPriceOriginal > 0) {
            priceEachElement.innerHTML = `
                <span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPriceOriginal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
                <span class="price-discounted">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
            `;
        } else {
            priceEachElement.innerHTML = `${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }

    // دالة إعادة هيكلة عناصر السلة حسب الهيكل الجديد
    function restructureCartRow(cartRow) {
        // التحقق من عدم إعادة الهيكلة مرتين
        if (cartRow.dataset.restructured === 'true') {
            return;
        }

        // الحصول على العناصر الموجودة
        const deleteDiv = cartRow.querySelector('.cart-product-delete');
        const imgDiv = cartRow.querySelector('.cart-product-col-img');
        const detailsDiv = cartRow.querySelector('.cart-product-col-details');
        const actionsDiv = cartRow.querySelector('.cart-products-action');
        const pricesDiv = cartRow.querySelector('.cart-product-prices');

        if (!imgDiv || !detailsDiv) return;

        // الحصول على معلومات المنتج
        const quantitySelect = actionsDiv?.querySelector('select');
        const totalPrice = pricesDiv?.querySelector('.cart-product-total-price');

        // حساب سعر الوحدة من المصدر الأساسي
        const priceInfo = calculateUnitPrices(cartRow);
        if (!priceInfo) return;

        // إنشاء عنصر عرض سعر الوحدة
        const priceEach = document.createElement('div');
        priceEach.className = 'cart-product-price-each';
        priceEach.dataset.dynamicPrice = 'true'; // علامة للتحديث الديناميكي
        
        if (priceInfo.hasDiscount && priceInfo.unitPriceOriginal > 0) {
            // عرض السعر الأصلي والسعر بعد الخصم
            priceEach.innerHTML = `
                <span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPriceOriginal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
                <span class="price-discounted">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
            `;
        } else {
            // عرض السعر العادي فقط
            priceEach.innerHTML = `${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }

        // الحصول على النصوص حسب اللغة
        const currentTexts = getTexts();

        // === القسم الأول: item-img-name-price ===
        const itemImgNamePrice = document.createElement('div');
        itemImgNamePrice.className = 'item-img-name-price';

        // إضافة الصورة
        itemImgNamePrice.appendChild(imgDiv);

        // إنشاء item-name-price
        const itemNamePrice = document.createElement('div');
        itemNamePrice.className = 'item-name-price';

        // إضافة العنوان
        
        if (detailsDiv) {
            itemNamePrice.appendChild(detailsDiv);
        }
        // إضافة سعر الوحدة
        if (priceEach) {
            itemNamePrice.appendChild(priceEach);
        }

        // إضافة رسائل الخصم إن وجدت
        const discountMessages = detailsDiv.querySelector('.cart-product-discount-messages');
        if (discountMessages) {
            itemNamePrice.appendChild(discountMessages);
        }

        itemImgNamePrice.appendChild(itemNamePrice);

        // === القسم الثاني: item-total-quantity ===
        const itemTotalQuantity = document.createElement('div');
        itemTotalQuantity.className = 'item-total-quantity';

        // إضافة قسم الإجمالي
        const subtotalSection = document.createElement('div');
        subtotalSection.className = 'subtotal-section';

        const subtotalLabel = document.createElement('div');
        subtotalLabel.className = 'subtotal-label';
        subtotalLabel.textContent = currentTexts.subtotal;
        subtotalSection.appendChild(subtotalLabel);

        if (totalPrice) {
            totalPrice.className = 'cart-product-total-price';
            subtotalSection.appendChild(totalPrice);
        }

       

        // إضافة قسم الكمية والحذف
        const quantityActions = document.createElement('div');
        quantityActions.className = 'quantity-actions';

        // إضافة الكمية والسيليكت
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'cart-product-quantity-dropdown';
        if (quantitySelect) {
            quantityDiv.appendChild(quantitySelect);
        }
        quantityActions.appendChild(quantityDiv);

        // إنشاء زر الحذف الجديد مع SVG
        const newDeleteDiv = document.createElement('div');
        newDeleteDiv.className = 'cart-product-delete';
        const deleteLink = document.createElement('a');
        
        // نسخ الخصائص من الزر القديم
        if (deleteDiv) {
            const oldLink = deleteDiv.querySelector('a');
            if (oldLink) {
                deleteLink.setAttribute('onclick', oldLink.getAttribute('onclick'));
                deleteLink.setAttribute('data-cart-product-id', oldLink.getAttribute('data-cart-product-id'));
                deleteLink.setAttribute('data-product-id', oldLink.getAttribute('data-product-id'));
                deleteLink.setAttribute('data-template', oldLink.getAttribute('data-template'));
            }
        }
        
        deleteLink.innerHTML = deleteSVG;
        newDeleteDiv.appendChild(deleteLink);
        itemImgNamePrice.appendChild(newDeleteDiv);

        itemTotalQuantity.appendChild(quantityActions); ///////////////
        
 itemTotalQuantity.appendChild(subtotalSection);
        // استبدال المحتوى القديم بالجديد
        cartRow.innerHTML = '';
        cartRow.appendChild(itemImgNamePrice);
        cartRow.appendChild(itemTotalQuantity);
        
        // وضع علامة أنه تم إعادة الهيكلة
        cartRow.dataset.restructured = 'true';
    }

    // دالة لإنشاء أزرار الكمية
    function createQuantityControls(select) {
        // التحقق من عدم إنشاء الأزرار مرتين
        if (select.previousElementSibling && select.previousElementSibling.classList.contains('quantity-controls-wrapper')) {
            return;
        }

        const currentQuantity = parseInt(select.value) || 0;

        // إنشاء العناصر
        const wrapper = document.createElement('div');
        wrapper.className = 'quantity-controls-wrapper';

        const btnDecrease = document.createElement('button');
        btnDecrease.className = 'quantity-btn qty-decrease';
        btnDecrease.innerHTML = '−';
        btnDecrease.type = 'button';

        const display = document.createElement('span');
        display.className = 'quantity-display';
        display.textContent = currentQuantity;

        const btnIncrease = document.createElement('button');
        btnIncrease.className = 'quantity-btn qty-increase';
        btnIncrease.innerHTML = '+';
        btnIncrease.type = 'button';

        // إضافة العناصر للـ 
        wrapper.appendChild(btnIncrease);
        wrapper.appendChild(display);
        wrapper.appendChild(btnDecrease);

        // إدراج الأزرار قبل السليكت
        select.parentNode.insertBefore(wrapper, select);

        // دالة تحديث العرض والحالة
        function updateControls() {
            const qty = parseInt(select.value) || 0;
            display.textContent = qty;
            btnDecrease.disabled = qty <= MIN_QUANTITY;
            btnIncrease.disabled = qty >= MAX_QUANTITY;
            
            // تحديث سعر الوحدة ديناميكياً
            const cartRow = select.closest('.cart-product-row');
            if (cartRow) {
                updateUnitPrice(cartRow);
            }
        }

        // تقليل الكمية
        btnDecrease.addEventListener('click', function() {
            const oldQty = parseInt(select.value) || 0;
            if (oldQty > MIN_QUANTITY) {
                const newQty = oldQty - 1;
                select.value = newQty;
                
                // استدعاء دالة التغيير الأصلية
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                
                // التحقق بعد فترة قصيرة: هل السليكت اتغير فعلاً؟
                setTimeout(function() {
                    const actualQty = parseInt(select.value) || 0;
                    
                    // لو السليكت رجع للقيمة القديمة (يعني زد رفضت التغيير)
                    if (actualQty === oldQty) {
                        // نرجع الزر للقيمة الصحيحة
                        display.textContent = actualQty;
                    } else {
                        // التغيير نجح
                        updateControls();
                    }
                }, 100);
            }
        });

        // زيادة الكمية
        btnIncrease.addEventListener('click', function() {
            const oldQty = parseInt(select.value) || 0;
            if (oldQty < MAX_QUANTITY) {
                const newQty = oldQty + 1;
                select.value = newQty;
                
                // استدعاء دالة التغيير الأصلية
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                
                // التحقق بعد فترة قصيرة: هل السليكت اتغير فعلاً؟
                setTimeout(function() {
                    const actualQty = parseInt(select.value) || 0;
                    
                    // لو السليكت رجع للقيمة القديمة (يعني زد رفضت التغيير)
                    if (actualQty === oldQty) {
                        // نرجع الزر للقيمة الصحيحة
                        display.textContent = actualQty;
                    } else {
                        // التغيير نجح
                        updateControls();
                    }
                }, 100);
            }
        });

        // مراقبة تغيير السليكت
        select.addEventListener('change', function() {
            updateControls();
        });

        // تحديث أولي
        updateControls();
    }

    // دالة مراقبة تغيير السعر الإجمالي في .cart-product-prices
    function observePriceChanges(cartRow) {
        const pricesDiv = cartRow.querySelector('.cart-product-prices');
        if (!pricesDiv) return;

        // مراقبة تغييرات في الأسعار
        const priceObserver = new MutationObserver(function(mutations) {
            // تحديث سعر الوحدة عند تغيير السعر الإجمالي
            updateUnitPrice(cartRow);
        });

        // مراقبة .totals div
        const totalsDiv = pricesDiv.querySelector('.totals');
        if (totalsDiv) {
            priceObserver.observe(totalsDiv, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    // دالة تحديث النصوص عند تغيير اللغة
    function updateTexts() {
        const currentTexts = getTexts();

        // تحديث نصوص الإجمالي
        document.querySelectorAll('.subtotal-label').forEach(label => {
            label.textContent = currentTexts.subtotal;
        });
    }

    // التهيئة الأساسية
    function init() {
        // إعادة هيكلة جميع صفوف السلة
        const cartRows = document.querySelectorAll('.cart-product-row');
        cartRows.forEach(row => {
            restructureCartRow(row);
            observePriceChanges(row); // إضافة مراقبة الأسعار
        });

        // إضافة أزرار الكمية
        const selects = document.querySelectorAll('.cart-product-quantity-dropdown select');
        selects.forEach(createQuantityControls);
    }

    // تشغيل عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // مراقبة تغيير class على body (RTL/LTR)
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateTexts();
            }
        });
    });

    bodyObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    // مراقبة إضافة عناصر جديدة للصفحة
    const contentObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    // إعادة هيكلة صفوف السلة الجديدة
                    if (node.classList && node.classList.contains('cart-product-row')) {
                        restructureCartRow(node);
                        observePriceChanges(node); // إضافة مراقبة الأسعار
                    }
                    
                    const newRows = node.querySelectorAll ? node.querySelectorAll('.cart-product-row') : [];
                    newRows.forEach(row => {
                        restructureCartRow(row);
                        observePriceChanges(row); // إضافة مراقبة الأسعار
                    });
                    
                    // إضافة أزرار للسليكت الجديد
                    const selects = node.querySelectorAll ? 
                        node.querySelectorAll('.cart-product-quantity-dropdown select') : 
                        [];
                    selects.forEach(createQuantityControls);
                }
            });
        });
    });

    contentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // إتاحة الدوال للاستخدام الخارجي
    window.initCartQuantityControls = init;
    window.updateCartTexts = updateTexts;
})();