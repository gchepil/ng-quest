var utils = function(){
    this.isArraysEqual = function(arr1, arr2) {
        if(!arr1 || !arr2)
            return false;
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }

        return true;
    }

    this.getPartialAnswerPoints = function getPartialAnswerPoints(ans,cor){
        var i = cor.length,c =ans.length,  matches=0;
        for (var j=0; j<i;j++){
            for (var k=0; k<c;k++){
                if(ans[k] === cor[j]){
                    matches+=1;
                }
            }
        }
        switch (cor.length){
            case 3:
                return matches*2;
                break;
            case 2:
                return matches*3;
                break;
            case 1:
                if (c<3){
                    return matches;
                }
        }
        return 0;
    };
	
	this.shuffle = function (array) {
		var counter = array.length, temp, index;
		while (counter > 0) {
			index = Math.floor(Math.random() * counter);
			counter--;
			temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	}

    return this;
}();

module.exports = utils;

