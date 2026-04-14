function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        close: () => new Promise((closeResolve) => server.close(closeResolve))
      });
    });
  });
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch (error) {
      body = text;
    }
  }

  return {
    status: response.status,
    body
  };
}

function queuedPool(items = []) {
  const queue = [...items];
  return {
    calls: [],
    async query(sql, params) {
      this.calls.push({ sql, params });
      const next = queue.shift();

      if (next instanceof Error) {
        throw next;
      }

      return next || { rows: [] };
    }
  };
}

function queuedClient(items = []) {
  const queue = [...items];
  return {
    calls: [],
    released: false,
    async query(sql, params) {
      this.calls.push({ sql, params });
      const next = queue.shift();

      if (next instanceof Error) {
        throw next;
      }

      return next || { rows: [] };
    },
    release() {
      this.released = true;
    }
  };
}

module.exports = {
  listen,
  request,
  queuedPool,
  queuedClient
};
