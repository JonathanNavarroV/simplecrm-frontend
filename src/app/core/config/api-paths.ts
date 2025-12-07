import { environment } from '../../../environments/environment';

const apiBase = environment.azure.api.baseUrl.replace(/\/$/, '');

export const ApiPaths = {
  apiBase,
  authBase: `${apiBase}/auth`,
  users: `${apiBase}/auth/users`,
};
