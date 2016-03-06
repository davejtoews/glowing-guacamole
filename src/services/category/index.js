import service from 'feathers-mongoose';
import category from './category-model';
import hooks from './hooks';

export default function(){
  const app = this;

  let options = {
    Model: category,
    paginate: {
      default: 100,
      max: 100
    }
  };

  // Initialize our service with any options it requires
  app.use('/categories', service(options));

  // Get our initialize service to that we can bind hooks
  const categoryService = app.service('/categories');

  // Set up our before hooks
  categoryService.before(hooks.before);

  // Set up our after hooks
  categoryService.after(hooks.after);
}
