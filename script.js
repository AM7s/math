// Калькулятор
let calcDisplay = document.getElementById('calcDisplay');
let caclExpression = '';

//Обработка нажатий на кнопки калькулятора
document.querySelectorAll('.calc-btn').forEach(btn =>{
    btn.addEventListener('click', function(){
        const value=this.dataset.value;

        if(value === 'C'){
            caclExpression='';
            calcDisplay.value = '0';
            return;
        }

        if(value === '='){
            try{
                let expr = caclExpression.replace(/x/g, '*').replace(/÷/g, '/').replace(/-/g, '-');

                const result = Function('"use strict"; return ('+ expr + ')')();
                calcDisplay.value = result;
                caclExpression = String(result);
            }catch(e) {
                calcDisplay.value = "Ошибка";
                caclExpression = '';
            }
            return;
        }

        caclExpression += value;
        calcDisplay.value = caclExpression;
    });
});

//Вставка функций (sin, cos, sqrt и тд)
function insertValue(val){
    caclExpression += val;
    calcDisplay.value = caclExpression;
}

//Квадратное уравнение
function solveQuadratic(){
    const a = parseFloat(document.getElementById('eqA').value);
    const b = parseFloat(document.getElementById('eqB').value);
    const c = parseFloat(document.getElementById('eqC').value);
    const resultDiv = document.getElementById('eqResult');

    if(a === 0){
        resultDiv.innerHTML = 'a не может быть равно 0';
        return;
    }

    const D = b*b - 4*a*c;
    let result = `<strong>Дискриминант:</strong> D = ${b}² - 4·${a}·${c} = ${D}<br>`;

    if(D < 0){
         result += '<span class="highlight">Нет действительных корней</span> (D &lt; 0)';
    }else if(D === 0){
        result += `<span class="highlight">Один корень:</span> x = ${x.toFixed(3)}`;
    }else{
        const x1 = (-b + Math.sqrt(D)) / (2*a);
        const x2 = (-b + Math.sqrt(D)) / (2*a);
         result += `<span class="highlight">Два корня:</span><br>`;
        result += `x₁ = ${x1.toFixed(3)}<br>`;
        result += `x₂ = ${x2.toFixed(3)}`;
    }
    resultDiv.innerHTML = result;
}
//Система уравнений
function solveSystem() {
    const S = parseFloat(document.getElementById('sumS').value);
    const P = parseFloat(document.getElementById('prodP').value);
    const resultDiv = document.getElementById('systemResult'); // Убрал .value !!!

    // Проверка на корректность ввода
    if (isNaN(S) || isNaN(P)) {
        resultDiv.innerHTML = '❌ <span class="highlight">Введите числа!</span>';
        return;
    }

    const D = S * S - 4 * P;

    if (D < 0) {
        resultDiv.innerHTML = '❌ <span class="highlight">Нет действительных решений</span> (D &lt; 0)';
        return;
    }

    const x1 = (S + Math.sqrt(D)) / 2;
    const x2 = (S - Math.sqrt(D)) / 2;

    const y1 = S - x1;
    const y2 = S - x2;

    let result = `✅ Найдены решения:<br>`;
    result += `<span class="highlight">(x₁, y₁) = (${x1.toFixed(3)}, ${y1.toFixed(3)})</span><br>`;
    
    // Если корни разные, показываем вторую пару
    if (Math.abs(x1 - x2) > 0.0001) {
        result += `<span class="highlight">(x₂, y₂) = (${x2.toFixed(3)}, ${y2.toFixed(3)})</span>`;
    } else {
        result += `<span style="color: #a0a0c0;">(корни совпадают, это один корень)</span>`;
    }
    
    resultDiv.innerHTML = result;
}

//Проценты
function calcPercent() {
    const num = parseFloat(document.getElementById('percentNum').value);
    const pct = parseFloat(document.getElementById('percentPct').value);
    const resultDiv = document.getElementById('percentResult');
    
    const result = (num * pct) / 100;
    resultDiv.innerHTML = `
        <span class="highlight">${pct}% от ${num} = ${result.toFixed(2)}</span><br>
        <span style="font-size:0.9rem; color:#a0a0c0;">
            ${num} · ${pct} / 100 = ${result.toFixed(2)}
        </span>
    `;
}

// ===== УВЕЛИЧЕНИЕ/УМЕНЬШЕНИЕ НА % =====
function changePercent(type) {
    const num = parseFloat(document.getElementById('changeNum').value);
    const pct = parseFloat(document.getElementById('changePct').value);
    const resultDiv = document.getElementById('changeResult');
    
    let result;
    let sign;
    
    if (type === 'increase') {
        result = num * (1 + pct/100);
        sign = '+';
    } else {
        result = num * (1 - pct/100);
        sign = '−';
    }
    
    resultDiv.innerHTML = `
        <span class="highlight">${num} ${sign} ${pct}% = ${result.toFixed(2)}</span><br>
        <span style="font-size:0.9rem; color:#a0a0c0;">
            ${num} · (1 ${sign} ${pct/100}) = ${result.toFixed(2)}
        </span>
    `;
}
// ===== ЛОГАРИФМЫ =====

// Вспомогательная функция для проверки ОДЗ
function checkLogDomain(base, argument) {
    if (base <= 0 || base === 1) {
        return { valid: false, message: 'Основание должно быть > 0 и ≠ 1' };
    }
    if (argument <= 0) {
        return { valid: false, message: 'Аргумент должен быть > 0' };
    }
    return { valid: true };
}

// Тип 1: log_a(x) = b
function solveLogSimple() {
    const a = parseFloat(document.getElementById('logBase1').value);
    const b = parseFloat(document.getElementById('logB1').value);
    const resultDiv = document.getElementById('logSimpleResult');
    
    // Проверка ОДЗ
    const domainCheck = checkLogDomain(a, 1); // x > 0 проверим позже
    if (!domainCheck.valid) {
        resultDiv.innerHTML = `❌ <span class="highlight">${domainCheck.message}</span>`;
        return;
    }
    
    if (isNaN(a) || isNaN(b) || a <= 0 || a === 1) {
        resultDiv.innerHTML = '❌ <span class="highlight">Введите корректные данные! a > 0, a ≠ 1</span>';
        return;
    }
    
    // Решение: x = a^b
    const x = Math.pow(a, b);
    
    // Проверяем ОДЗ для x
    if (x <= 0) {
        resultDiv.innerHTML = '❌ <span class="highlight">Нет решений: x должен быть > 0</span>';
        return;
    }
    
    let result = '';
    result += `<div class="odz">📋 ОДЗ: x > 0</div>`;
    result += `<div class="step">Шаг 1: log<sub>${a}</sub>(x) = ${b}</div>`;
    result += `<div class="step">Шаг 2: x = ${a}<sup>${b}</sup></div>`;
    result += `<div class="step">Шаг 3: x = ${x.toFixed(4)}</div>`;
    result += `<div style="margin-top:10px;">✅ <span class="highlight">x = ${x.toFixed(4)}</span></div>`;
    
    // Проверка
    const check = Math.log(x) / Math.log(a);
    result += `<div style="font-size:0.85rem; color:#a0a0c0; margin-top:5px;">
        Проверка: log<sub>${a}</sub>(${x.toFixed(2)}) = ${check.toFixed(4)} ≈ ${b}
    </div>`;
    
    resultDiv.innerHTML = result;
}

// Тип 2: log_a(f(x)) = log_a(g(x))
function solveLogEqual() {
    const a = parseFloat(document.getElementById('logBase2').value);
    const fStr = document.getElementById('logF').value;
    const gStr = document.getElementById('logG').value;
    const resultDiv = document.getElementById('logEqualResult');
    
    // Проверка основания
    if (isNaN(a) || a <= 0 || a === 1) {
        resultDiv.innerHTML = '❌ <span class="highlight">Основание должно быть > 0 и ≠ 1</span>';
        return;
    }
    
    try {
        // Создаём функции для вычисления f(x) и g(x)
        const f = new Function('x', `"use strict"; return (${fStr})`);
        const g = new Function('x', `"use strict"; return (${gStr})`);
        
        // Решаем уравнение f(x) = g(x) численно (для простоты используем подстановку)
        // Находим корни через перебор
        let solutions = [];
        let steps = [];
        
        // Пробуем найти целые корни от -10 до 10
        for (let x = -10; x <= 10; x += 0.5) {
            try {
                const fx = f(x);
                const gx = g(x);
                if (Math.abs(fx - gx) < 0.001) {
                    // Проверяем ОДЗ: f(x) > 0 и g(x) > 0
                    if (fx > 0 && gx > 0) {
                        // Проверяем, не дублируем ли корень
                        let isDuplicate = false;
                        for (let sol of solutions) {
                            if (Math.abs(sol - x) < 0.01) {
                                isDuplicate = true;
                                break;
                            }
                        }
                        if (!isDuplicate) {
                            solutions.push(x);
                            steps.push(`f(${x.toFixed(1)}) = ${fx.toFixed(2)}, g(${x.toFixed(1)}) = ${gx.toFixed(2)}`);
                        }
                    }
                }
            } catch (e) {
                // Пропускаем ошибки вычислений
            }
        }
        
        // Формируем результат
        let result = '';
        result += `<div class="odz">📋 ОДЗ: f(x) > 0 и g(x) > 0</div>`;
        result += `<div class="step">Шаг 1: log<sub>${a}</sub>(${fStr}) = log<sub>${a}</sub>(${gStr})</div>`;
        result += `<div class="step">Шаг 2: ${fStr} = ${gStr}</div>`;
        
        if (solutions.length === 0) {
            result += `❌ <span class="highlight">Нет решений в диапазоне [-10, 10]</span>`;
            result += `<div style="font-size:0.85rem; color:#a0a0c0; margin-top:5px;">
                Попробуйте другие функции или проверьте ОДЗ
            </div>`;
        } else {
            result += `<div class="step">Шаг 3: Найдены корни:</div>`;
            solutions.forEach((x, i) => {
                const fx = f(x);
                const gx = g(x);
                result += `<div class="step">  x${i+1} = ${x.toFixed(2)} (f(x) = ${fx.toFixed(2)}, g(x) = ${gx.toFixed(2)})</div>`;
            });
            
            result += `<div style="margin-top:10px;">✅ <span class="highlight">Корни уравнения: ${solutions.map(x => x.toFixed(2)).join(', ')}</span></div>`;
            
            // Проверка
            result += `<div style="font-size:0.85rem; color:#a0a0c0; margin-top:5px;">
                Проверка: все корни удовлетворяют ОДЗ (f(x) > 0, g(x) > 0)
            </div>`;
        }
        
        resultDiv.innerHTML = result;
        
    } catch (e) {
        resultDiv.innerHTML = `❌ <span class="highlight">Ошибка в выражении: ${e.message}</span>`;
    }
}

// Вычисление логарифма: log_a(b)
function calculateLog() {
    const a = parseFloat(document.getElementById('logCalcBase').value);
    const b = parseFloat(document.getElementById('logCalcNum').value);
    const resultDiv = document.getElementById('logCalcResult');
    
    // Проверка ОДЗ
    const domainCheck = checkLogDomain(a, b);
    if (!domainCheck.valid) {
        resultDiv.innerHTML = `❌ <span class="highlight">${domainCheck.message}</span>`;
        return;
    }
    
    if (isNaN(a) || isNaN(b) || a <= 0 || a === 1 || b <= 0) {
        resultDiv.innerHTML = '❌ <span class="highlight">Введите корректные данные! a > 0, a ≠ 1, b > 0</span>';
        return;
    }
    
    const result = Math.log(b) / Math.log(a);
    
    let html = '';
    html += `<div class="odz">📋 ОДЗ: a > 0, a ≠ 1, b > 0</div>`;
    html += `<div class="step">log<sub>${a}</sub>(${b}) = ln(${b}) / ln(${a})</div>`;
    html += `<div class="step">= ${Math.log(b).toFixed(4)} / ${Math.log(a).toFixed(4)}</div>`;
    html += `<div style="margin-top:10px;">✅ <span class="highlight">log<sub>${a}</sub>(${b}) = ${result.toFixed(6)}</span></div>`;
    
    // Дополнительная информация
    if (Number.isInteger(result) && result > 0) {
        html += `<div style="font-size:0.85rem; color:#69db7c; margin-top:5px;">
            🎯 ${a}<sup>${result}</sup> = ${b} ✓
        </div>`;
    }
    
    resultDiv.innerHTML = html;
}

// ===== ДОПОЛНИТЕЛЬНАЯ ФУНКЦИЯ: Натуральный логарифм =====
function calculateLn() {
    const x = parseFloat(prompt('Введите число для ln(x):'));
    if (isNaN(x) || x <= 0) {
        alert('Введите положительное число!');
        return;
    }
    const result = Math.log(x);
    alert(`ln(${x}) = ${result.toFixed(6)}`);
}

// ===== ДОПОЛНИТЕЛЬНАЯ ФУНКЦИЯ: Десятичный логарифм =====
function calculateLog10() {
    const x = parseFloat(prompt('Введите число для log₁₀(x):'));
    if (isNaN(x) || x <= 0) {
        alert('Введите положительное число!');
        return;
    }
    const result = Math.log10(x);
    alert(`log₁₀(${x}) = ${result.toFixed(6)}`);
}

//Вкладки
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Убираем активность у всех кнопок
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Показываем нужную вкладку
        const tabId = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});
