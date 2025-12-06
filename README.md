# Methodology & Model Validation Tool

A comprehensive web-based tool for validating social impact methodology documents and Excel calculation models. This tool helps ensure methodology documents are thorough, evidence-based, and properly aligned with their corresponding Excel models.

## Features

### Methodology Document Analysis
- **Impact Pathway Validation**: Verifies that the impact pathway is clearly documented with visual diagrams
- **Research & Evidence Base**: Checks for adequate research from academic papers, official sources, and reputable institutions
- **Valuation Approach**: Validates that the valuation/monetisation approach is clear and well-defined
- **UK-Specific Data Identification**: Highlights UK-specific assumptions and data for extraction into expandable data tables

### Excel Model Analysis
- **Structure Validation**: Ensures the model contains essential tabs (Results, Assumptions, Data Inputs, Location-based data)
- **Results Tab**: Verifies a client-ready results/output tab exists
- **Data Inputs**: Checks for example data, mandatory vs optional field indicators, and initiative cost inclusion
- **Formula Review**: Provides guidance for spot-checking formulas and calculations

### Alignment Checks
- **Methodology-Model Consistency**: Validates that the Excel model matches the methodology's described approach
- **Terminology Alignment**: Cross-references key terms between documents
- **Data Input Validation**: Ensures data fields align with the valuation approach

### SROI Analysis
- **Automatic Detection**: Attempts to locate and extract SROI values from the Excel model
- **Threshold Validation**: Flags SROI values exceeding 1:12 for social pathways
- **Testing Recommendations**: Provides guidance for manual testing with different scenarios
- **Deflation Factor Review**: Suggests checking attribution, deadweight, and displacement factors

## How to Use

1. **Upload Files**
   - Upload your methodology document (.docx, .pdf, or .txt)
   - Upload your Excel model (.xlsx or .xls)

2. **Run Validation**
   - Click the "Validate Documents" button
   - Wait for analysis to complete (typically 5-15 seconds)

3. **Review Results**
   - Overall score shows validation percentage
   - Each section provides detailed checks with pass/warning/fail status
   - Yellow highlights indicate areas requiring review
   - Blue highlights mark UK-specific data for extraction

4. **Download Reports**
   - Download full validation report (text format)
   - Export highlights for offline review

## Validation Criteria

### Methodology Documents

**Must Have:**
- Clear impact pathway documentation
- Visual diagram or flowchart
- Evidence from research/academic sources
- Official statistics or reputable institution data
- Recent data (within last 3 years preferred)
- Clear valuation approach description
- Scope definition (what will/won't be valued)

**Best Practices:**
- Multiple evidence sources
- UK-specific data clearly identified
- Recent publication dates
- Peer-reviewed research

### Excel Models

**Required Tabs:**
- Results/Output (client-ready format)
- Assumptions/Value Factors
- Data Inputs (with example data)
- Location-based data tables

**Data Inputs Tab Must Include:**
- Example data for testing
- Initiative cost (for SROI calculation)
- Clear indication of mandatory vs optional fields

**SROI Guidelines:**
- Should be below 1:12 for social pathways
- Values above 1:12 trigger critical warnings
- Model should include appropriate deflation factors

## Review Workflow

### Offline Review Process

1. **Download Both Files**
   - Methodology document
   - Excel model

2. **Methodology Highlighting**
   - 🟨 **Yellow**: Questions, concerns, or items to double-check
   - 🟦 **Blue**: UK-specific averages/assumptions/value factors

3. **Excel Testing**
   - Change data inputs to reasonable client scenarios
   - Verify SROI recalculates correctly
   - Check formulas reference correct data sources
   - Confirm assumptions are included in calculations

4. **Leave Comments**
   - Add comments directly in files with questions
   - Flag concerns for discussion
   - Note any unclear sections

## Technical Details

### Supported File Formats
- **Methodology**: .docx, .pdf, .txt
- **Excel**: .xlsx, .xls

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Libraries Used
- [SheetJS (xlsx)](https://sheetjs.com/) - Excel file parsing
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) - Word document parsing

## Privacy & Security

- All file processing happens **locally in your browser**
- No files are uploaded to any server
- No data is stored or transmitted
- Complete privacy and security for sensitive documents

## Limitations

- PDF parsing may be limited compared to .docx format
- Complex Excel formulas may not be fully analyzed
- Manual review still required for in-depth validation
- SROI detection is heuristic-based and may not always find values

## Best Practices

1. **Use .docx format** for methodology documents when possible (better parsing)
2. **Consistent naming** helps the tool identify tabs (e.g., "Results", "Data Inputs")
3. **Run multiple test scenarios** in Excel after validation
4. **Review all warnings** even if they seem minor
5. **Cross-reference manually** to ensure full alignment

## Future Enhancements

Potential improvements for future versions:
- PDF OCR for better text extraction
- More sophisticated formula analysis
- Country-specific data expansion templates
- Automated double-counting detection
- Historical comparison with previous model versions

## Support

For issues, questions, or suggestions, please contact the development team or create an issue in the repository.

## License

Copyright © 2025. All rights reserved.
