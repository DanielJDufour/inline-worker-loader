const { getOptions, getRemainingRequest } = require("loader-utils");
const { createFsFromVolume, Volume } = require("memfs");
const { dirname } = require("path");
const webpack = require("webpack");

function compile({ context, entry }) {
  const vol = new Volume();
  const fs = createFsFromVolume(vol);
  return new Promise((resolve, reject) => {
    const compiler = webpack({
      context: context || __dirname,
      mode: "production",
      entry,
    });
    compiler.outputFileSystem = fs;
    compiler.run((err, stats) => {
      if (err) return reject(err);
      const value = Object.values(vol.toJSON())[0];
      resolve(value);
    });
  });
}

async function loader(source, map, meta) {
  const options = getOptions(this);
  const { debug } = options;
  if (debug) console.log("[inline-worker-loader] starting");

  if (debug) console.log("[inline-worker-loader] resource", this.resource);

  const context = dirname(this.resource);
  if (debug) console.log("[inline-worker-loader] context:", context);

  const cb = this.async();

  if (debug)
    console.log(`[inline-worker-loader] source: "${source.substr(0, 500)}${source.length > 500 ? "..." : ""}"`);

  const regex = /(?<=new ([A-Za-z]+\.)?Worker\()((?!"data:)(?=["'`])[^\)]+)(?=\))/g;

  const data = {};
  let match;
  while ((match = regex.exec(source)) !== null) {
    if (debug) console.log("[inline-worker-loader] match:", match);
    const inside = match[2];
    if (debug) console.log("[inline-worker-loader] inside:", inside);
    const entry = match[2].substring(1, match[2].length - 1);
    if (debug) console.log("[inline-worker-loader] entry:", entry);
    const res = await compile({ context, entry });
    if (debug) console.log("[inline-worker-loader] res:", res.substr(0, 100), "...");
    const url = `data:application/javascript,${encodeURIComponent(res)}`;
    if (debug) console.log("[inline-worker-loader] url:", url.substr(0, 100), "...");
    data[inside] = url;
  }

  source = source.replace(regex, (match, _, inside) => JSON.stringify(data[inside]));

  cb(null, source, map, meta);
}

module.exports = loader;
