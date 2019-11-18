const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketIO = require('@feathersjs/socketio');
const moment = require('moment');

// Ideas Service
class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    idea.time = moment().format('h:mm:ss a');

    this.ideas.push(idea);

    return idea;
  }
}

const app = express(feathers());

// Parse JSON
app.use(express.json());

// Configure socketIO realtime api
app.configure(socketIO());

// Enable Rest Service
app.configure(express.rest());

//Register Service
app.use('/ideas', new IdeaService());

//New connection connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));

// Publish event to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => {
  console.log(`Realtime service run on port ${PORT}`);
});
