var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $sce) {

    $scope.totalUsuarios = 0;
    var socket = io.connect();
    
    function Peca() {
        this.cor = "";
        this.x = 0;
        this.y = 0;
        this.peca = "";
    }
    $scope.records = [
        1, 2, 3, 4, 5, 6, 7, 8
    ]

    $scope.pecas = [];

    for (let i = 1; i < 33; i++) {
        $scope.pecas.push(new Peca());
    }

    for (let i = 0; i < 8; i++) {
        $scope.pecas[i].cor = "white";
        $scope.pecas[i].x = 7;
        $scope.pecas[i].y = i + 1;
        $scope.pecas[i].peca = "&#9817;"
    }

    var casa = 0;
    for (let i = 16; i < 24; i++) {

        $scope.pecas[i].cor = "black";
        $scope.pecas[i].x = 2;
        $scope.pecas[i].y = casa + 1;
        $scope.pecas[i].peca = "&#9823;"
        casa++;
    }

    casa = 0;
    for (let i = 8; i < 16; i++) {
        $scope.pecas[i].cor = "white";
        $scope.pecas[i].x = 8;
        $scope.pecas[i].y = casa + 1;
        casa++;
    }

    var casa = 0;
    for (let i = 24; i < 32; i++) {

        $scope.pecas[i].cor = "black";
        $scope.pecas[i].x = 1;
        $scope.pecas[i].y = casa + 1;
        casa++;
    }

    $scope.pecas[8].peca = "&#9814;"
    $scope.pecas[9].peca = "&#9816;"
    $scope.pecas[10].peca = "&#9815;"
    $scope.pecas[11].peca = "&#9813;"
    $scope.pecas[12].peca = "&#9812;"
    $scope.pecas[13].peca = "&#9815;"
    $scope.pecas[14].peca = "&#9816;"
    $scope.pecas[15].peca = "&#9814;"

    $scope.pecas[24].peca = "&#9820;"
    $scope.pecas[25].peca = "&#9822;"
    $scope.pecas[26].peca = "&#9821;"
    $scope.pecas[27].peca = "&#9819;"
    $scope.pecas[28].peca = "&#9818;"
    $scope.pecas[29].peca = "&#9821;"
    $scope.pecas[30].peca = "&#9822;"
    $scope.pecas[31].peca = "&#9820;"


    console.log($scope.pecas);

    var casaNum = function (casa) {
        switch (casa) {
            case 'a': return 1; break;
            case 'b': return 2; break;
            case 'c': return 3; break;
            case 'd': return 4; break;
            case 'e': return 5; break;
            case 'f': return 6; break;
            case 'g': return 7; break;
            case 'h': return 8; break;

            default: break;
        }
    }

    var localPeca = function (x, y) {
        for (let i = 0; i < $scope.pecas.length; i++) {
            if ($scope.pecas[i].x == x && $scope.pecas[i].y == y) {
                return i;
            }
        };
    }

    var achaPeca = function (move) {
            var teste = move.split(" ");
            var casa1 = 0;
            var casa2 = parseInt(teste[0].charAt(teste[0].length - 1));
            var peca = "&#9817";

            if (teste[0].lenght == 3) {
                var pecaCode = teste[0].charAt(0);
                switch (pecaCode) {
                    case 'C': break;
                    default: break;
                }
                casa1 = casaNum(teste[0].charAt(1));
            }
            else
                casa1 = casaNum(teste[0].charAt(0));

            var i = localPeca(casa1, casa2);
            $scope.pecas[i].x = casaNum(teste[1].charAt(0));
            $scope.pecas[i].y = parseInt(teste[1].charAt(1));
            //return $scope.pecas[i];

    }//);


    $("form#chat").submit(function (e) {
        //if($scope.totalUsuarios < 2){
          //  alert("Esperar segundo jogador!")
            //return ;
        //}
        e.preventDefault();

        var mensagem = $(this).find("#texto_mensagem").val();
        var usuario = $("#lista_usuarios").val();
        //var peca = achaPeca(mensagem);

        socket.emit("enviar mensagem", { msg: mensagem, usu: usuario }, function () {

            $("form#chat #texto_mensagem").val("");
        });
    });
    socket.on("atualizar mensagens", function (mensagem) {
        var mensagem_formatada = $("<p />").text(mensagem.msg);
        //achaPeca(mensagem.msg);
        $("#historico_mensagens").append(mensagem_formatada);
    });
    socket.on("atualizar usuarios", function (usuarios) {
        //$scope.totalUsuarios = usuarios.length();
        $("#lista_usuarios").empty();
        $("#lista_usuarios").append("<option value=''>Todos</option>");
        $.each(usuarios, function (indice) {
            var opcao_usuario = $("<option />").text(usuarios[indice]);
            $("#lista_usuarios").append(opcao_usuario);
        });
    });
    $("form#login").submit(function (e) {
        e.preventDefault();
        socket.emit("entrar", $(this).find("#apelido").val(), function (valido) {
            if (valido) {
                $("#acesso_usuario").hide();
                $("#sala_chat").show();
            } else {
                $("#acesso_usuario").val("");
                alert("Nome já utilizado nesta sala");
            }
        });
    });

    socket.on("atualizar usuarios", function (usuarios) {
        $("#lista_usuarios").empty();
        $("#lista_usuarios").append("<option value=''>Todos</option>");
        $.each(usuarios, function (indice) {
            var opcao_usuario = $("<option />").text(usuarios[indice]);
            $("#lista_usuarios").append(opcao_usuario);
        });
    });

    socket.on("achaPeca", function (move) {
        // var mensagem_formatada = $("<p />").text(mensagem);
        // achaPeca(mensagem.msg);
        // $("#historico_mensagens").append(mensagem_formatada);
        var teste = move.split(" ");
        var casa1 = 0;
        var casa2 = parseInt(teste[0].charAt(teste[0].length - 1));
        var peca = "&#9817";

        if (teste[0].lenght == 3) {
            var pecaCode = teste[0].charAt(0);
            switch (pecaCode) {
                case 'C': break;
                default: break;
            }
            casa1 = casaNum(teste[0].charAt(1));
        }
        else
            casa1 = casaNum(teste[0].charAt(0));

        var i = localPeca(casa1, casa2);
        $scope.pecas[i].x = casaNum(teste[1].charAt(0));
        $scope.pecas[i].y = parseInt(teste[1].charAt(1));
        //return $scope.pecas[i];

        $scope.pecas.pop(i);

    });
    

});


app.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});