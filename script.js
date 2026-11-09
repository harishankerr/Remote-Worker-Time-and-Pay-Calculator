document.addEventListener('DOMContentLoaded', () => {
    // Popular global currencies used by remote workers
    const POPULAR_CURRENCIES = {
        INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 86.80, locale: 'en-IN', decimals: 2 },
        EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, locale: 'de-DE', decimals: 2 },
        GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, locale: 'en-GB', decimals: 2 },
        PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rate: 58.50, locale: 'en-PH', decimals: 2 },
        CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.39, locale: 'en-CA', decimals: 2 },
        AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53, locale: 'en-AU', decimals: 2 },
        BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 5.75, locale: 'pt-BR', decimals: 2 },
        MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', rate: 20.30, locale: 'es-MX', decimals: 2 },
        PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 278.00, locale: 'ur-PK', decimals: 2 },
        BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 120.00, locale: 'bn-BD', decimals: 2 },
        NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1680.00, locale: 'en-NG', decimals: 2 },
        IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 15800.00, locale: 'id-ID', decimals: 0 },
        VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 25400.00, locale: 'vi-VN', decimals: 0 },
        COP: { code: 'COP', symbol: 'Col$', name: 'Colombian Peso', rate: 4400.00, locale: 'es-CO', decimals: 0 },
        ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso', rate: 1000.00, locale: 'es-AR', decimals: 2 },
        PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', rate: 4.10, locale: 'pl-PL', decimals: 2 },
        ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.20, locale: 'en-ZA', decimals: 2 },
        SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.34, locale: 'en-SG', decimals: 2 },
        AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67, locale: 'ar-AE', decimals: 2 },
        MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.45, locale: 'ms-MY', decimals: 2 },
        JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 154.00, locale: 'ja-JP', decimals: 0 },
        TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 34.50, locale: 'tr-TR', decimals: 2 },
        EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 49.30, locale: 'en-EG', decimals: 2 },
        USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.00, locale: 'en-US', decimals: 2 }
    };

    // DOM Elements - Calculator
    const timeEntriesContainer = document.getElementById('timeEntries');
    const addEntryBtn = document.getElementById('addEntryBtn');
    const resetBtn = document.getElementById('resetBtn');
    const payRateInput = document.getElementById('payRate');
    const currencySelect = document.getElementById('currencySelect');
    const exchangeRateInput = document.getElementById('exchangeRate');
    const rateStatusBadge = document.getElementById('rateStatus');
    const currencySymbolPrefix = document.getElementById('currencySymbolPrefix');
    const currentCurrencyCode = document.getElementById('currentCurrencyCode');

    const saveInfoBtn = document.getElementById('saveInfoBtn') || document.getElementById('saveRatesBtn');
    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    const saveStatusMsg = document.getElementById('saveStatusMsg');
    const STORAGE_KEY = 'timeCalc_savedInfo';

    const totalTimeDisplay = document.getElementById('totalTime');
    const totalDecimalHoursDisplay = document.getElementById('totalDecimalHours');
    const totalPayDisplay = document.getElementById('totalPay');
    const totalPayTargetDisplay = document.getElementById('totalPayTarget');
    const summaryCurrencyCode = document.getElementById('summaryCurrencyCode');
    const usdPaySubDisplay = document.getElementById('usdPaySub');
    const targetPaySubDisplay = document.getElementById('targetPaySub');

    // DOM Elements - Sidebar Projections
    const btnModeUnadjusted = document.getElementById('btnModeUnadjusted');
    const btnModeAdjusted = document.getElementById('btnModeAdjusted');
    const projectionsTableBody = document.getElementById('projectionsTableBody');
    const thTargetCurrency = document.getElementById('thTargetCurrency');
    const assumptionsNote = document.getElementById('assumptionsNote');

    const hoursPerDayInput = document.getElementById('hoursPerDay');
    const daysPerWeekInput = document.getElementById('daysPerWeek');
    const holidaysPerYearInput = document.getElementById('holidaysPerYear');
    const vacationDaysPerYearInput = document.getElementById('vacationDaysPerYear');

    // State
    let selectedCurrency = 'INR';
    let liveRatesCache = {};
    let isRateCustom = false;
    let projectionMode = 'unadjusted'; // 'unadjusted' | 'adjusted'

    // Initialize Currency Select
    populateCurrencySelect();

    // Check for saved info in localStorage (hourly rate, target currency, time entries)
    const hasSavedInfo = loadSavedInfo();
    if (!hasSavedInfo) {
        payRateInput.value = '15';
        selectedCurrency = 'INR';
        currencySelect.value = 'INR';
        addTimeEntry(0, 0, 0, false);
        addTimeEntry(0, 0, 0, false);
    }

    // Always fetch live exchange rates for selected currency
    fetchLiveRates();

    // Set initial values
    updateCurrencyUI();
    calculateAll();

    // ----------------------------------------------------
    // Event Listeners
    // ----------------------------------------------------
    addEntryBtn.addEventListener('click', () => {
        addTimeEntry();
        const rows = timeEntriesContainer.querySelectorAll('.time-row');
        if (rows.length > 0) {
            const lastHours = rows[rows.length - 1].querySelector('.hours-input');
            if (lastHours) lastHours.focus();
        }
    });

    resetBtn.addEventListener('click', resetAllEntries);

    if (saveInfoBtn) {
        saveInfoBtn.addEventListener('click', () => {
            saveInfo(true);
        });
    }

    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', resetDefaults);
    }

    payRateInput.addEventListener('input', () => {
        calculateAll();
        saveInfo(false);
    });

    currencySelect.addEventListener('change', () => {
        selectedCurrency = currencySelect.value;
        isRateCustom = false;
        const targetRate = liveRatesCache[selectedCurrency] || POPULAR_CURRENCIES[selectedCurrency]?.rate || 1;
        const decimals = POPULAR_CURRENCIES[selectedCurrency]?.decimals > 0 ? 2 : 0;
        exchangeRateInput.value = targetRate.toFixed(decimals);
        
        if (liveRatesCache[selectedCurrency]) {
            setRateBadge('Live Rate', 'live');
        } else {
            setRateBadge('Default', '');
        }

        updateCurrencyUI();
        calculateAll();
        saveInfo(false);
    });

    exchangeRateInput.addEventListener('input', () => {
        const val = parseFloat(exchangeRateInput.value);
        if (!isNaN(val) && val > 0) {
            isRateCustom = true;
            setRateBadge('Custom', 'custom');
            calculateAll();
        }
    });

    // Projections Mode Toggle
    btnModeUnadjusted.addEventListener('click', () => {
        projectionMode = 'unadjusted';
        btnModeUnadjusted.classList.add('active');
        btnModeUnadjusted.setAttribute('aria-selected', 'true');
        btnModeAdjusted.classList.remove('active');
        btnModeAdjusted.setAttribute('aria-selected', 'false');
        calculateProjections();
    });

    btnModeAdjusted.addEventListener('click', () => {
        projectionMode = 'adjusted';
        btnModeAdjusted.classList.add('active');
        btnModeAdjusted.setAttribute('aria-selected', 'true');
        btnModeUnadjusted.classList.remove('active');
        btnModeUnadjusted.setAttribute('aria-selected', 'false');
        calculateProjections();
    });

    // Custom Schedule Listeners
    [hoursPerDayInput, daysPerWeekInput, holidaysPerYearInput, vacationDaysPerYearInput].forEach(inp => {
        inp.addEventListener('input', calculateProjections);
    });

    // ----------------------------------------------------
    // Functions
    // ----------------------------------------------------
    function populateCurrencySelect() {
        currencySelect.innerHTML = '';
        Object.keys(POPULAR_CURRENCIES).forEach(code => {
            const curr = POPULAR_CURRENCIES[code];
            const opt = document.createElement('option');
            opt.value = code;
            opt.textContent = `${curr.code} (${curr.symbol}) — ${curr.name}`;
            if (code === selectedCurrency) opt.selected = true;
            currencySelect.appendChild(opt);
        });
    }

    function updateCurrencyUI() {
        const curr = POPULAR_CURRENCIES[selectedCurrency] || { symbol: selectedCurrency, code: selectedCurrency };
        currencySymbolPrefix.textContent = curr.symbol;
        currentCurrencyCode.textContent = curr.code;
        summaryCurrencyCode.textContent = curr.code;
        thTargetCurrency.textContent = `${curr.code} (${curr.symbol})`;
    }

    function setRateBadge(text, className) {
        if (!rateStatusBadge) return;
        rateStatusBadge.textContent = text;
        rateStatusBadge.className = 'rate-badge ' + (className || '');
    }

    function fetchLiveRates() {
        setRateBadge('Fetching live rate...', '');
        fetch('https://open.er-api.com/v6/latest/USD')
            .then(res => res.json())
            .then(data => {
                if (data && data.rates) {
                    liveRatesCache = data.rates;
                    if (liveRatesCache[selectedCurrency]) {
                        const newRate = liveRatesCache[selectedCurrency];
                        const decimals = POPULAR_CURRENCIES[selectedCurrency]?.decimals > 0 ? 2 : 0;
                        exchangeRateInput.value = newRate.toFixed(decimals);
                        isRateCustom = false;
                        setRateBadge('Live Rate', 'live');
                        calculateAll();
                    }
                }
            })
            .catch(err => {
                console.warn('Could not fetch exchange rates from API, using defaults.', err);
                const fallbackRate = POPULAR_CURRENCIES[selectedCurrency]?.rate || 1;
                const decimals = POPULAR_CURRENCIES[selectedCurrency]?.decimals > 0 ? 2 : 0;
                exchangeRateInput.value = fallbackRate.toFixed(decimals);
                setRateBadge('Default', '');
                calculateAll();
            });
    }

    // ----------------------------------------------------
    // Persistence Functions (Save Info: Hourly rate, Currency, Time entries)
    // ----------------------------------------------------
    function getSerializedTimeEntries() {
        const rows = timeEntriesContainer.querySelectorAll('.time-row');
        const entries = [];
        rows.forEach(row => {
            const h = parseFloat(row.querySelector('.hours-input').value) || 0;
            const m = parseFloat(row.querySelector('.minutes-input').value) || 0;
            const s = parseFloat(row.querySelector('.seconds-input').value) || 0;
            entries.push({ hours: h, minutes: m, seconds: s });
        });
        return entries;
    }

    function saveInfo(showFeedback = false) {
        // Save ONLY: hourly rate ($15 default), target currency (INR default), and hours/minutes/seconds time entries
        const infoData = {
            hourlyRate: parseFloat(payRateInput.value) || 15,
            targetCurrency: selectedCurrency || 'INR',
            timeEntries: getSerializedTimeEntries(),
            savedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(infoData));
            if (resetDefaultsBtn) resetDefaultsBtn.style.display = 'inline-block';

            if (showFeedback && saveStatusMsg) {
                saveStatusMsg.textContent = '✓ Info saved';
                saveStatusMsg.style.color = '#15803d';
                setTimeout(() => {
                    saveStatusMsg.textContent = '';
                }, 2500);
            }
        } catch (e) {
            console.warn('Could not save info to localStorage', e);
        }
    }

    function loadSavedInfo() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);

            // 1. Hourly rate (default: $15)
            if (data.hourlyRate !== undefined && !isNaN(data.hourlyRate)) {
                payRateInput.value = data.hourlyRate;
            } else {
                payRateInput.value = '15';
            }

            // 2. Target currency (default: INR)
            if (data.targetCurrency && POPULAR_CURRENCIES[data.targetCurrency]) {
                selectedCurrency = data.targetCurrency;
                currencySelect.value = data.targetCurrency;
            } else {
                selectedCurrency = 'INR';
                currencySelect.value = 'INR';
            }

            // 3. Time entries (hours/minutes/seconds)
            timeEntriesContainer.innerHTML = '';
            if (Array.isArray(data.timeEntries) && data.timeEntries.length > 0) {
                data.timeEntries.forEach(entry => {
                    addTimeEntry(entry.hours || 0, entry.minutes || 0, entry.seconds || 0, false);
                });
            } else {
                addTimeEntry(0, 0, 0, false);
                addTimeEntry(0, 0, 0, false);
            }

            if (resetDefaultsBtn) resetDefaultsBtn.style.display = 'inline-block';
            return true;
        } catch (e) {
            console.warn('Could not read saved info from localStorage', e);
            return false;
        }
    }

    function resetDefaults() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.warn(e);
        }

        payRateInput.value = '15';
        selectedCurrency = 'INR';
        currencySelect.value = 'INR';
        isRateCustom = false;

        // Reset to default time entries
        timeEntriesContainer.innerHTML = '';
        addTimeEntry(0, 0, 0, false);
        addTimeEntry(0, 0, 0, false);

        const defaultRate = liveRatesCache['INR'] || POPULAR_CURRENCIES['INR'].rate;
        exchangeRateInput.value = defaultRate.toFixed(2);
        setRateBadge(liveRatesCache['INR'] ? 'Live Rate' : 'Default', liveRatesCache['INR'] ? 'live' : '');

        if (resetDefaultsBtn) resetDefaultsBtn.style.display = 'none';
        if (saveStatusMsg) {
            saveStatusMsg.textContent = 'Reset to default';
            saveStatusMsg.style.color = '#64748b';
            setTimeout(() => {
                saveStatusMsg.textContent = '';
            }, 2500);
        }

        updateCurrencyUI();
        calculateAll();
    }

    function createTimeRow(hours = 0, minutes = 0, seconds = 0) {
        const row = document.createElement('div');
        row.className = 'time-row';

        row.innerHTML = `
            <div class="row-index">1</div>
            <div class="time-input-col">
                <input type="number" class="hours-input" min="0" value="${hours}" placeholder="0" aria-label="Hours">
            </div>
            <div class="time-input-col">
                <input type="number" class="minutes-input" min="0" value="${minutes}" placeholder="0" aria-label="Minutes">
            </div>
            <div class="time-input-col">
                <input type="number" class="seconds-input" min="0" value="${seconds}" placeholder="0" aria-label="Seconds">
            </div>
            <button type="button" class="btn-delete-row" title="Delete entry" aria-label="Delete entry">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                calculateTimeTotals();
                saveInfo(false);
            });

            input.addEventListener('focus', function () {
                if (this.value === '0') this.value = '';
            });

            input.addEventListener('blur', function () {
                if (this.value.trim() === '') this.value = '0';
            });

            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    if (this.classList.contains('seconds-input')) {
                        e.preventDefault();
                        addTimeEntry();
                        const allRows = timeEntriesContainer.querySelectorAll('.time-row');
                        const nextRow = allRows[allRows.length - 1];
                        if (nextRow) nextRow.querySelector('.hours-input').focus();
                    }
                }
            });
        });

        const deleteBtn = row.querySelector('.btn-delete-row');
        deleteBtn.addEventListener('click', () => {
            row.remove();
            updateRowIndices();
            calculateTimeTotals();
            saveInfo(false);
        });

        return row;
    }

    function addTimeEntry(hours = 0, minutes = 0, seconds = 0, autoSave = true) {
        const emptyState = timeEntriesContainer.querySelector('.empty-entries-message');
        if (emptyState) emptyState.remove();

        const row = createTimeRow(hours, minutes, seconds);
        timeEntriesContainer.appendChild(row);
        updateRowIndices();
        calculateTimeTotals();
        if (autoSave) saveInfo(false);
    }

    function updateRowIndices() {
        const rows = timeEntriesContainer.querySelectorAll('.time-row');
        if (rows.length === 0) {
            timeEntriesContainer.innerHTML = `
                <div class="empty-entries-message">
                    No time entries yet. Click <strong>Add Time Entry</strong> below to begin.
                </div>
            `;
            return;
        }

        rows.forEach((row, index) => {
            const indexElem = row.querySelector('.row-index');
            if (indexElem) {
                indexElem.textContent = index + 1;
            }
        });
    }

    function resetAllEntries() {
        timeEntriesContainer.innerHTML = '';
        addTimeEntry(0, 0, 0, false);
        saveInfo(false);
    }

    function calculateAll() {
        calculateTimeTotals();
        calculateProjections();
    }

    function calculateTimeTotals() {
        let totalSeconds = 0;
        const rows = timeEntriesContainer.querySelectorAll('.time-row');

        rows.forEach(row => {
            const h = parseFloat(row.querySelector('.hours-input').value) || 0;
            const m = parseFloat(row.querySelector('.minutes-input').value) || 0;
            const s = parseFloat(row.querySelector('.seconds-input').value) || 0;

            totalSeconds += Math.max(0, (h * 3600) + (m * 60) + s);
        });

        const displayH = Math.floor(totalSeconds / 3600);
        const displayM = Math.floor((totalSeconds % 3600) / 60);
        const displayS = Math.floor(totalSeconds % 60);

        totalTimeDisplay.textContent = `${pad(displayH)}h ${pad(displayM)}m ${pad(displayS)}s`;

        const totalHoursDecimal = totalSeconds / 3600;
        totalDecimalHoursDisplay.textContent = `${totalHoursDecimal.toFixed(2)} decimal hours`;

        const payRate = parseFloat(payRateInput.value) || 0;
        const totalPayUSD = totalHoursDecimal * payRate;
        const exchangeRate = parseFloat(exchangeRateInput.value) || POPULAR_CURRENCIES[selectedCurrency]?.rate || 1;
        const totalPayTarget = totalPayUSD * exchangeRate;

        totalPayDisplay.textContent = formatCurrency(totalPayUSD, 'USD');
        totalPayTargetDisplay.textContent = formatCurrency(totalPayTarget, selectedCurrency);

        usdPaySubDisplay.textContent = `at $${payRate.toFixed(2)} / hr`;
        const curr = POPULAR_CURRENCIES[selectedCurrency] || { symbol: '' };
        targetPaySubDisplay.textContent = `at ${curr.symbol}${exchangeRate.toFixed(2)} / USD`;
    }

    function calculateProjections() {
        const hourlyRate = parseFloat(payRateInput.value) || 0;
        const exchangeRate = parseFloat(exchangeRateInput.value) || POPULAR_CURRENCIES[selectedCurrency]?.rate || 1;

        const hPerDay = parseFloat(hoursPerDayInput.value) || 8;
        const dPerWeek = parseFloat(daysPerWeekInput.value) || 5;
        const holidays = parseFloat(holidaysPerYearInput.value) || 10;
        const vacation = parseFloat(vacationDaysPerYearInput.value) || 15;

        const weeksPerYear = 52;
        const totalWeekdays = dPerWeek * weeksPerYear; // standard 260
        const unadjustedAnnualHours = totalWeekdays * hPerDay; // standard 2,080

        const offDays = holidays + vacation; // standard 25
        const adjustedWorkingDays = Math.max(0, totalWeekdays - offDays); // standard 235
        const adjustedAnnualHours = adjustedWorkingDays * hPerDay; // standard 1,880

        let rowsData = [];

        if (projectionMode === 'unadjusted') {
            assumptionsNote.textContent = `Assumes ${hPerDay} hrs/day • ${hPerDay * dPerWeek} hrs/week • ${weeksPerYear} weeks (${unadjustedAnnualHours.toLocaleString()} hrs/year).`;

            const annualUSD = unadjustedAnnualHours * hourlyRate;
            rowsData = [
                { period: 'Hourly', usd: hourlyRate, prominent: false },
                { period: 'Daily', usd: hourlyRate * hPerDay, prominent: false },
                { period: 'Weekly', usd: hourlyRate * (hPerDay * dPerWeek), prominent: false },
                { period: 'Bi-weekly', usd: hourlyRate * (hPerDay * dPerWeek) * 2, prominent: false },
                { period: 'Semi-monthly', usd: annualUSD / 24, prominent: false },
                { period: 'Monthly', usd: annualUSD / 12, prominent: true },
                { period: 'Quarterly', usd: annualUSD / 4, prominent: false },
                { period: 'Annual', usd: annualUSD, prominent: true }
            ];
        } else {
            assumptionsNote.textContent = `Adjusted for ${holidays} holidays & ${vacation} vacation days (${adjustedWorkingDays} working days, ${adjustedAnnualHours.toLocaleString()} hrs/year).`;

            const annualUSD = adjustedAnnualHours * hourlyRate;
            rowsData = [
                { period: 'Hourly', usd: unadjustedAnnualHours > 0 ? annualUSD / unadjustedAnnualHours : 0, prominent: false },
                { period: 'Daily', usd: totalWeekdays > 0 ? annualUSD / totalWeekdays : 0, prominent: false },
                { period: 'Weekly', usd: annualUSD / weeksPerYear, prominent: false },
                { period: 'Bi-weekly', usd: annualUSD / 26, prominent: false },
                { period: 'Semi-monthly', usd: annualUSD / 24, prominent: false },
                { period: 'Monthly', usd: annualUSD / 12, prominent: true },
                { period: 'Quarterly', usd: annualUSD / 4, prominent: false },
                { period: 'Annual', usd: annualUSD, prominent: true }
            ];
        }

        // Render rows
        projectionsTableBody.innerHTML = '';
        rowsData.forEach(item => {
            const tr = document.createElement('tr');
            if (item.prominent) tr.className = 'row-prominent';

            const targetVal = item.usd * exchangeRate;

            tr.innerHTML = `
                <td class="td-period">${item.period}</td>
                <td class="td-usd">${formatCurrency(item.usd, 'USD')}</td>
                <td class="td-target">${formatCurrency(targetVal, selectedCurrency)}</td>
            `;
            projectionsTableBody.appendChild(tr);
        });
    }

    function formatCurrency(amount, currencyCode) {
        const curr = POPULAR_CURRENCIES[currencyCode] || { symbol: '', locale: 'en-US', decimals: 2 };
        const decimals = (curr.decimals !== undefined) ? curr.decimals : 2;

        const formattedNumber = amount.toLocaleString(curr.locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });

        return `${curr.symbol}${formattedNumber}`;
    }

    function pad(number) {
        return number.toString().padStart(2, '0');
    }
});
