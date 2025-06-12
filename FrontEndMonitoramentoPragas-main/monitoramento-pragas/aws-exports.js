export const awsConfig = {
  Auth: {
    region: 'sa-east-1',
    userPoolId: 'sa-east-1_xxxxxxxx',
    userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxx',
    oauth: {
      domain: 'sa-east-1lxz6r1dm2.auth.sa-east-1.amazoncognito.com',
      scope: ['openid', 'email', 'profile'],
      redirectSignIn: 'http://localhost:5173/',
      redirectSignOut: 'http://localhost:5173/',
      responseType: 'code'
    }
  }
};
