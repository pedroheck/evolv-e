var ws = new WebSocket("ws://localhost:8181");

var texto = document.getElementById("text");
var intervalo = 1000; // período de tempo em que os dados serão enviados para o back (em milisegundos)

ws.onopen = function(e) {
    console.log('Connection to server opened');
    //IDEIA: mandamos os valores atuais para o back. O back salva em um array e retorna esse array
    // para ser utilizado pelos gráficos do front.

    /*Com isso, o backend (arquivo app.js) receberá no método ws.on("message", function(valoresAtuais) {...})
      Processa esses dados, chama seus próprios métodos e no final chama um ws.send(arrayDeDados) enviando
      um array com todos os dados que precisamos para cá.
    */
    // A página já inicia e manda os valores atuais
    enviaValoresAtuais();

  }

  var enviaValoresAtuais = function() {
    let valoresAtuais = [
     segundo,
     Carnivoro.carnivoros.length,
     Herbivoro.herbivoros.length
    ];
    ws.send(JSON.stringify(valoresAtuais)); // envia os valores em json
  }

  ws.onmessage = function(event) { // método padrão do websocket para conversar com o servidor
    // o parâmetro "event" é um objeto padronizado que o servidor está passando via ws.send()
    // os dados que precisamos estão armazenados dentro do atributo data
    let graficoEmJson = event.data;
    // convertendo json para javascript
    let dadosGrafico = JSON.parse(graficoEmJson);
    // envia os dados capturados para a função que atualizará os gráficos na tela
    atualizaGrafico(dadosGrafico);

  }

  // CHAMADO A PARTIR DO MÉTODO WS.ONMESSAGE()
  var atualizaGrafico = function(dados){
    console.log(dados);
    
    //TODO: atualizar o valor dos gráficos
    texto.value = dados.length;
    drawChart(dados);
  }

  // setamos um temporizador que envia os dados para o servidor no período de tempo desejado
  var temporizadorEnvioDeDados = setInterval(function() {enviaValoresAtuais()}, intervalo);

  ws.onclose = function(e) {
    console.log("Connection closed");
    if(typeof temporizadorEnvioDeDados !== 'undefined') {
      clearInterval(temporizadorEnvioDeDados); // desativar o temporizador
    }
  }
