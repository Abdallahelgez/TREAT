
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
            priceEachElement.innerHTML = `<span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPriceOriginal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
                <span class="price-discounted">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</span>
                
            `;
        } else {
            priceEachElement.innerHTML = `<span class="price-original">${priceInfo.currencyHTML} ${priceInfo.unitPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</span>`;
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
        btnDecrease.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
</svg>`;
        btnDecrease.type = 'button';

        const display = document.createElement('span');
        display.className = 'quantity-display';
        display.textContent = currentQuantity;

        const btnIncrease = document.createElement('button');
        btnIncrease.className = 'quantity-btn qty-increase';
        btnIncrease.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
</svg>`;
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



























// document.addEventListener('DOMContentLoaded', function() {
    
//     const cartTotalsDiv = document.querySelector('.cart-totals-div');
//     const couponForm = document.querySelector('.coupon-form');
//     const includeVat = document.querySelector('.include-vat');
//     const cartTotalsSide = document.querySelector('.cart-totals-side');
    
//     // التحقق من وجود العناصر الأساسية
//     if (!cartTotalsDiv || !couponForm) {
//         console.error('لم يتم العثور على العناصر المطلوبة');
//         return;
//     }
    
//     // دالة لنقل coupon-form داخل cart-totals-div
//     function moveCouponForm() {
//         // التحقق من أن coupon-form ليس داخل cart-totals-div بالفعل
//         if (!cartTotalsDiv.contains(couponForm)) {
//             cartTotalsDiv.appendChild(couponForm);
//             console.log('تم نقل coupon-form داخل cart-totals-div');
//         }
//     }
    
//     // دالة لنقل include-vat داخل العنصر .cart-product-row-wrapper.total
//     function moveIncludeVat() {
//         if (!includeVat) return;
        
//         const totalElement = document.querySelector('.cart-product-row-wrapper.total');
        
//         if (totalElement && !totalElement.contains(includeVat)) {
//             totalElement.appendChild(includeVat);
//             console.log('تم نقل include-vat داخل .cart-product-row-wrapper.total');
//         }
//     }
    
//     // دالة لتغيير نص أول عنصر cart-totals-row-wrapper
//     function updateFirstTotalText() {
//         const firstTotal = document.querySelector('.cart-product-row-wrapper.cart-totals-row-wrapper .flex-grow-1');
        
//         if (!firstTotal) return;
        
//         // التحقق من اللغة (عربي أو إنجليزي)
//         const htmlLang = document.documentElement.lang || 'ar';
//         const isArabic = htmlLang === 'ar' || htmlLang.startsWith('ar');
        
//         // تغيير النص حسب اللغة
//         if (isArabic) {
//             firstTotal.textContent = 'إجمالى المنتجات';
//         } else {
//             firstTotal.textContent = 'Total Products';
//         }
        
//         console.log('تم تحديث نص إجمالي المنتجات');
//     }
    
//     // دالة لتنفيذ جميع التحركات
//     function moveElements() {
//         // إيقاف المراقبة مؤقتاً لتجنب التكرار
//         if (observer) {
//             observer.disconnect();
//         }
        
//         moveCouponForm();
//         moveIncludeVat();
//         updateFirstTotalText();
        
//         // إعادة تشغيل المراقبة
//         if (observer) {
//             const elementToObserve = cartTotalsSide || cartTotalsDiv;
//             observer.observe(elementToObserve, config);
//         }
//     }
    
//     // تنفيذ التحركات فور تحميل الصفحة
//     moveElements();
//     console.log('تم نقل العناصر عند تحميل الصفحة');
    
//     // إعدادات المراقبة
//     const config = {
//         childList: true,        // مراقبة إضافة/حذف العناصر الفرعية
//         subtree: true,          // مراقبة جميع العناصر الفرعية
//         attributes: true,       // مراقبة تغيير الخصائص
//         characterData: true     // مراقبة تغيير النصوص
//     };
    
//     // إنشاء MutationObserver لمراقبة التغييرات
//     let observer = new MutationObserver(function(mutations) {
//         let shouldUpdate = false;
        
//         mutations.forEach(function(mutation) {
//             // التحقق من نوع التغيير
//             if (mutation.type === 'childList') {
//                 shouldUpdate = true;
//             } else if (mutation.type === 'characterData') {
//                 // التحقق إذا كان التغيير في النص المستهدف
//                 const target = mutation.target.parentElement;
//                 if (target && target.classList.contains('flex-grow-1')) {
//                     shouldUpdate = true;
//                 }
//             }
//         });
        
//         if (shouldUpdate) {
//             console.log('تم اكتشاف تغيير في cart-totals');
//             moveElements();
//         }
//     });
    
//     // إعدادات المراقبة - تم نقلها لأعلى
    
//     // بدء المراقبة - نراقب الـ parent container لو موجود، وإلا نراقب cart-totals-div
//     const elementToObserve = cartTotalsSide || cartTotalsDiv;
//     observer.observe(elementToObserve, config);
    
//     console.log('بدأت مراقبة التغييرات على', elementToObserve.className);
    
//     // اختياري: دالة لإيقاف المراقبة عند الحاجة
//     window.stopCartMonitoring = function() {
//         observer.disconnect();
//         console.log('تم إيقاف مراقبة التغييرات');
//     };
    
// });