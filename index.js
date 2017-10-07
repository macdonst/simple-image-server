'use strict';

const Path = require('path');
const Hapi = require('hapi');

const data = [
  {
    artist: 'Dave Wachter',
    image: 'images/DaveWachter.jpg'
  },
  { artist: 'Tom Fowler', image: 'images/TomFowler.jpg' },
  { artist: 'Tim Seeley', image: 'images/TimSeeley.jpg' },
  {
    artist: 'Mike Norton',
    image: 'images/MikeNorton.jpg'
  },
  {
    artist: 'Julian Lytle',
    image: 'images/JulianLytle.jpg'
  },
  {
    artist: 'Jeff Lemire',
    image: 'images/JeffLemire.jpg'
  },
  { artist: 'Jay Odjick', image: 'images/JayOdjick.jpg' },
  {
    artist: 'Francis Manupul',
    image: 'images/FrancisManupul.jpg'
  }
];

let index = 0;

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'images')
      }
    }
  }
});

server.connection({ port: 8974, host: 'localhost', routes: { cors: true } });

server.register(require('inert'), err => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply({
        artist: data[index].artist,
        image: 'http://localhost:8974/' + data[index].image
      });
      index++;
      if (index >= data.length) {
        index = 0;
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/images/{filename}',
    handler: {
      file: function(request) {
        return request.params.filename;
      }
    }
  });

  server.start(err => {
    if (err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
});
