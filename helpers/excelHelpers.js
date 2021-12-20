let xls_json = require('node-excel-to-json');

class excelUtil {

  /***************************************************************************************/
  /*
   * method excel_getTableRow(fileName, sheetName, columnName, where, callback)
   * @param {fileName} - relative or absolute path of Excel file
   * @param {sheetName} - sheet anme of the Excel file from which data needs to be picked
   * @param {columnName} - name of the column in excel sheet
   * @param {where} - the column value against which the search to be done
   * @param {callback} callback method that contains command results (one excel row from the specified sheet name)
   * and gets called when the command finishes
   * Turn any xls or xlsx file or OpenDocument Spreadsheet (ODS) into a clean JSON file or Javascript Object.
   **/
  /****************************************************************************************/
  excel_getTableRow(fileName, sheetName, columnName, where, callback) {
    xls_json(fileName, {
      'convert_all_sheet': false,
      'return_type': 'Object',
      'sheetName': sheetName
    }, function (err, result) {
      if (err) {
        console.error(err);
      } else if (result) {
        for (var row = 0; row < result.length; ++row) {
          if (result[row].hasOwnProperty(columnName) && (result[row][columnName] == where)) {
            //console.log(result[row]);
            callback(result[row]);
          }
        }
      }
    });
  }

  /***************************************************************************************/
  /*
   * method excel_getTableRows(fileName, sheetName, callback)
   * @param {fileName} - relative or absolute path of Excel file
   * @param {sheetName} - sheet anme of the Excel file from which data needs to be picked
   * @param {callback} callback method that contains command results (all excel rows from the specified sheet name)
   * and gets called when the command finishes
   * Turn any xls or xlsx file or OpenDocument Spreadsheet (ODS) into a clean JSON file or Javascript Object.
   **/
  /****************************************************************************************/
  excel_getTableRows(fileName, sheetName, callback) {
    xls_json(fileName, {
      'convert_all_sheet': false,
      'return_type': 'Object',
      'sheetName': sheetName
    }, function (err, result) {
      if (err) {
        console.error(err);
      } else if (result) {
        return callback(result);
      }
    });
  }

  /***************************************************************************************/
  /*
   * method excel_getTableRows(fileName, sheetName, callback)
   * @param {fileName} - relative or absolute path of Excel file
   * @param {callback} callback method that contains command results (all sheet's rows from the specified sheet name)
   * and gets called when the command finishes
   * Turn any xls or xlsx file or OpenDocument Spreadsheet (ODS) into a clean JSON file or Javascript Object.
   **/
  /****************************************************************************************/
  excel_getAllSheetData(fileName, callback) {
    xls_json(fileName, {
      'convert_all_sheet': true,
      'return_type': 'Object',
    }, function (err, result) {
      if (err) {
        console.error(err);
      } else if (result) {
        //console.log(result);
        return callback(result);
      }
    });
  }


}
module.exports = new excelUtil();
