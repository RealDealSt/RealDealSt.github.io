# Quick Start Testing Guide

## Ready to Test! 🚀

All test files have been created. Here's how to test the validation tool in under 2 minutes:

### Test Files Created:
✅ `sample-methodology.txt` - Example methodology document
✅ `test-model.xlsx` - Sample Excel model with proper structure
✅ `TESTING-GUIDE.md` - Detailed testing documentation

---

## Quick Test (2 Minutes)

### Step 1: Open the Tool
1. Navigate to the repository folder in your file browser
2. **Double-click on `index.html`** to open it in your browser
   - Or right-click → "Open with" → Choose your browser (Chrome/Firefox/Edge)

### Step 2: Upload Test Files
1. Click **"📄 Methodology Document"** button
   - Select: `test-samples/sample-methodology.txt`
   - You should see: "sample-methodology.txt (4.35 KB)" or similar

2. Click **"📈 Excel Model"** button
   - Select: `test-samples/test-model.xlsx`
   - You should see: "test-model.xlsx (7.4 KB)" or similar

### Step 3: Run Validation
1. The **"🔍 Validate Documents"** button should now be enabled (purple/blue)
2. **Click it!**
3. Wait 5-10 seconds while the tool analyzes both files

### Step 4: Review Results
You should see results organized into sections:

#### Expected Results:

**📄 Methodology Analysis** - Should show mostly ✅ PASS:
- ✅ Impact Pathway Documentation
- ✅ Research and Evidence Base (finds 2024 dates, academic sources, ONS data)
- ✅ Valuation Approach
- ℹ️ UK-Specific Data & Assumptions (identifies UK data for highlighting)

**📈 Excel Model Analysis** - Should show ✅ PASS:
- ✅ Results Tab (found: "Results")
- ✅ Assumptions & Value Factors (found: "Assumptions")
- ✅ Data Inputs Tab (found: "Data Inputs")
- ✅ Location-Based Data Tables (found: "UK Location Data")

**🔗 Methodology-Model Alignment**:
- ✅ Terminology alignment appears reasonable
- 📝 Manual review recommendations

**💰 SROI Analysis**:
- SROI Value Detected: **1:5.50**
- ✅ SROI value is within reasonable range (below 1:12)

**💡 Recommendations & Flags**:
- Review checklist with best practices
- Highlighting guidance (yellow for questions, blue for UK data)

### Step 5: Test Export Features
1. Click **"📥 Download Full Report"**
   - Should download a text file with complete analysis

2. Click **"🖍️ Export Highlights"**
   - Should download highlighting guidance

---

## What Makes a Good Result?

✅ **Overall Score**: Should show "Very Good" or "Excellent" with 80%+ validated
✅ **Color Coding**: Green (pass), Yellow (warning), Red (fail)
✅ **Specific Findings**: Tool should identify specific elements like "ONS", "2024", etc.
✅ **SROI Detection**: Should find "1:5.5" in the Excel model
✅ **Actionable Recommendations**: Clear next steps provided

---

## Common Issues

**Issue**: Can't find the files
**Solution**: Make sure you're in the repository root directory, files are in `test-samples/` folder

**Issue**: Validate button stays grayed out
**Solution**: Make sure BOTH files are uploaded (methodology AND Excel)

**Issue**: Nothing happens when clicking validate
**Solution**:
- Check browser console (press F12) for errors
- Make sure you have internet connection (needed for loading Excel parsing libraries)
- Try refreshing the page

**Issue**: DOCX files don't work
**Solution**: The sample uses .txt which works reliably. DOCX requires internet for mammoth.js library

---

## Next Steps After Successful Test

1. ✅ **Verify** all sections display correctly
2. ✅ **Check** that validation criteria match your needs
3. ✅ **Test** with your own real methodology documents and Excel models
4. ✅ **Adjust** validation rules if needed (edit `validator.js`)
5. ✅ **Deploy** to GitHub Pages for team access
6. ✅ **Share** with colleagues for methodology reviews

---

## Pro Tips

💡 **Bookmark the tool**: Add `index.html` to browser bookmarks for quick access
💡 **Test multiple files**: Try different methodology documents to see various validation results
💡 **Check the code**: Open `validator.js` to see exactly what's being checked
💡 **Customize thresholds**: Edit SROI threshold (currently 1:12) or other criteria as needed

---

## File Structure Overview

```
RealDealSt.github.io/
├── index.html              ← OPEN THIS to start the tool
├── styles.css              ← Visual styling
├── validator.js            ← All validation logic
├── README.md               ← Full documentation
└── test-samples/
    ├── sample-methodology.txt    ← Test methodology
    ├── test-model.xlsx           ← Test Excel model
    ├── QUICK-START.md            ← This file
    ├── TESTING-GUIDE.md          ← Detailed guide
    └── create-test-excel.py      ← Script to recreate Excel file
```

---

## Ready? Let's Test!

**👉 Open `index.html` in your browser and upload the test files! 🎯**

If you encounter any issues, check the TESTING-GUIDE.md for detailed troubleshooting.
