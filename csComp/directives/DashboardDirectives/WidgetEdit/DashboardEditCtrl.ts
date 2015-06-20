module DashboardEdit {
    import IFeature = csComp.Services.IFeature;
    import IFeatureType = csComp.Services.IFeatureType;
    import IPropertyType = csComp.Services.IPropertyType;
    import IPropertyTypeData = csComp.Services.IPropertyTypeData;


    export interface IDashboardEditScope extends ng.IScope {
        vm: DashboardEditCtrl;

    }

    export class DashboardEditCtrl {
        private scope: IDashboardEditScope;

        public dashboard: csComp.Services.Dashboard;
        public hasParent: boolean;
        public parent: string;

        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'mapService',
            'layerService',
            'messageBusService',
            'dashboardService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: IDashboardEditScope,
            private $mapService: csComp.Services.MapService,
            private $layerService: csComp.Services.LayerService,
            private $messageBusService: csComp.Services.MessageBusService,
            private $dashboardService: csComp.Services.DashboardService
            ) {
            this.scope = $scope;
            $scope.vm = this;
            this.dashboard = $scope.$parent["data"];
            if (this.dashboard.parents && this.dashboard.parents.length > 0) this.parent = this.dashboard.parents[0];
            this.updateHasParent();
        }

        public updateHasParent() {
            return;
            if (this.parent !== "") this.dashboard.parents = [this.parent];
            this.hasParent = this.dashboard.parents && this.dashboard.parents.length > 0;
        }

        public toggleTimeline() {
            //this.$dashboardService.mainDashboard.showTimeline = !this.$dashboardService.mainDashboard.showTimeline;
            this.checkTimeline();
            this.$layerService.project.dashboards
        }

        public setExtent() {
            this.dashboard.viewBounds = this.$layerService.activeMapRenderer.getExtent();
            //console.log('test');
        }


        public toggleMap() {
            setTimeout(() => {
                this.checkMap();
            }, 100);

        }

        public checkMap() {
            var db = this.$layerService.project.activeDashboard;
            if (db.showMap != this.$layerService.visual.mapVisible) {
                if (db.showMap) {
                    this.$layerService.visual.mapVisible = true;
                } else {
                    this.$layerService.visual.mapVisible = false;
                }
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
            }

            if (db.showMap && this.dashboard.baselayer) {
                this.$messageBusService.publish("map", "setbaselayer", this.dashboard.baselayer);
            }
        }

        public checkTimeline() {
            var db = this.$layerService.project.activeDashboard;

            if (db.timeline) {

                var s = new Date(db.timeline.start);
                var e = new Date();
                if (db.timeline.end) e = new Date(db.timeline.end);
                //this.$messageBusService.publish("timeline", "updateTimerange", { "start": s, "end": e});
                this.$messageBusService.publish("timeline", "updateTimerange", { start: s, end: e });


                //this.$layerService.project.timeLine.setFocus(db.timeline.focusDate, db.timeline.startDate, db.timeline.endDate);
            }

            if (db.showTimeline != this.$mapService.timelineVisible) {
                if (db.showTimeline) {
                    this.$mapService.timelineVisible = true;
                } else {
                    this.$mapService.timelineVisible = false;
                }

                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
            }
        }


    }
}
