document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const loader = document.getElementById('btn-loader');
    
    const resultContainer = document.getElementById('result-container');
    const resultContent = document.getElementById('result-content');
    
    // Result UI elements
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const probValue = document.getElementById('prob-value');
    const riskValue = document.getElementById('risk-value');
    const actionRec = document.getElementById('action-rec');
    
    // Logs UI Element
    const scanLogs = document.getElementById('scan-logs');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Form Data
        const payload = {
            amount: parseFloat(document.getElementById('amount').value),
            location_code: parseInt(document.getElementById('location_code').value),
            device_code: parseInt(document.getElementById('device_code').value),
            hour_of_day: parseInt(document.getElementById('hour_of_day').value),
            failed_logins: parseInt(document.getElementById('failed_logins').value)
        };
        
        // Loading State
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        analyzeBtn.disabled = true;
        
        try {
            // POST request to local Flask server
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Server returned ${response.status}`);
            }
            
            const data = await response.json();
            
            // Present Result
            displayResult(data, payload.amount);
            
        } catch (error) {
            console.error('API Error:', error);
            alert(`Error: ${error.message}\nMake sure the Flask backend is running on port 5000 and the model is trained.`);
        } finally {
            // Revert Loading State
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });

    function displayResult(data, amount) {
        resultContainer.classList.add('hidden');
        resultContent.classList.remove('hidden');
        
        const { is_fraud, fraud_probability, risk_level } = data;
        
        // Reset classes
        riskValue.className = 'metric-value';
        statusText.style.color = '';
        
        // Format probability to percentage
        const probString = (fraud_probability * 100).toFixed(2) + '%';
        probValue.textContent = probString;
        riskValue.textContent = risk_level;
        
        let logStatusClass, logStatusText;

        // Apply rules based on prediction
        if (is_fraud) {
            statusIcon.textContent = '🚨';
            statusText.textContent = 'FRAUD DETECTED';
            statusText.style.color = 'var(--danger)';
            riskValue.classList.add('indicator-high');
            
            actionRec.style.borderLeftColor = 'var(--danger)';
            actionRec.innerHTML = `<p><strong>Action Required:</strong> Transaction flagged as fraudulent. Blocked immediately and account suspended for review.</p>`;
            
            logStatusClass = 'log-fraud';
            logStatusText = 'FRAUD';
        } else {
            if (risk_level === 'MEDIUM') {
                statusIcon.textContent = '⚠️';
                statusText.textContent = 'SUSPICIOUS';
                statusText.style.color = 'var(--warning)';
                riskValue.classList.add('indicator-medium');
                
                actionRec.style.borderLeftColor = 'var(--warning)';
                actionRec.innerHTML = `<p><strong>Recommendation:</strong> Transaction requires additional verification (MFA). Proceed with caution.</p>`;
                
                logStatusClass = 'log-warn';
                logStatusText = 'WARN';
            } else {
                statusIcon.textContent = '✅';
                statusText.textContent = 'SAFE';
                statusText.style.color = 'var(--success)';
                riskValue.classList.add('indicator-low');
                
                actionRec.style.borderLeftColor = 'var(--success)';
                actionRec.innerHTML = `<p><strong>Recommendation:</strong> Transaction appears normal. Process automatically.</p>`;
                
                logStatusClass = 'log-safe';
                logStatusText = 'SAFE';
            }
        }
        
        // Update Log history
        addLogEntry(amount, logStatusText, logStatusClass, probString);
    }
    
    function addLogEntry(amount, statusText, statusClass, prob) {
        const li = document.createElement('li');
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        li.innerHTML = `
            <span>
                <span style="color: var(--text-muted); margin-right: 0.5rem; font-size: 0.8rem">${timeStr}</span>
                <span class="log-amount">$${amount.toFixed(2)}</span>
            </span>
            <span>
                <span style="margin-right: 0.75rem; font-size: 0.8rem; color: var(--text-muted)">Prob: ${prob}</span>
                <span class="log-status ${statusClass}">${statusText}</span>
            </span>
        `;
        
        scanLogs.prepend(li);
        
        if (scanLogs.children.length > 10) {
            scanLogs.removeChild(scanLogs.lastChild);
        }
    }
});
