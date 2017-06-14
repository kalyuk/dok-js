import * as path from 'path';

export default function () {
  return {
    default: {
      basePath: path.join(__dirname, '..'),
      id: 'example',
      services: {
        DatabaseService: {
          options: {
            instances: {
              db: {
                database: 'example',
                params: {
                  dialect: 'postgres',
                  host: 'localhost'
                },
                password: 'example',
                provider: 'sequelize',
                username: 'example'
              }
            }
          }
        },
        RouterService: {
          options: {
            routes: {
              'GET /': {
                actionName: 'index',
                controllerName: 'index'
              },
              'GET /json': {
                actionName: 'json',
                controllerName: 'index'
              },
              'GET /admin': {
                actionName: 'index',
                controllerName: 'admin'
              }
            }
          }
        }
      }
    }
  };
}