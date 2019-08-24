const axios = require("axios");

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
  const { data: groups } = await axios.get(apiUrl("groups"));
  const bathroomGroup = Object.values(groups).find(
    group => group.name === "Bathroom"
  );

  // Update the lights
  const scene = Object.assign({}, scenes[mode]);
  const lightsWereOff = !bathroomGroup.action.on;
  bathroomGroup.lights.forEach(async light => {
    const lightUrl = apiUrl(`lights/${light}/state`);

    if (lightsWereOff) {
      // We can't modify things if the lights aren't on, unfortunately.
      scene.on = true;
    }

    // Set the scene
    console.log(`Setting light #${light} to ${mode}`, scene);
    const { data: sceneResponse } = await axios.put(lightUrl, scene);
    console.log(sceneResponse);

    if (lightsWereOff) {
      // Turn the lights back off if they weren't before
      await wait(1);
      await axios.put(lightUrl, { on: false });
    }
  });
}

/**
 * API URL helper
 * @param {String} path - Exclude beginning slash
 */
function apiUrl(path) {
  return `http://${HUE_IP}/api/${HUE_USER}/${path}`;
}

/**
 * Pause for a number seconds
 * @param {Number} seconds
 */
function wait(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

runIt();
