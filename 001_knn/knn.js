var distance = require('euclidean-distance');


//Start off with what passes the first test.
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}


KNN.prototype.train = function (point){
	this.points = this.points.concat(point);
};

KNN.prototype._distance = function(v1, v2) {
	return distance(v1, v2);
};

KNN.prototype._distances = function(v1, trainArray) {
	return trainArray.map(
		function(elm){
		return [distance(v1, elm[0]), elm[1]];
	});
};

KNN.prototype._sorted = function(arr) {
	return arr.sort(function(a, b){
		return a[0] - b[0];
	}).map(function(a){
		return a[1];});
};

KNN.prototype._majority = function(limit, arr){
	var myArr = arr.slice(0, limit);

    return myArr.sort((a,b) =>
          myArr.filter(v => v===a).length
        - myArr.filter(v => v===b).length
    ).pop();

};

KNN.prototype.predictSingle = function(vect){
	var distArr = this._distances(vect, this.points);
	var sortedArr = this._sorted(distArr);
	return this._majority(this.kSize, sortedArr);
};

KNN.prototype.predict = function(vectArr){
 var self = this;
	return vectArr.map(function(elm){
		return self.predictSingle(elm);
	});
};

KNN.prototype.score = function(data){

	var origClassifications = data.map(function(elm){
		return elm[1];
	});
	var predicedClassifications = this.predict(data.map(function(elm){
		return elm[0];
	}));

	//compare arrays of classifications and return the avarage score
	var count = 0;
	for (var i = 0; i < origClassifications.length; i++) {
		if (origClassifications[i] === predicedClassifications[i])
			count++;
	}

	return count/origClassifications.length;
};

module.exports = KNN;