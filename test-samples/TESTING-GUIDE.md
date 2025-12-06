# Testing Guide for Methodology & Model Validation Tool

## Quick Start Testing

### Step 1: Open the Tool

1. Open your file browser and navigate to the repository folder
2. Double-click on `index.html` to open it in your default web browser
3. Or right-click on `index.html` → "Open with" → Choose your browser (Chrome recommended)

### Step 2: Test with Sample Methodology

1. Click on the **Methodology Document** upload button
2. Select the file: `test-samples/sample-methodology.txt`
3. You should see the file name and size displayed

### Step 3: Create a Simple Test Excel File

Since we need a real Excel file for testing, you have two options:

**Option A: Use an existing Excel file**
- Use any `.xlsx` file you have available
- The tool will analyze its structure (sheet names, data)

**Option B: Create a quick test Excel file**
1. Open Excel or Google Sheets
2. Create sheets named:
   - "Results"
   - "Assumptions"
   - "Data Inputs"
   - "Location Data"
3. In the Results sheet, add a cell with "SROI" and next to it put "1:5.5"
4. Save as `test-model.xlsx`
5. Upload this file to the tool

### Step 4: Run Validation

1. Once both files are uploaded, the **Validate Documents** button will become active
2. Click the button
3. Wait 5-15 seconds for analysis

### Step 5: Review Results

The tool will display:

**Expected Results for Sample Methodology:**
- ✅ Impact Pathway Documentation: PASS (mentions impact pathway, diagram)
- ✅ Research and Evidence Base: PASS (academic, official sources, 2024 dates)
- ✅ Valuation Approach: PASS (clear monetisation, scope defined)
- ℹ️ UK-Specific Data: INFO (highlights ONS, NHS, UK data)

**Expected Results for Excel Model:**
- Results depend on your Excel file structure
- Should identify which tabs are present
- Should provide recommendations for missing tabs

**SROI Analysis:**
- If SROI is detected in your Excel file and it's reasonable (below 1:12), it will PASS
- If SROI > 1:12, you'll see a CRITICAL WARNING

### Step 6: Test Download Features

1. Click **Download Full Report** - should download a .txt file with complete analysis
2. Click **Export Highlights** - should download highlighting guidance

## What to Look For

### Good Indicators:
- Overall score shows a percentage
- Color-coded results (green = pass, yellow = warning, red = fail)
- Detailed explanations for each check
- Specific recommendations in the recommendations section

### Test Different Scenarios:

1. **Test with only methodology**: Upload only the methodology file (Excel validation should show fails)
2. **Test with different file formats**: Try .txt, .docx (if you have mammoth.js loaded)
3. **Test with incomplete methodology**: Create a simple .txt file with minimal content and see warnings
4. **Test Excel structure**: Try Excel files with different sheet names

## Common Issues & Solutions

### Issue: "Validate Documents" button stays disabled
- **Solution**: Make sure BOTH files are uploaded (methodology AND Excel)

### Issue: No results showing
- **Solution**: Check browser console (F12) for JavaScript errors

### Issue: File won't upload
- **Solution**: Check file format is supported (.txt, .docx, .pdf for methodology; .xlsx, .xls for Excel)

### Issue: DOCX files show empty content
- **Solution**: This requires the mammoth.js library to be loaded from CDN. Check internet connection.

## Testing Checklist

- [ ] Tool opens in browser without errors
- [ ] Can upload methodology document
- [ ] Can upload Excel file
- [ ] Validate button becomes enabled
- [ ] Analysis runs and completes
- [ ] Results display with color coding
- [ ] Overall score calculates
- [ ] Can download full report
- [ ] Can export highlights
- [ ] Sample methodology shows good results
- [ ] Tool provides actionable recommendations

## Expected Behavior for Sample Files

**Sample Methodology (sample-methodology.txt):**
- Should PASS most checks
- Should identify UK-specific data
- Should find recent dates (2024)
- Should detect research sources
- Should find valuation approach
- Should suggest blue highlights for UK data

**Your Excel Model:**
- Results vary based on structure
- Tool checks for standard tab names
- Provides guidance on missing elements
- Flags if SROI is too high

## Next Steps After Testing

Once you confirm the tool works:
1. Test with real methodology documents and models
2. Verify validation criteria match your needs
3. Adjust thresholds or checks as needed (edit validator.js)
4. Deploy to GitHub Pages for team access
