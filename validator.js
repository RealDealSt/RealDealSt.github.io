// Methodology & Model Validation Tool
// Main application logic

class ValidationTool {
    constructor() {
        this.methodologyFile = null;
        this.excelFile = null;
        this.methodologyContent = '';
        this.excelData = null;
        this.validationResults = {
            methodology: [],
            excel: [],
            alignment: [],
            sroi: {},
            recommendations: []
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const methodologyInput = document.getElementById('methodologyFile');
        const excelInput = document.getElementById('excelFile');
        const validateBtn = document.getElementById('validateBtn');
        const downloadReportBtn = document.getElementById('downloadReport');
        const exportHighlightsBtn = document.getElementById('exportHighlights');

        methodologyInput.addEventListener('change', (e) => this.handleMethodologyUpload(e));
        excelInput.addEventListener('change', (e) => this.handleExcelUpload(e));
        validateBtn.addEventListener('click', () => this.validateDocuments());
        downloadReportBtn?.addEventListener('click', () => this.downloadReport());
        exportHighlightsBtn?.addEventListener('click', () => this.exportHighlights());
    }

    async handleMethodologyUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.methodologyFile = file;
        const info = document.getElementById('methodologyInfo');
        info.innerHTML = `<strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)`;

        // Parse document content
        await this.parseMethodologyDocument(file);
        this.checkValidationReady();
    }

    async handleExcelUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.excelFile = file;
        const info = document.getElementById('excelInfo');
        info.innerHTML = `<strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)`;

        // Parse Excel file
        await this.parseExcelFile(file);
        this.checkValidationReady();
    }

    async parseMethodologyDocument(file) {
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;

                if (file.name.endsWith('.docx')) {
                    try {
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        this.methodologyContent = result.value;
                    } catch (error) {
                        console.error('Error parsing DOCX:', error);
                        this.methodologyContent = '';
                    }
                } else if (file.name.endsWith('.txt')) {
                    this.methodologyContent = new TextDecoder().decode(arrayBuffer);
                } else {
                    // For PDF or other formats, we'll work with what we can
                    this.methodologyContent = new TextDecoder().decode(arrayBuffer);
                }

                resolve();
            };

            reader.readAsArrayBuffer(file);
        });
    }

    async parseExcelFile(file) {
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                this.excelData = {
                    workbook: workbook,
                    sheets: {},
                    sheetNames: workbook.SheetNames
                };

                // Parse all sheets
                workbook.SheetNames.forEach(sheetName => {
                    this.excelData.sheets[sheetName] = XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheetName],
                        { header: 1, defval: '' }
                    );
                });

                resolve();
            };

            reader.readAsArrayBuffer(file);
        });
    }

    checkValidationReady() {
        const validateBtn = document.getElementById('validateBtn');
        if (this.methodologyFile && this.excelFile) {
            validateBtn.disabled = false;
        }
    }

    async validateDocuments() {
        // Show loading indicator
        document.getElementById('loadingIndicator').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');

        // Reset results
        this.validationResults = {
            methodology: [],
            excel: [],
            alignment: [],
            sroi: {},
            recommendations: []
        };

        // Run all validations
        await this.validateMethodology();
        await this.validateExcelModel();
        await this.validateAlignment();
        await this.validateSROI();
        await this.generateRecommendations();

        // Display results
        this.displayResults();

        // Hide loading, show results
        document.getElementById('loadingIndicator').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
    }

    async validateMethodology() {
        const checks = [];
        const content = this.methodologyContent.toLowerCase();

        // Check 1: Impact pathway clarity
        const impactPathwayCheck = {
            title: 'Impact Pathway Documentation',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const impactKeywords = ['impact pathway', 'theory of change', 'impact chain', 'causal pathway'];
        const hasImpactPathway = impactKeywords.some(keyword => content.includes(keyword));

        if (hasImpactPathway) {
            impactPathwayCheck.details.push('✓ Impact pathway is documented');
        } else {
            impactPathwayCheck.status = 'warning';
            impactPathwayCheck.type = 'warning';
            impactPathwayCheck.details.push('⚠ Impact pathway not clearly identified. Look for terms like "impact pathway", "theory of change", or "causal chain"');
        }

        // Check for diagram reference
        if (content.includes('diagram') || content.includes('figure') || content.includes('chart')) {
            impactPathwayCheck.details.push('✓ Visual diagram referenced');
        } else {
            impactPathwayCheck.status = 'warning';
            impactPathwayCheck.type = 'warning';
            impactPathwayCheck.details.push('⚠ No diagram or visual representation mentioned');
        }

        checks.push(impactPathwayCheck);

        // Check 2: Research and evidence base
        const researchCheck = {
            title: 'Research and Evidence Base',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const researchIndicators = [
            { keywords: ['study', 'studies', 'research', 'paper'], label: 'Research studies' },
            { keywords: ['academic', 'journal', 'peer-reviewed'], label: 'Academic sources' },
            { keywords: ['government', 'official', 'ons', 'statistics'], label: 'Official sources' },
            { keywords: ['institution', 'university', 'institute'], label: 'Reputable institutions' }
        ];

        let evidenceCount = 0;
        researchIndicators.forEach(indicator => {
            if (indicator.keywords.some(keyword => content.includes(keyword))) {
                evidenceCount++;
                researchCheck.details.push(`✓ ${indicator.label} referenced`);
            }
        });

        if (evidenceCount < 2) {
            researchCheck.status = 'warning';
            researchCheck.type = 'warning';
            researchCheck.details.push('⚠ Limited evidence base detected. Ensure research from academic papers, official sources, or reputable institutions is included');
        }

        // Check for recent data
        const currentYear = new Date().getFullYear();
        const recentYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
        const hasRecentData = recentYears.some(year => content.includes(year.toString()));

        if (hasRecentData) {
            researchCheck.details.push('✓ Recent data referenced (within last 3 years)');
        } else {
            researchCheck.status = 'warning';
            researchCheck.type = 'warning';
            researchCheck.details.push('⚠ No recent dates found. Ensure data is as close to present date as possible');
        }

        checks.push(researchCheck);

        // Check 3: Valuation approach clarity
        const valuationCheck = {
            title: 'Valuation Approach',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const valuationKeywords = ['valuation', 'monetis', 'value factor', 'financial proxy', 'willingness to pay'];
        const hasValuation = valuationKeywords.some(keyword => content.includes(keyword));

        if (hasValuation) {
            valuationCheck.details.push('✓ Valuation approach described');
        } else {
            valuationCheck.status = 'fail';
            valuationCheck.type = 'fail';
            valuationCheck.details.push('✗ Valuation approach not clearly described');
        }

        // Check for what will/won't be valued
        if (content.includes('not valued') || content.includes('excluded') || content.includes('out of scope')) {
            valuationCheck.details.push('✓ Scope of valuation clearly defined (what will and won\'t be valued)');
        } else {
            valuationCheck.status = 'warning';
            valuationCheck.type = 'warning';
            valuationCheck.details.push('⚠ Should clearly state what will and won\'t be valued/monetised and why');
        }

        checks.push(valuationCheck);

        // Check 4: UK-specific data identification
        const ukDataCheck = {
            title: 'UK-Specific Data & Assumptions',
            status: 'info',
            details: [],
            type: 'info',
            highlights: []
        };

        const ukIndicators = ['uk', 'united kingdom', 'british', 'england', 'scotland', 'wales', 'northern ireland', 'ons', 'nhs'];
        const ukReferences = [];

        ukIndicators.forEach(indicator => {
            if (content.includes(indicator)) {
                ukReferences.push(indicator.toUpperCase());
            }
        });

        if (ukReferences.length > 0) {
            ukDataCheck.details.push(`ℹ UK-specific references found: ${[...new Set(ukReferences)].join(', ')}`);
            ukDataCheck.details.push('📝 <span class="highlight-blue">Highlight these UK-specific assumptions in blue</span> for data table extraction');
        } else {
            ukDataCheck.details.push('ℹ No UK-specific data identified. Verify if location-based data is needed');
        }

        checks.push(ukDataCheck);

        this.validationResults.methodology = checks;
    }

    async validateExcelModel() {
        const checks = [];

        if (!this.excelData) {
            checks.push({
                title: 'Excel File',
                status: 'fail',
                type: 'fail',
                details: ['✗ No Excel file loaded']
            });
            this.validationResults.excel = checks;
            return;
        }

        const sheetNames = this.excelData.sheetNames.map(s => s.toLowerCase());

        // Check 1: Results tab
        const resultsCheck = {
            title: 'Results Tab',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const hasResults = sheetNames.some(name =>
            name.includes('result') || name.includes('output') || name.includes('summary')
        );

        if (hasResults) {
            const resultsSheetName = this.excelData.sheetNames.find(name =>
                name.toLowerCase().includes('result') ||
                name.toLowerCase().includes('output') ||
                name.toLowerCase().includes('summary')
            );
            resultsCheck.details.push(`✓ Results tab found: "${resultsSheetName}"`);
            resultsCheck.details.push('✓ Results should be client-ready and clearly presented');
        } else {
            resultsCheck.status = 'fail';
            resultsCheck.type = 'fail';
            resultsCheck.details.push('✗ No dedicated results/output tab found');
        }

        checks.push(resultsCheck);

        // Check 2: Assumptions tab
        const assumptionsCheck = {
            title: 'Assumptions & Value Factors',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const hasAssumptions = sheetNames.some(name =>
            name.includes('assumption') || name.includes('value factor') || name.includes('parameters')
        );

        if (hasAssumptions) {
            const assumptionsSheetName = this.excelData.sheetNames.find(name =>
                name.toLowerCase().includes('assumption') ||
                name.toLowerCase().includes('value factor') ||
                name.toLowerCase().includes('parameters')
            );
            assumptionsCheck.details.push(`✓ Assumptions tab found: "${assumptionsSheetName}"`);
        } else {
            assumptionsCheck.status = 'warning';
            assumptionsCheck.type = 'warning';
            assumptionsCheck.details.push('⚠ No dedicated assumptions/value factors tab identified');
        }

        checks.push(assumptionsCheck);

        // Check 3: Data inputs tab
        const dataInputsCheck = {
            title: 'Data Inputs Tab',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const hasDataInputs = sheetNames.some(name =>
            name.includes('input') || name.includes('data') && !name.includes('output')
        );

        if (hasDataInputs) {
            const dataInputsSheetName = this.excelData.sheetNames.find(name =>
                (name.toLowerCase().includes('input') ||
                (name.toLowerCase().includes('data') && !name.toLowerCase().includes('output')))
            );
            dataInputsCheck.details.push(`✓ Data inputs tab found: "${dataInputsSheetName}"`);
            dataInputsCheck.details.push('📝 Check that mandatory vs optional fields are clearly indicated');
            dataInputsCheck.details.push('📝 Verify example data is included');
            dataInputsCheck.details.push('📝 Confirm initiative cost is included for SROI calculation');
        } else {
            dataInputsCheck.status = 'fail';
            dataInputsCheck.type = 'fail';
            dataInputsCheck.details.push('✗ No data inputs tab identified');
        }

        checks.push(dataInputsCheck);

        // Check 4: Location-based data tables
        const locationDataCheck = {
            title: 'Location-Based Data Tables',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const hasLocationData = sheetNames.some(name =>
            name.includes('location') || name.includes('country') || name.includes('region') ||
            name.includes('uk') || name.includes('data table')
        );

        if (hasLocationData) {
            const locationSheetName = this.excelData.sheetNames.find(name => {
                const lowerName = name.toLowerCase();
                return lowerName.includes('location') || lowerName.includes('country') ||
                       lowerName.includes('region') || lowerName.includes('uk') ||
                       lowerName.includes('data table');
            });
            locationDataCheck.details.push(`✓ Location-based data tab found: "${locationSheetName}"`);
        } else {
            locationDataCheck.status = 'warning';
            locationDataCheck.type = 'warning';
            locationDataCheck.details.push('⚠ No location-based data table identified');
            locationDataCheck.details.push('ℹ If using UK-specific data, ensure it\'s in an expandable format for other countries');
        }

        checks.push(locationDataCheck);

        // Check 5: Sheet structure summary
        const structureCheck = {
            title: 'Overall Model Structure',
            status: 'info',
            details: [],
            type: 'info'
        };

        structureCheck.details.push(`ℹ Total sheets in model: ${this.excelData.sheetNames.length}`);
        structureCheck.details.push(`ℹ Sheet names: ${this.excelData.sheetNames.join(', ')}`);

        checks.push(structureCheck);

        // Check 6: Formula analysis
        const formulaCheck = {
            title: 'Formula & Calculation Review',
            status: 'info',
            details: [],
            type: 'info'
        };

        formulaCheck.details.push('📝 Spot check results formulas to verify:');
        formulaCheck.details.push('  • Correct data sources are referenced');
        formulaCheck.details.push('  • Assumptions are properly included');
        formulaCheck.details.push('  • No circular references');
        formulaCheck.details.push('  • Calculations follow best practices');

        checks.push(formulaCheck);

        this.validationResults.excel = checks;
    }

    async validateAlignment() {
        const checks = [];

        // Check 1: Methodology-Model consistency
        const consistencyCheck = {
            title: 'Methodology-Model Consistency',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        const content = this.methodologyContent.toLowerCase();

        // Extract key terms from methodology
        const impactTerms = this.extractKeyTerms(content, ['outcome', 'impact', 'benefit', 'effect']);
        const valuationTerms = this.extractKeyTerms(content, ['value', 'cost', 'price', 'factor']);

        if (impactTerms.length > 0) {
            consistencyCheck.details.push(`✓ Impact terms identified in methodology: ${impactTerms.length} key concepts`);
        }

        // Check if Excel sheets reference similar concepts
        const sheetNames = this.excelData.sheetNames.join(' ').toLowerCase();
        let alignmentScore = 0;
        let totalChecks = 0;

        impactTerms.forEach(term => {
            totalChecks++;
            if (sheetNames.includes(term) || this.searchExcelContent(term)) {
                alignmentScore++;
            }
        });

        if (totalChecks > 0 && alignmentScore / totalChecks < 0.3) {
            consistencyCheck.status = 'warning';
            consistencyCheck.type = 'warning';
            consistencyCheck.details.push('⚠ Limited alignment detected between methodology terminology and Excel model');
            consistencyCheck.details.push('<span class="highlight-yellow">Review that data inputs match the valuation approach described in methodology</span>');
        } else {
            consistencyCheck.details.push('✓ Terminology alignment appears reasonable');
        }

        checks.push(consistencyCheck);

        // Check 2: Data inputs vs methodology approach
        const dataAlignmentCheck = {
            title: 'Data Inputs vs Valuation Approach',
            status: 'pass',
            details: [],
            type: 'pass'
        };

        dataAlignmentCheck.details.push('📝 Manual review required:');
        dataAlignmentCheck.details.push('  • Compare data input fields with methodology\'s described approach');
        dataAlignmentCheck.details.push('  • Verify all mentioned metrics are captured in the model');
        dataAlignmentCheck.details.push('  • Check that valuation factors match methodology description');
        dataAlignmentCheck.details.push('  • <span class="highlight-yellow">Highlight any discrepancies in yellow</span>');

        checks.push(dataAlignmentCheck);

        this.validationResults.alignment = checks;
    }

    async validateSROI() {
        const sroiData = {
            calculated: false,
            value: null,
            warnings: [],
            details: []
        };

        // Try to find SROI value in Excel
        const sroiValue = this.findSROIValue();

        if (sroiValue) {
            sroiData.calculated = true;
            sroiData.value = sroiValue;
            sroiData.details.push(`SROI Value Detected: <strong>1:${sroiValue.toFixed(2)}</strong>`);

            // Check if SROI is reasonable (should be below 1:12 for social pathways)
            if (sroiValue > 12) {
                sroiData.warnings.push({
                    level: 'critical',
                    message: `⚠️ CRITICAL: SROI of 1:${sroiValue.toFixed(2)} exceeds recommended maximum of 1:12 for social pathways`,
                    recommendations: [
                        'Review deflation factors (attribution, deadweight, displacement)',
                        'Check for potential double-counting of impacts',
                        'Verify value factors are reasonable and well-sourced',
                        'Ensure assumptions are conservative and evidence-based'
                    ]
                });
            } else if (sroiValue > 8) {
                sroiData.warnings.push({
                    level: 'warning',
                    message: `⚠ SROI of 1:${sroiValue.toFixed(2)} is high. Verify assumptions are reasonable`,
                    recommendations: [
                        'Double-check deflation factors',
                        'Verify no impacts are double-counted',
                        'Review value factors for reasonableness'
                    ]
                });
            } else {
                sroiData.details.push('✓ SROI value is within reasonable range for social pathways');
            }
        } else {
            sroiData.details.push('ℹ SROI value not automatically detected');
            sroiData.details.push('📝 Manual testing recommended:');
            sroiData.details.push('  • Input reasonable client data scenarios');
            sroiData.details.push('  • Verify SROI recalculates correctly');
            sroiData.details.push('  • Ensure SROI stays below 1:12 for social pathways');
        }

        // Testing recommendations
        sroiData.details.push('');
        sroiData.details.push('📊 Testing Checklist:');
        sroiData.details.push('  □ Test with different data input scenarios');
        sroiData.details.push('  □ Verify calculations update dynamically');
        sroiData.details.push('  □ Check edge cases (zero values, maximum values)');
        sroiData.details.push('  □ Confirm initiative cost is properly factored in');

        this.validationResults.sroi = sroiData;
    }

    async generateRecommendations() {
        const recommendations = [];

        // Aggregate all warnings and failures
        const allChecks = [
            ...this.validationResults.methodology,
            ...this.validationResults.excel,
            ...this.validationResults.alignment
        ];

        const criticalIssues = allChecks.filter(c => c.status === 'fail');
        const warnings = allChecks.filter(c => c.status === 'warning');

        if (criticalIssues.length > 0) {
            recommendations.push({
                level: 'critical',
                title: 'Critical Issues Requiring Attention',
                items: criticalIssues.map(issue => `${issue.title}: ${issue.details.join('; ')}`)
            });
        }

        if (warnings.length > 0) {
            recommendations.push({
                level: 'warning',
                title: 'Warnings & Suggested Improvements',
                items: warnings.map(warning => `${warning.title}: Review and verify`)
            });
        }

        // SROI warnings
        if (this.validationResults.sroi.warnings && this.validationResults.sroi.warnings.length > 0) {
            this.validationResults.sroi.warnings.forEach(warning => {
                recommendations.push({
                    level: warning.level,
                    title: 'SROI Validation',
                    items: [warning.message, ...warning.recommendations]
                });
            });
        }

        // General best practice recommendations
        recommendations.push({
            level: 'info',
            title: 'Review Checklist',
            items: [
                'Download both files for offline review',
                'Highlight methodology concerns in yellow for follow-up',
                'Highlight UK-specific data in blue for data table extraction',
                'Test Excel model with various input scenarios',
                'Verify all assumptions are evidence-based and recent',
                'Check that results are client-ready and clearly presented',
                'Leave comments in files with any questions or concerns'
            ]
        });

        this.validationResults.recommendations = recommendations;
    }

    displayResults() {
        // Overall score
        this.displayOverallScore();

        // Methodology results
        this.displayMethodologyResults();

        // Excel results
        this.displayExcelResults();

        // Alignment results
        this.displayAlignmentResults();

        // SROI results
        this.displaySROIResults();

        // Recommendations
        this.displayRecommendations();
    }

    displayOverallScore() {
        const allChecks = [
            ...this.validationResults.methodology,
            ...this.validationResults.excel,
            ...this.validationResults.alignment
        ];

        const totalChecks = allChecks.filter(c => c.type !== 'info').length;
        const passedChecks = allChecks.filter(c => c.status === 'pass').length;
        const failedChecks = allChecks.filter(c => c.status === 'fail').length;

        const scoreElement = document.getElementById('overallScore');
        const percentage = totalChecks > 0 ? (passedChecks / totalChecks * 100).toFixed(0) : 0;

        let scoreClass = 'score-excellent';
        let scoreLabel = 'Excellent';

        if (failedChecks > 0 || percentage < 60) {
            scoreClass = 'score-critical';
            scoreLabel = 'Needs Work';
        } else if (percentage < 80) {
            scoreClass = 'score-warning';
            scoreLabel = 'Good';
        } else if (percentage < 95) {
            scoreClass = 'score-good';
            scoreLabel = 'Very Good';
        }

        scoreElement.className = `overall-score ${scoreClass}`;
        scoreElement.innerHTML = `${scoreLabel}<br><small>${percentage}% Validated</small>`;
    }

    displayMethodologyResults() {
        const container = document.getElementById('methodologyResults');
        container.innerHTML = this.renderChecks(this.validationResults.methodology);
    }

    displayExcelResults() {
        const container = document.getElementById('excelResults');
        container.innerHTML = this.renderChecks(this.validationResults.excel);
    }

    displayAlignmentResults() {
        const container = document.getElementById('alignmentResults');
        container.innerHTML = this.renderChecks(this.validationResults.alignment);
    }

    displaySROIResults() {
        const container = document.getElementById('sroiResults');
        const sroiData = this.validationResults.sroi;

        let html = '';

        if (sroiData.calculated && sroiData.value) {
            html += `<div class="sroi-value">1:${sroiData.value.toFixed(2)}</div>`;
        }

        sroiData.details.forEach(detail => {
            html += `<p>${detail}</p>`;
        });

        if (sroiData.warnings && sroiData.warnings.length > 0) {
            sroiData.warnings.forEach(warning => {
                html += `<div class="sroi-warning">
                    <h4>${warning.message}</h4>
                    <ul>
                        ${warning.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>`;
            });
        }

        container.innerHTML = html;
    }

    displayRecommendations() {
        const container = document.getElementById('recommendations');

        let html = '';
        this.validationResults.recommendations.forEach(rec => {
            const statusClass = rec.level === 'critical' ? 'fail' :
                              rec.level === 'warning' ? 'warning' : 'info';

            html += `<div class="check-item ${statusClass}">
                <div class="check-header">
                    <span class="check-title">${rec.title}</span>
                    <span class="flag-badge flag-${rec.level}">${rec.level.toUpperCase()}</span>
                </div>
                <div class="check-details">
                    <ul>
                        ${rec.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        });

        container.innerHTML = html;
    }

    renderChecks(checks) {
        return checks.map(check => `
            <div class="check-item ${check.type}">
                <div class="check-header">
                    <span class="check-title">${check.title}</span>
                    <span class="check-status status-${check.status}">${check.status.toUpperCase()}</span>
                </div>
                <div class="check-details">
                    ${check.details.map(detail => `<p>${detail}</p>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // Utility functions
    extractKeyTerms(text, categories) {
        const terms = [];
        const sentences = text.split(/[.!?]+/);

        sentences.forEach(sentence => {
            categories.forEach(category => {
                if (sentence.includes(category)) {
                    const words = sentence.split(/\s+/).filter(w => w.length > 4);
                    terms.push(...words.slice(0, 3));
                }
            });
        });

        return [...new Set(terms)].slice(0, 10);
    }

    searchExcelContent(term) {
        if (!this.excelData) return false;

        for (let sheetName in this.excelData.sheets) {
            const sheet = this.excelData.sheets[sheetName];
            const sheetStr = JSON.stringify(sheet).toLowerCase();
            if (sheetStr.includes(term.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    findSROIValue() {
        if (!this.excelData) return null;

        // Search for SROI in all sheets
        for (let sheetName in this.excelData.sheets) {
            const sheet = this.excelData.sheets[sheetName];

            for (let i = 0; i < sheet.length; i++) {
                const row = sheet[i];
                for (let j = 0; j < row.length; j++) {
                    const cell = String(row[j]).toLowerCase();

                    // Look for SROI label
                    if (cell.includes('sroi') || cell.includes('social return')) {
                        // Check adjacent cells for value
                        const value = this.extractSROIFromRow(row, j);
                        if (value) return value;

                        // Check next row
                        if (i + 1 < sheet.length) {
                            const nextRowValue = this.extractSROIFromRow(sheet[i + 1], j);
                            if (nextRowValue) return nextRowValue;
                        }
                    }
                }
            }
        }

        return null;
    }

    extractSROIFromRow(row, startIndex) {
        for (let i = startIndex; i < Math.min(startIndex + 5, row.length); i++) {
            const cell = String(row[i]);

            // Look for patterns like "1:5.23" or "5.23" or "1:5"
            const matches = cell.match(/(?:1:)?(\d+\.?\d*)/);
            if (matches && matches[1]) {
                const value = parseFloat(matches[1]);
                if (value > 0 && value < 1000) {
                    return value;
                }
            }
        }
        return null;
    }

    downloadReport() {
        const report = this.generateTextReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `validation-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateTextReport() {
        let report = '='.repeat(80) + '\n';
        report += 'METHODOLOGY & MODEL VALIDATION REPORT\n';
        report += `Generated: ${new Date().toLocaleString()}\n`;
        report += '='.repeat(80) + '\n\n';

        report += 'FILES ANALYZED:\n';
        report += `- Methodology: ${this.methodologyFile.name}\n`;
        report += `- Excel Model: ${this.excelFile.name}\n\n`;

        report += '='.repeat(80) + '\n';
        report += 'METHODOLOGY ANALYSIS\n';
        report += '='.repeat(80) + '\n\n';
        this.validationResults.methodology.forEach(check => {
            report += `${check.title} [${check.status.toUpperCase()}]\n`;
            check.details.forEach(detail => {
                report += `  ${detail.replace(/<[^>]*>/g, '')}\n`;
            });
            report += '\n';
        });

        report += '='.repeat(80) + '\n';
        report += 'EXCEL MODEL ANALYSIS\n';
        report += '='.repeat(80) + '\n\n';
        this.validationResults.excel.forEach(check => {
            report += `${check.title} [${check.status.toUpperCase()}]\n`;
            check.details.forEach(detail => {
                report += `  ${detail.replace(/<[^>]*>/g, '')}\n`;
            });
            report += '\n';
        });

        report += '='.repeat(80) + '\n';
        report += 'ALIGNMENT ANALYSIS\n';
        report += '='.repeat(80) + '\n\n';
        this.validationResults.alignment.forEach(check => {
            report += `${check.title} [${check.status.toUpperCase()}]\n`;
            check.details.forEach(detail => {
                report += `  ${detail.replace(/<[^>]*>/g, '')}\n`;
            });
            report += '\n';
        });

        report += '='.repeat(80) + '\n';
        report += 'SROI ANALYSIS\n';
        report += '='.repeat(80) + '\n\n';
        const sroiData = this.validationResults.sroi;
        if (sroiData.calculated) {
            report += `SROI Value: 1:${sroiData.value.toFixed(2)}\n\n`;
        }
        sroiData.details.forEach(detail => {
            report += `${detail.replace(/<[^>]*>/g, '')}\n`;
        });
        report += '\n';

        if (sroiData.warnings && sroiData.warnings.length > 0) {
            report += '\nSROI WARNINGS:\n';
            sroiData.warnings.forEach(warning => {
                report += `\n${warning.message}\n`;
                warning.recommendations.forEach(rec => {
                    report += `  - ${rec}\n`;
                });
            });
        }

        report += '\n';
        report += '='.repeat(80) + '\n';
        report += 'RECOMMENDATIONS\n';
        report += '='.repeat(80) + '\n\n';
        this.validationResults.recommendations.forEach(rec => {
            report += `${rec.title} [${rec.level.toUpperCase()}]\n`;
            rec.items.forEach(item => {
                report += `  - ${item.replace(/<[^>]*>/g, '')}\n`;
            });
            report += '\n';
        });

        return report;
    }

    exportHighlights() {
        let highlights = 'METHODOLOGY REVIEW HIGHLIGHTS\n';
        highlights += '='.repeat(80) + '\n\n';
        highlights += 'YELLOW HIGHLIGHTS (Questions/Concerns):\n';
        highlights += '- Review data inputs alignment with methodology\n';
        highlights += '- Verify all mentioned impacts are captured\n\n';

        highlights += 'BLUE HIGHLIGHTS (UK-Specific Data):\n';
        highlights += '- Extract for expandable data tables\n';
        highlights += '- Prepare for multi-country support\n\n';

        const blob = new Blob([highlights], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `review-highlights-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ValidationTool();
});
