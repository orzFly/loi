require('source-map-support').install({
  retrieveSourceMap: (source) => {
    if (source.indexOf("/node_modules/") > 0) {
      return {
        url: null,
        map: JSON.stringify({
          "version": 3,
          "sources": [],
          "names": [],
          "mappings": "",
          "file": "",
          "sourceRoot": ""
        })
      };
    }
    return null;
  }
});
