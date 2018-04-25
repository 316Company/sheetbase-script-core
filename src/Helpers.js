var Helper = {

  /**
   * Check authorization status
   * @param {object} e - Event from doGet(), doPost()
   */
  isAuthorized: function (e) {
    var body = JSON.parse(e.postData ? e.postData.contents: '{}');
    var apiKey = body.apiKey || e.parameter.apiKey;  
    return Config.get('apiKey') === apiKey;
  },



  /**
   * Return unauthorization message
   */
  unauthorized: function () {
    return {
      error: true,
      code: 403,
      message: 'Unauthorized!'
    };
  },



  /**
   * Response JSON data
   * @param {object} object - JSON data
   */
  json: function (object) {
    var JSONString = JSON.stringify(object);
   var JSONOutput = ContentService.createTextOutput(JSONString);
   JSONOutput.setMimeType(ContentService.MimeType.JSON);
   return JSONOutput;
  },



  /**
   * Turn object into array
   * @param {object} object - JSON data
   */
  o2a: function (object) {
      var array = [];
      for (var key in object) {
          if (typeof object[key] === 'object') {
              object[key]['$key'] = key;
          } else {
              object[key] = {
                  $key: key,
                  value: object[key]
              };
          }
          array.push(object[key]);
      }
      return array;
  },
  


  /**
   * Generate unique UID
   */
  uid: function () {
      var max = 21;
      var ASCII_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
      var lastPushTime = 0;
      var lastRandChars = [];

      var now = new Date().getTime();
      var duplicateTime = (now === lastPushTime);
      lastPushTime = now;
      var timeStampChars = new Array(8);
      var i;
      for (i = 7; i >= 0; i--) {
        timeStampChars[i] = ASCII_CHARS.charAt(now % 64);
        now = Math.floor(now / 64);
      }
      var id = timeStampChars.join('');
      if (!duplicateTime) {
        for (i = 0; i < max; i++) {
          lastRandChars[i] = Math.floor(Math.random() * 64);
        }
      }else {
        for (i = max-1; i >= 0 && lastRandChars[i] === 63; i--) {
          lastRandChars[i] = 0;
        }
        lastRandChars[i]++;
      }
      for (i = 0; i < max; i++) {
        id += ASCII_CHARS.charAt(lastRandChars[i]);
      }
      return id.substr(1, 28);
  },
  


  /**
   * Typed modification cell data
   * @param {object} item - Data in JSON
   */
  modifyValue: function (item) {
    for (var key in item) {
        //transform JSON where possible
        try {
            item[key] = JSON.parse(item[key]);
        } catch (e) { }
  
        // transform number
        if (!isNaN(item[key]) && Number(item[key]) % 1 === 0) item[key] = parseInt(item[key]);
        if (!isNaN(item[key]) && Number(item[key]) % 1 !== 0) item[key] = parseFloat(item[key]);
  
        // transform boolean value
        if (typeof item[key] === 'string' || item[key] instanceof String) item[key] = ((item[key]).toLowerCase() === 'true') || ((item[key]).toLowerCase() === 'false' ? false : item[key]);
  
        // delete null key
        if (item[key] === '' || item[key] === null || item[key] === undefined) {
            delete item[key];
        }
    }  
    return item;
  }

}

