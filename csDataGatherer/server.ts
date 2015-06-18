import express                   = require('express');
import http                      = require('http');
import path                      = require('path');
import ITransform                = require('./ServerComponents/import/ITransform');
import Store                     = require('./ServerComponents/import/Store');
import ImporterRepositoryService = require('./ServerComponents/import/ImporterRepositoryService');
import ProjectRepositoryService  = require('./ServerComponents/creator/ProjectRepositoryService');
import ConfigurationService      = require('./ServerComponents/configuration/ConfigurationService');
import ApiServiceManager         = require('./ServerComponents/api/ApiServiceManager');

import BaseTransformer           = require('./ServerComponents/import/BaseTransformer');
import CsvToJsonTransformer      = require('./ServerComponents/import/CsvToJsonTransformer');
import SplitAdresTransformer      = require('./ServerComponents/import/SplitAdresTransformer');
import BagDetailsTransformer      = require('./ServerComponents/import/BagDetailsTransformer');
import GeoJsonAggregateTransformer = require('./ServerComponents/import/GeoJsonAggregateTransformer');
import GeoJsonOutputTransformer = require('./ServerComponents/import/GeoJsonOutputTransformer');
import FieldFilterTransformer = require('./ServerComponents/import/FieldFilterTransformer');
import GeoJsonSplitTransformer = require('./ServerComponents/import/GeoJsonSplitTransformer');

var favicon = require('serve-favicon');
var bodyParser = require('body-parser')

var config = new ConfigurationService('./configuration.json');

var server     = express();
//var httpServer = require('http').Server(server);

// all environments
var port = "3456";
server.set('port', port);
// server.set('views', path.join(__dirname, 'views'));
// server.set('view engine', 'jade');
server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(bodyParser.json()); // support json encoded bodies
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//server.use(express.methodOverride());
//server.use(server.router);

server.use(express.static(path.join(__dirname, 'public')));

// Create the API service manager and add the services that you need
var apiServiceMgr = new ApiServiceManager(server, config);
var repoService = new ImporterRepositoryService(new Store.FileStore({ storageFile: "importers.json" }));
apiServiceMgr.addService(repoService);


var transformers = [
  new CsvToJsonTransformer("Convert to JSON"),
  new SplitAdresTransformer("Split adres"),
  new BagDetailsTransformer("Lookup BAG details"),
  new GeoJsonAggregateTransformer("GeoJSON aggregate"),
  new FieldFilterTransformer("Filter gemeente Utrecht"),
  new GeoJsonOutputTransformer("GeoJSON output"),
  new GeoJsonSplitTransformer("GeoJSON split")
]

console.log(transformers.length);
transformers.forEach( (t:any)=>{
  t.initialize((error)=>{
    if (error) {
      throw new Error(error);
    }
  });
  repoService.addTransformer(t);
});


/*
repoService.addTransformer(new CsvToJsonTransformer("Convert to JSON"));
//repoService.addTransformer(new BaseTransformer("Lookup BAG details"));
repoService.addTransformer(new SplitAdresTransformer("Split adres"));
repoService.addTransformer(new BagDetailsTransformer("Lookup BAG details"));
*/

// Resource types
var resourceTypeStore = new ProjectRepositoryService(new Store.FileStore({ storageFile: "resourceTypes.json" }))
apiServiceMgr.addService(resourceTypeStore);

// Resource types
var resourceTypeStore = new ProjectRepositoryService(new Store.FileStore({ storageFile: "resourceTypes.json" }))
apiServiceMgr.addService(resourceTypeStore);

// development only
// if ('development' == server.get('env')) {
//     server.use(express.errorHandler());
// }

server.listen(server.get('port'),() => {
    console.log('Express server listening on port ' + server.get('port'));
});
