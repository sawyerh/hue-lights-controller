const http = require("http");

const { HUE_IP, HUE_USER } = process.env;
const scenes = {
  day: {
    // White and bright - Equivalent to "Concentrate"
    bri: 254,
    ct: 233
  },
  night: {
    // Yellow and dimmed
    bri: 133,
    ct: 443
  }
};

async function runIt() {
  const hour = new Date().getHours();
  // From 7am - 8pm, use day mode
  const mode = hour > 7 && hour < 20 ? "day" : "night";

  // Find the bathroom
  const groups = await request("get", "/groups");
  const bathroomGroup = Object.values(groups).find(
    group => group.name === "Bathroom"
  );

  // Update the lights
  const scene = Object.assign({}, scenes[mode]);
  const lightsWereOff = !bathroomGroup.action.on;

  bathroomGroup.lights.forEach(async light => {
    const lightPath = `/lights/${light}/state`;

    if (lightsWereOff) {
      // We can't modify things if the lights aren't on, unfortunately.
      scene.on = true;
    }

    // Set the scene
    console.log(`Setting light #${light} to ${mode}`, scene);
    const sceneResponse = await request("PUT", lightPath, scene);
    console.log(sceneResponse);

    if (lightsWereOff) {
      // Turn the lights back off if they weren't before
      await wait(1);
      await request("PUT", lightPath, { on: false });
    }
  });
}

/**
 * Make an HTTP request
 * @param {"GET"|"POST"|"PUT"} method
 * @param {String} path
 * @param {Object} [body]
 * @returns {Promise}
 */
async function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://${HUE_IP}/api/${HUE_USER}${path}`, {
      method
    });

    req.on("error", reject);
    req.on("response", response => {
      let data = "";

      response.on("data", chunk => {
        data += chunk;
      });

      response.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Pause for a number seconds
 * @param {Number} seconds
 * @returns {Promise}
 */
async function wait(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

runIt();
