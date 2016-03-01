app.controller('mainController',['$scope','questService','$location', function($scope,questService,$location) {
    $scope.unAsweredQuestions = [];
    $scope.answeredQuestions = [];
    $scope.score = 0;
    $scope.infoVisible = false;
    $scope.updateScore = function(number){
        $scope.score+=number;
    };
    $scope.setScore = function(number){
        $scope.score=number;
    };
    $scope.showInfo = function(bool){
        $scope.infoVisible = bool;
    };

    $scope.startQuiz= function(name){
        questService.getQuest(name).then(function(res){
            $scope.quest = res;
            res.map(function(q){
                $scope.unAsweredQuestions.push(q.id);
            });
            $scope.infoVisible = true;
            $location.path('/questions/'+ $scope.unAsweredQuestions[0]);
        });
    };
    $scope.recoverQuiz = function(name){
        questService.getQuest(name).then(function(res){
            $scope.quest = res;
            res.map(function(q){
                $scope.unAsweredQuestions.push(q.id);
            });
            questService.recoverQuiz().then(function(res){
                if(res.unAsweredQuestions.length){
                    $scope.unAsweredQuestions=res.unAsweredQuestions;
                    $scope.answeredQuestions=res.answeredQuestions;
                }
                $scope.showInfo(true);
                $scope.setScore(res.score);
                $location.path('/questions/'+ $scope.unAsweredQuestions[0]);
            });
        });
    }
}]);
app.controller('homeController',['$scope','questService','$location', function($scope,questService,$location) {
    $scope.init = function(){
        questService.startQuiz().then(function(res){
            if(res.isNew){
                $scope.isOldUser = false;
            }else{
                $scope.isOldUser = true;
                $scope.name = res.name;
            }
        });
    };
}]);
app.controller('questionController',['$scope','questService','$routeParams','$location','$timeout',
    function($scope,questService,$routeParams,$location, $timeout) {
        if(!questService.currentQuest){
            $location.path('/home');
        }
        var timer;
        $scope.counterTime = 60;

        $scope.question = questService.getQuestionById($routeParams.questionId);
        $scope.question.displayVariants =[];
        $scope.questionAnswered = false;
        $scope.quizFinished = false;
        $scope.question.variants.map(function(g){
            $scope.question.displayVariants.push({'text':g,'selected':false,color:'grey'});
        });
        $scope.skipQuestion=function(){
            $scope.unAsweredQuestions.push($scope.unAsweredQuestions[0]);
            $scope.unAsweredQuestions.shift();
            $location.path('/questions/'+ $scope.unAsweredQuestions[0]);
        };
        $scope.nextQuestion=function(){
            $location.path('/questions/'+ $scope.unAsweredQuestions[0]);
        };



        $scope.checkAnswer= function(){
            $scope.answeredQuestions.push($scope.unAsweredQuestions[0]);
            $scope.unAsweredQuestions.shift();
            var dataForSave = getDataForSave($scope.question,$scope.unAsweredQuestions,$scope.answeredQuestions),
                selected = dataForSave.selectedAnswers;
            questService.checkAnswer(dataForSave).then(function(res){
                if(res.status){
                    $scope.question.displayVariants = addColor('red',$scope.question.displayVariants,selected);
                    $scope.question.displayVariants = addColor('green',$scope.question.displayVariants,res.correctAnswers);
                    $scope.setScore(res.score);
                }else{
                    $scope.checkAnswer();
                    return;
                }
                if($scope.unAsweredQuestions.length){
                    $scope.questionAnswered = true;
                }else{
                    $scope.quizFinished = true;
                }
            });
        };


        var updateCounter = function() {
            $scope.counterTime--;
            timer = $timeout(updateCounter, 1000);

            if($scope.counterTime == 0) {
                $timeout.cancel(timer);
                timer = null;
                return $scope.checkAnswer();
            }
        };
        updateCounter();

        function getDataForSave(question,unAsweredQuestions,answeredQuestions){
            var selectedAnswers = [];
            question.displayVariants.map(function(g,i){
                if(g.selected){
                    selectedAnswers.push(i+1);
                }
            });
            return {'id':question.id,'selectedAnswers':selectedAnswers,unAsweredQuestions:unAsweredQuestions,answeredQuestions:answeredQuestions};
        }

        function addColor(color,variants,indexes){
            var len = indexes.length;
            while(len--){
                variants[indexes[len]-1].color = color;
            }
            return variants;
        }

    }]);
app.controller('resultController',['$scope','questService','$location', function($scope,questService,$location) {
    $scope.init = function(){
        $scope.showInfo(false);
        questService.finalScore().then(function(res){
            $scope.score = res.score;
            $scope.recomendation= getRecomendation($scope.score);
        });
    };
    $scope.restartQuiz = function(){
        questService.restartQuiz().then(function(res){
            $location.path('/home');
        });
    };
    function getRecomendation(score){
        if(score>200){
            return {color:'green',text: 'well done!!!!!'}
        }
        if(score>100){
            return {color:'orange',text: 'you can better!!!!!'}
        }else {
            return {color:'red',text: 'you Angular knowledge need more practice!!!!!'}
        }
    }
}]);