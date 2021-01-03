export default class User {
  static resolve(user) {
    if (!user) {
      return Promise.resolve(null);
    }
    return user.getIdTokenResult(true).then(({ token, claims }) => {
      user = user.toJSON();
      user.token = token;
      user.role = claims.role;
      return user;
    });
  }
}
