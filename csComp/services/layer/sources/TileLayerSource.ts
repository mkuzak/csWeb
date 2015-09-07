module csComp.Services {
    'use strict';

    declare var L;

    export class TileLayerSource implements ILayerSource {
        title = "tilelayer";
        //service : LayerService;
        requiresLayer = false;
        constructor(public service: LayerService) {

        }

        public refreshLayer(layer: ProjectLayer) {
            console.log('refreshing');
            if (layer.mapLayer.getLayers().length > 0) {
                var l = <L.TileLayer>layer.mapLayer.getLayers()[0];

                var u = layer.url;
                if (layer.refreshTime) {
                    // convert epoch to time string parameter
                    var ft = this.service.project.timeLine.focus;
                    if (layer.timeResolution) {
                        var tr = layer.timeResolution;
                        ft = Math.floor(ft / tr) * tr;
                        console.log(ft.toString())
                    };
                    var d = new Date(0);
                    d.setUTCSeconds(ft / 1000);
                    d.setFullYear(2011); // so the current year becomes 2011. For easier testing.
                    // this is for the Env4U project
                    var sDate: string = d.yyyymmdd();
                    var hrs = d.getHours();
                    var mins = d.getMinutes();
                    var secs = d.getSeconds();
                    var sTime: string = Utils.twoDigitStr(hrs) +
                        Utils.twoDigitStr(mins) + Utils.twoDigitStr(secs);
                    u += "&time=" + sDate + sTime;
                    //console.log(u);
                } else if (layer.disableCache) {
                    // check if we need to create a unique url to force a refresh
                    layer.cacheKey = new Date().getTime().toString();
                    u += "&cache=" + layer.cacheKey;
                }
                l.setUrl(u);

                //l.redraw();
            }


            //console.log(
            // this.service.removeLayer(layer);
            // this.service.addLayer(layer);
        }

        public layerMenuOptions(layer: ProjectLayer): [[string, Function]] {
            return [
                ['Refresh', (($itemScope) => this.refreshLayer(layer))]
            ];
        }

        public addLayer(layer: ProjectLayer, callback: Function) {
            layer.renderType = "tilelayer";
            callback(layer);
            //this.$rootScope.$apply();
        }

        removeLayer(layer: ProjectLayer) {

        }

    }

}
