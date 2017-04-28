export default async function (ctx, rules) {

  const user = ctx.session.get("user");

  if (!ctx.user && !user) {
    return {
      headers: {
        Location: "/login"
      },
      state: 302
    };
  }

  const roles = ctx.session.get("roles") || [];

  for (let i = 0; i < rules.length; i++) {
    if (rules[i].actions.indexOf(ctx.route.actionName.split("Action")[0]) !== -1) {
      for (let q = 0; q < roles.length; q++) {
        if (rules[i].roles.indexOf(roles[q]) !== -1) {
          return null;
        }
      }
    }
  }

  return {
    headers: {
      Location: "/403"
    },
    state: 302
  };


}