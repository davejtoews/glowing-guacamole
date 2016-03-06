import { join } from 'path';
import { static as serveStatic } from 'feathers';
import favicon from 'serve-favicon';
import compress from 'compression';
import cors from 'cors';
import feathers from 'feathers';
import configuration from 'feathers-configuration';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest';
import bodyParser from 'body-parser';
import socketio from 'feathers-socketio';
import feathersAuth from 'feathers-authentication';
import middleware from './middleware';
import services from './services';
import expressHandle from 'express-handlebars';

let app = feathers();

app.configure(configuration(join(__dirname, '..')))
  .use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon( join(app.get('public'), 'favicon.ico') ))
  .use('/public', serveStatic(app.get('public')))
  .get('/', function(req, res){
    res.render('index');
  })
  .get('/nearme/:lat/:lng', function (req, res) {
    var minLat = Number(req.params.lat) - 0.01;
    var maxLat = Number(req.params.lat) + 0.01;
    var minLng = Number(req.params.lng) - 0.03;
    var maxLng = Number(req.params.lng) + 0.03;
    app.service('businesses').
      find({query:
        { 
          lat: {$gt: minLat, $lt: maxLat },
          lng: {$gt: minLng, $lt: maxLng },
          $limit: 100
        }
      }).then(function(results) {
         res.json(results);
      });
  })
  .engine('handlebars', expressHandle({defaultLayout:'main'}))
  .set('view engine', 'handlebars')
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(feathersAuth(app.get('auth').local))
  .configure(services)
  .configure(middleware);


export default app;
