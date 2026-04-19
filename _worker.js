const REDIRECTS = {
  'yannservice.fr': 'https://yannservice.com/site-web',
  'www.yannservice.fr': 'https://yannservice.com/site-web',
  'yannwzservice.fr': 'https://yannservice.com/urgence',
  'www.yannwzservice.fr': 'https://yannservice.com/urgence',
  'yannwzservice.com': 'https://yannservice.com/urgence',
  'www.yannwzservice.com': 'https://yannservice.com/urgence',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = REDIRECTS[url.hostname];

    if (target) {
      return Response.redirect(target, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
