export default async function (ctx, rules) {

  if (!ctx.user) {
    return {
      headers: {
        Location: "/login"
      },
      state: 302
    };
  }

  const userRoles = await ctx.user.getRoleList();

  for (let i = 0; i < rules.length; i++) {
    if (rules[i].actions.indexOf(ctx.route.actionName.split("Action")[0]) !== -1) {
      for (let q = 0; q < userRoles.length; q++) {
        if (rules[i].roles.indexOf(userRoles[q]) !== -1) {
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