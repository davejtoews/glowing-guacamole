import service from 'feathers-mongoose';
import event from './event-model';
import hooks from './hooks';

export default function(){
  const app = this;

  let options = {
    Model: event,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/events', service(options));

  // Get our initialize service to that we can bind hooks
  const eventService = app.service('/events');

  // Set up our before hooks
  eventService.before(hooks.before);

  // Set up our after hooks
  eventService.after(hooks.after);
}
