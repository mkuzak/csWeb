/**
* Offline Search Result contains the result of performing a scan of all the project layer files.
*/
var Layer = (function () {
    function Layer(groupTitle, index, id, title, path, type) {
        this.groupTitle = groupTitle;
        this.index = index;
        this.id = id;
        this.title = title;
        this.path = path;
        this.type = type;
        this.featureNames = [];
    }
    return Layer;
})();
exports.Layer = Layer;
var Entry = (function () {
    function Entry(layerIndexOrArray, featureIndex) {
        this.v = Array(2);
        if (typeof layerIndexOrArray === 'number') {
            this.v[0] = layerIndexOrArray;
            this.v[1] = featureIndex;
        }
        else {
            this.v = layerIndexOrArray;
        }
    }
    Object.defineProperty(Entry.prototype, "layerIndex", {
        get: function () { return this.v[0]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entry.prototype, "featureIndex", {
        get: function () { return this.v[1]; },
        enumerable: true,
        configurable: true
    });
    Entry.prototype.toJSON = function () {
        return this.v;
    };
    return Entry;
})();
exports.Entry = Entry;
var KeywordIndex = (function () {
    function KeywordIndex() {
    }
    return KeywordIndex;
})();
exports.KeywordIndex = KeywordIndex;
var OfflineSearchResult = (function () {
    function OfflineSearchResult(project, options) {
        this.project = project;
        this.options = options;
        this.layers = [];
        this.keywordIndex = {};
    }
    return OfflineSearchResult;
})();
exports.OfflineSearchResult = OfflineSearchResult;
