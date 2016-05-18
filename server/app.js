(function() {
    var fs = require('fs');
    var _ = require('underscore');
    var express = require('express'),

    app = express();

    var db = {
        jogadores: JSON.parse(fs.readFileSync('data/jogadores.json').toString()),
        jogosPorJogador: JSON.parse(fs.readFileSync('data/jogosPorJogador.json').toString())
    };

    app.set('view engine', 'hbs');

    app.get('/', function(req, res) {
        res.render('index', db.jogadores);
    })

    app.get('/jogador/:id', function(req, res) {
     	var usuarios = _.find(db.jogadores.players, function(el) {
    		return el.steamid === req.params.id;
    	});

    	var jogos = db.jogosPorJogador[req.params.id];
    	jogos.dinheiroperdido = _.where(jogos.games, {
    		playtime_forever: 0
    	}).length;

    	jogos.games = _.sortBy(jogos.games, function(el) {
    		return -el.playtime_forever;
    	});

    	jogos.games = _.head(jogos.games, 5);

    	jogos.games = _.map(jogos.games, function(el) {
    		el.playtime_forever_h = Math.round(el.playtime_forever / 60);
    		return el;
    	});

    	res.render('jogador', {
    	    perfil: usuarios,
    	    gameInfo: jogos,
    	    favorite: jogos.games[0]
    	});
    });

    app.use(express.static(__dirname + '/../client'));

    var server = app.listen(3000, function() {        
        console.log('Servidor rodando em http://localhost:%s', server.address().port);
    })
})();
