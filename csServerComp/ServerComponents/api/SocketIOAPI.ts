import ApiManager = require('ApiManager');
import express = require('express')
import Layer = ApiManager.Layer;
import Feature = ApiManager.Feature;
import Log = ApiManager.Log;
import ClientConnection = require('./../dynamic/ClientConnection');
import MessageBus = require('../bus/MessageBus');
import BaseConnector = require('./BaseConnector');
import Winston = require('winston');

export class SocketIOAPI extends BaseConnector.BaseConnector {

    public manager: ApiManager.ApiManager

    constructor(public connection: ClientConnection.ConnectionManager) {
        super();
        this.isInterface = true;
    }

    public init(layerManager: ApiManager.ApiManager, options: any) {
        this.manager = layerManager;
        Winston.info('socketio: init SocketIO API');
    }

    public initLayer(layer: Layer) {
        Winston.info('socketio: init layer ' + layer.id);
        this.connection.registerLayer(layer.id, (action: string, msg: ClientConnection.LayerMessage, client: string) => {
            Winston.debug('socketio: action:' + action);
            switch (action) {
                case "logUpdate":
                    // find feature
                    var featureId = msg.object.featureId;
                    var logs: { [key: string]: Log[] } = msg.object["logs"];
                    this.manager.updateLogs(layer.id, featureId, logs, () => { });
                    Winston.info(JSON.stringify(msg));

                    //this.manager.updateLogs(layer.id,featureId,)
                    //this.updateLog(layer, featureId, msg.object, client, true);
                    break;
                case "featureUpdate":
                    var ft: Feature = msg.object;
                    this.manager.updateFeature(layer.id, ft, (r) => { });
                    break;
            }
        });
    }

    public addFeature(layerId: string, feature: Feature, callback: Function) {
        this.connection.updateFeature(layerId, feature, "feature-update");
    }

    public updateFeature(layerId: string, feature: Feature, useLog: boolean, callback: Function) {
        Winston.info('socketio: update feature');
        this.connection.updateFeature(layerId, feature, "feature-update");
    }

    public updateLogs(layerId: string, featureId: string, logs: { [key: string]: Log[] }, callback: Function) {
        var body = { action: "logUpdate", layerId: layerId, featureId: featureId, logs: logs };
        this.connection.updateFeature(layerId, body, "logs-update");
    }





}