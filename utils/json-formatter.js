const formatJson = function(response) {
    var finResponse = [];
    if (response != undefined && response.rows != undefined) {
      response.rows.forEach(function(row) {
        if (row.row_to_json != undefined) {
          finResponse.push(row.row_to_json);
        } else {
          finResponse.push(row);
        }
      });
    }
    return finResponse;
  };

  module.exports = formatJson;