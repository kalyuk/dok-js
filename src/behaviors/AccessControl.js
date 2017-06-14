import {ResponseService} from '../web/ResponseService';

export function AccessControl(ctx, options = {}) {
  if (ctx.user && ctx.user.permissions && options.permissions) {
    let countPermissions = 0;

    options.permissions.forEach(permissionName => {
      if (ctx.user.permissions.indexOf(permissionName) !== -1) {
        countPermissions++;
      }
    });

    if (options.permissions.length === countPermissions) {
      return false;
    }
  }

  return {
    body: JSON.stringify({
      code: 401,
      message: 'Access deny',
      errors: []
    }),
    headers: {
      'Content-type': ResponseService.types.json
    },
    status: 401
  };

}