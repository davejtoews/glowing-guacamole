import service from 'feathers-mongoose';
import business from './business-model';
import hooks from './hooks';

export default function(){
  const app = this;

  let options = {
    Model: business,
    paginate: {
      default: 5,
      max: 100
    }
  };

  // Initialize our service with any options it requires
  app.use('/businesses', service(options));

  // Get our initialize service to that we can bind hooks
  const businessService = app.service('/businesses');

  // Set up our before hooks
  businessService.before(hooks.before);

  // Set up our after hooks
  businessService.after(hooks.after);
}
