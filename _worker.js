const PRIMARY_HOST = 'yannservice.com';
const REDIRECT_HOSTS = new Set([
  'yannservice.fr',
  'www.yannservice.fr',
  'yannwzservice.com',
  'www.yannwzservice.com',
  'yannwzservice.fr',
  'www.yannwzservice.fr',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (REDIRECT_HOSTS.has(url.hostname)) {
      const target = `https://${PRIMARY_HOST}${url.pathname}${url.search}`;
      return Response.redirect(target, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
