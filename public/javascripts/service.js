app.service('questService',['$http', function ($http) {
    var _this = this;
    this.currentQuest = null;

    this.getQuest = function(name){
        return $http.get('quest/getQuest',{params:{name:name}}).then(function(response){
            _this.currentQuest = response.data;
            return response.data;
        });
    };

    this.recoverQuiz = function (){
        return $http.get('quest/recover').then(function(response){
            return response.data;
        });
    }

    this.restartQuiz = function (){
        return $http.get('quest/restartQuiz').then(function(response){
            return response.data;
        });
    }

    this.finalScore = function (){
        return $http.get('quest/finalScore').then(function(response){
            return response.data;
        });
    }


    this.startQuiz= function(name){
        return $http.get('quest/start', {'params':{name:name}}).then(function(response){
            return response.data;
        });
    }

    this.checkAnswer= function(obj){
        return $http.post('quest/checkAnswer', obj).then(function(response){
            return response.data;
        });
    }

		this.getQuestionById = function (id) {
			for(var i = 0,ii=_this.currentQuest.length;i<ii;i++){
				if(id === _this.currentQuest[i].id){
					return _this.currentQuest[i]
				}
			}
			return _this.currentQuest[0];
		};	   
}]);
  